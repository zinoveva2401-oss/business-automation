import { createHash } from 'node:crypto';

const OPEN='<!-- DOKRUTI_CONTENT_FACTORY_STATE_V1 ';
const CLOSE=' -->';
const sha256=value=>createHash('sha256').update(value).digest('hex');

function extractEnvelope(note='') {
  const start=note.indexOf(OPEN);
  if(start<0)return {humanNote:note.trim(),envelope:null};
  const jsonStart=start+OPEN.length,end=note.indexOf(CLOSE,jsonStart);
  if(end<0)throw new Error('Stored Content Factory envelope is truncated');
  const envelope=JSON.parse(note.slice(jsonStart,end));
  const humanNote=(note.slice(0,start)+' '+note.slice(end+CLOSE.length)).trim();
  return {humanNote,envelope};
}
function encodeNote(humanNote,envelope){return [humanNote.trim(),`${OPEN}${JSON.stringify(envelope)}${CLOSE}`].filter(Boolean).join('\n');}

/**
 * Durable adapter over Content System / 02_Выходы контент-завода / Примечание.
 * The connector must resolve the row by exact ID выхода each time; numeric row
 * positions and column offsets are deliberately outside this interface.
 */
export function createContentSystemStateStore({readOutputRecord,writeOutputNote}){
  if(typeof readOutputRecord!=='function'||typeof writeOutputNote!=='function')throw new TypeError('Content System read/write adapters are required');
  return {
    async load(outputId){
      const row=await readOutputRecord(outputId);
      if(!row||row.output_id!==outputId)throw new Error('Exact Content System output record was not found');
      const {envelope}=extractEnvelope(row.note??'');
      if(!envelope)return null;
      const {checksum,...body}=envelope;
      if(sha256(JSON.stringify(body))!==checksum)throw new Error('Persistent state checksum mismatch');
      if(body.output_id!==outputId)throw new Error('Persistent state belongs to another output');
      return body;
    },
    async save(outputId,state){
      if(!outputId||state?.output_id!==outputId||!state.run?.run_id)throw new TypeError('State must bind the exact output_id and run_id');
      const artifacts=state.artifacts??{publications:[],metric_learnings:[]};
      if(!Array.isArray(artifacts.publications??[])||!Array.isArray(artifacts.metric_learnings??[]))throw new TypeError('Persistent publication and analytics artifacts must be arrays');
      const row=await readOutputRecord(outputId);
      if(!row||row.output_id!==outputId)throw new Error('Exact Content System output record was not found');
      const existing=await this.load(outputId);
      const expectedRevision=existing?.storage_revision??0;
      if((state.storage_revision??0)!==expectedRevision)throw new Error('Stale state revision; reload and reconcile before write');
      const body={version:1,output_id:outputId,storage_revision:expectedRevision+1,updated_at:new Date().toISOString(),run:state.run,artifacts:{publications:artifacts.publications??[],metric_learnings:artifacts.metric_learnings??[]}};
      const envelope={...body,checksum:sha256(JSON.stringify(body))};
      const note=encodeNote(extractEnvelope(row.note??'').humanNote,envelope);
      const write=await writeOutputNote(outputId,note,{expectedNoteHash:sha256(row.note??''),field:'Примечание'});
      if(write?.conflict)throw new Error('Content System concurrent write conflict');
      const readback=await readOutputRecord(outputId);
      if(!readback||readback.output_id!==outputId||readback.note!==note)throw new Error('Content System state writeback readback mismatch');
      const confirmed=await this.load(outputId);
      if(!confirmed||confirmed.storage_revision!==expectedRevision+1||confirmed.run.run_id!==state.run.run_id)throw new Error('Content System state writeback verification failed');
      return confirmed;
    }
  };
}

export const CONTENT_SYSTEM_STATE_CONTRACT=Object.freeze({
  spreadsheet:'Контент-система | DOKRUTI | 2026',
  tab:'02_Выходы контент-завода',
  key:'ID выхода',
  field:'Примечание',
  protocol:['resolve row by exact output ID','read current note','compare note hash/revision','write only Примечание','read back exact value','verify state checksum and revision'],
  sensitiveData:'Never persist credentials, access tokens, private source text, or unnecessary personal data.'
});
