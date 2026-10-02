#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'scripts'))
from entity_resolver import Entity, resolve

existing=[
 Entity('task','CONTENT-FACTORY-002','RUN-CONTENT-FACTORY-002',
        'Дошить единый Контент-завод полного цикла',
        'Одна сырая идея превращается в strongest route, production, QA и learning',
        'контент завод creative production'),
 Entity('task','VIDEO-SKILL-AUDIT-001','RUN-VIDEO-SKILL-AUDIT-001',
        'Дошить монтажный контур и проверить на реальном видео',
        'Система сама строит концепцию, first cut, critique, repair, final',
        'видео монтаж production'),
 Entity('content','CNT-0049','',
        'Почему клиент разворачивается у двери',
        'Сильный founder content test',
        'помещение продает раньше товара фотопечать сувениры'),
]

def check(cond,msg):
    if not cond: raise AssertionError(msg)

# Same stable task with new wording -> update.
r=resolve(Entity('task','CONTENT-FACTORY-002',goal='Добавить хуки, монтаж и карусели'),existing)
check(r.action=='UPDATE_EXISTING','same ID must update existing')

# New defect/stage in same RUN -> attach, not new parent.
r=resolve(Entity('task','',parent_run='RUN-VIDEO-SKILL-AUDIT-001',goal='Музыка перекрывает речь'),existing)
check(r.action=='ATTACH_CHILD','defect in same RUN must attach')

# Same content idea, new derivative format -> update canonical content object.
r=resolve(Entity('content','',goal='Клиент уходит из маленькой точки еще у двери',central_intent='фотопечать сувениры помещение продает раньше товара'),existing)
check(r.action in {'UPDATE_EXISTING','REVIEW_AMBIGUOUS'},'same central content intent must not auto-create')

# Truly distinct objective -> create.
r=resolve(Entity('task','',goal='Настроить end-to-end оплату и выдачу продукта',acceptance='успешная оплата выдача чек возврат',central_intent='payment delivery'),existing)
check(r.action=='CREATE_NEW','distinct objective should create new object')

# Stale install wording with same rollout ID -> update.
rollout=[Entity('task','BSYS-003','',goal='Business OS runtime and installed skill state',acceptance='active version verified')]
r=resolve(Entity('task','BSYS-003',goal='v2.0.10 installed fresh chat smoke'),rollout)
check(r.action=='UPDATE_EXISTING','stale rollout state must update existing row')

print('PASS')
print('entity resolver: stable-id / parent-run / semantic-dedupe / distinct-new / stale-state')
