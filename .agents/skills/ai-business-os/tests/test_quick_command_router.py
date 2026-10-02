#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]; sys.path.insert(0,str(root/'scripts'))
from quick_command_router import suggest
x=suggest('Хочу понять, как будет выглядеть дашборд и показать архитектуру процесса')
cmds=[s.command for s in x]
assert '/дашборд' in cmds and '/схема' in cmds and len(cmds)<=3
x=suggest('Нужно смонтировать ролик с музыкой и субтитрами')
cmds=[s.command for s in x]
assert '/раскадровка' in cmds or '/монтаж' in cmds
x=suggest('Как будет выглядеть билборд на улице')
assert x and x[0].command=='/наружка' and x[0].auto_apply
print('ПРОВЕРКА ПРОЙДЕНА')
print('быстрые команды: автоподбор / максимум 3 / автоматическое применение очевидного маршрута')
