#!/usr/bin/env python3
"""Reference blocking lint for owner/customer/public Russian text.
It catches avoidable service jargon; it is not a grammar checker.
"""
from dataclasses import dataclass
import re

DEFAULT_MAP={
 'pass':'проверка пройдена','fail':'проверка не пройдена','owner gate':'решение Светланы',
 'first cut':'первый монтаж','handoff':'передача исполнителю','workflow':'рабочий процесс',
 'dispatcher':'диспетчер исполнения','write-back':'запись состояния','strongest route':'сильнейший маршрут',
 'source of truth':'источник истины','owner-facing':'для Светланы','customer-facing':'для клиента',
 'ready':'готово','blocked':'заблокировано','pending':'ожидает','release':'выпуск','candidate':'кандидат',
 'critical':'критический','major':'существенный','scope':'границы задачи','output':'результат','input':'исходные данные',
 'acceptance':'критерий готовности','evidence':'доказательство','blocker':'блокирующая проблема','next action':'следующее действие',
 'brief':'краткое ТЗ','hook':'хук/зацепка','cover':'обложка','thumbnail':'миниатюра/обложка','motion':'анимация',
}
ALLOWED_PATTERNS=[r'\bAPI\b',r'\bURL\b',r'\bHTML\b',r'\bCSS\b',r'\bJavaScript\b',r'\bChatGPT\b',r'\bCodex\b',r'\bWork\b',r'\bDOKRUTI\b']

@dataclass
class Finding:
    term:str
    replacement:str


def lint(text:str):
    masked=text
    for pat in ALLOWED_PATTERNS:
        masked=re.sub(pat,'',masked,flags=re.I)
    low=masked.lower()
    out=[]
    for term,repl in DEFAULT_MAP.items():
        if term in low:
            out.append(Finding(term,repl))
    return out


def repair(text:str):
    out=text
    for term,repl in DEFAULT_MAP.items():
        out=re.sub(re.escape(term),repl,out,flags=re.I)
    return out

if __name__=='__main__':
    import sys
    data=sys.stdin.read()
    fs=lint(data)
    if fs:
        for f in fs: print(f'{f.term} -> {f.replacement}')
        raise SystemExit(1)
    print('ПРОВЕРКА ПРОЙДЕНА: лишний служебный английский не найден')
