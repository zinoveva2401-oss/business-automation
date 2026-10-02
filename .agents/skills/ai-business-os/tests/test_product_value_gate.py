#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]; sys.path.insert(0,str(root/'scripts'))
from product_value_gate import check
bad={
 'required_method_ids':['M1','M2','M3'],'final_method_ids':['M1','M2'],
 'sections':[{'id':'S1','new_value_units':1},{'id':'S2','new_value_units':0,'mostly_repeat':True}],
 'thirds':{'first':5,'middle':1,'last':1},'free_ai_replaceable':True,'aha_count':0,'minimum_aha':2,
 'calendar_challenge':True,'calendar_mechanism_required':False}
r=check(bad); assert r.status=='ТРЕБУЕТ ИСПРАВЛЕНИЯ' and len(r.defects)>=5
ok={
 'required_method_ids':['M1','M2'],'final_method_ids':['M1','M2'],
 'sections':[{'id':'S1','new_value_units':3},{'id':'S2','new_value_units':2},{'id':'S3','new_value_units':2}],
 'thirds':{'first':4,'middle':4,'last':3},'free_ai_replaceable':False,'aha_count':5,'minimum_aha':3,
 'calendar_challenge':False}
r=check(ok); assert r.status=='ПРОВЕРКА ПРОЙДЕНА' and not r.defects
print('ПРОВЕРКА ПРОЙДЕНА')
print('Product Value: сохранение смысла / плотность / AHA / free-AI / long-book / calendar restraint')
