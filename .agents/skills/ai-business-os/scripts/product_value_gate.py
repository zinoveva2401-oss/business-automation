#!/usr/bin/env python3
"""Reference Product Value Integrity checker.
Consumes a simple dict/JSON-like structure; real Product Factory also requires human buyer/editorial review.
"""
from dataclasses import dataclass

@dataclass
class Result:
    status:str
    defects:list[str]


def check(product:dict)->Result:
    defects=[]
    required=set(product.get('required_method_ids',[]))
    final=set(product.get('final_method_ids',[]))
    missing=sorted(required-final)
    if missing: defects.append('потеря обязательных смыслов: '+', '.join(missing))
    sections=product.get('sections',[])
    if not sections: defects.append('нет разделов для проверки')
    for s in sections:
        if int(s.get('new_value_units',0)) < 1:
            defects.append(f"раздел без новой ценности: {s.get('id','?')}")
        if s.get('mostly_repeat'):
            defects.append(f"повтор/вода: {s.get('id','?')}")
    thirds=product.get('thirds',{})
    if thirds:
        vals=[thirds.get(k,0) for k in ('first','middle','last')]
        if min(vals,default=0) <= 0 or (max(vals)-min(vals) > max(2, max(vals)*0.5)):
            defects.append('неравномерная глубина первой/средней/последней трети')
    if product.get('free_ai_replaceable') is True:
        defects.append('продукт почти заменяется обычным бесплатным ИИ')
    if product.get('aha_count',0) < product.get('minimum_aha',1):
        defects.append('недостаточно неочевидной полезной новизны')
    if product.get('calendar_challenge') and not product.get('calendar_mechanism_required'):
        defects.append('календарный челлендж добавлен без механической необходимости')
    return Result('ПРОВЕРКА ПРОЙДЕНА' if not defects else 'ТРЕБУЕТ ИСПРАВЛЕНИЯ', defects)
