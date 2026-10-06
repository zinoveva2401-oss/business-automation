const required=['ID выхода','ID материала','Статус','TG route','TG media manifest','TG interaction payload','TG publish options'];
export function toTelegramPublisherInput(row){
  for(const field of required)if(row?.[field]===undefined)throw new TypeError(`Content System output is missing ${field}`);
  if(row['Статус']!=='Запланировано')throw new Error('Telegram publisher accepts only an approved scheduled output');
  return {output_id:row['ID выхода'],material_id:row['ID материала'],route:row['TG route'],media_manifest:row['TG media manifest'],interaction_payload:row['TG interaction payload'],publish_options:row['TG publish options'],content:row['Готовый текст / ТЗ'],cta:row.CTA,visual:row['Визуал'],scheduled_at:row['Плановое время публикации']};
}
export function fromTelegramPublisherReceipt(receipt,{materialId}={}){
  if(!receipt||!receipt.message_id||!receipt.url||!receipt.published_at)throw new TypeError('Publisher receipt must include message_id, url and published_at');
  if(!materialId)throw new TypeError('Source output material ID is required for analytics mapping');
  return {output_patch:{'Статус':'Опубликовано','ID публикации платформы':String(receipt.message_id),'URL публикации':receipt.url,'Фактическое время публикации':receipt.published_at},analytics_seed:{'ID материала':materialId,'ID публикации':String(receipt.message_id),'Площадка':'Telegram','URL':receipt.url,'Telegram message_id':String(receipt.message_id),'Дата':receipt.published_at,'Статус данных':'PENDING_READBACK'}};
}
