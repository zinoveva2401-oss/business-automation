#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]; sys.path.insert(0,str(root/'scripts'))
from russian_language_gate import lint,repair
bad='PASS. Owner gate закрыт, first cut готов, handoff в Work.'
fs=lint(bad)
assert len(fs)>=4
fixed=repair(bad)
assert not lint(fixed), fixed
ok='Проверка пройдена. Решение Светланы получено. Первый монтаж готов. Передача исполнителю выполнена в Work.'
assert not lint(ok)
print('ПРОВЕРКА ПРОЙДЕНА')
print('русскоязычный шлюз: служебный английский блокируется и ремонтируется')
