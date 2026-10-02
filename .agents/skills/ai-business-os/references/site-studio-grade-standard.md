# Website Studio-Grade / Premium Portfolio Standard

## Purpose

DOKRUTI site должен одновременно продавать, объяснять, доказывать компетентность и быть портфолио будущих digital/creative услуг. «Премиально» = не больше анимации, а сильная идея + точная арт-дирекция + motion с функцией + безупречный responsive/technical execution.

## 1. Studio-grade test

Перед visual freeze спроси:
- есть ли одна узнаваемая governing idea;
- есть ли content-specific visual events, а не шаблонные карточки;
- есть ли meaningful motion/interaction, который объясняет изменение/причину/результат;
- выглядит ли mobile как полноценный дизайн, а не обрезанный desktop;
- есть ли типографический ритм, whitespace, композиционная смелость и порядок;
- есть ли trust/proof;
- есть ли performance/accessibility/reduced-motion;
- можно ли показать этот сайт потенциальному клиенту как пример работы уровня студии.

## 2. Motion architecture

Разрешённые типы motion выбираются по функции:
`hero state-change / scroll narrative / reveal / causal trace / before-after / data transformation / guided focus / microinteraction / hover-feedback / section transition / product demo / video integration`.

Каждая анимация отвечает на вопрос: **что посетитель понимает лучше благодаря движению?**

Запрещено:
- анимировать всё ради «вау»;
- тяжёлые эффекты, ухудшающие LCP/INP/CLS;
- движение, мешающее чтению;
- отсутствие `prefers-reduced-motion`/эквивалента;
- одинаковые generic cards с одинаковым fade-in.

## 3. About / founder page = trust utility, not biography dump

Страница «О проекте / Светлана» должна быстро ответить минимум на 5 посетительских вопросов:
1. **Кому и с какими задачами вы помогаете?**
2. **Что вы понимаете/делаете иначе и почему это полезно?**
3. **Почему вам можно доверять: опыт, доказательства, реальные работы, принципы?**
4. **Как вы работаете и чего не обещаете?**
5. **Что посетителю делать дальше?**

Личная история, путь создания DOKRUTI и интересные эпизоды добавляются только если усиливают эти ответы и доверие. Это не резюме по годам и не автобиография ради автобиографии.

## 4. Conversion completion states

Для любого завершённого действия (`заказ / заявка / подписка / скачивание / оплата / запись`) должен существовать продуманный **completion state** — страница/экран/сообщение, соответствующее фактическому маршруту.

Он объясняет:
`что успешно произошло → что будет дальше → когда → где найти результат/ответ → как связаться при проблеме → один уместный следующий шаг`.

Не создавать фиктивную Thank-you page, если на текущем сайте нет такого события. Для индексируемости/аналитики решение принимать по реальному сценарию.

## 5. FAQ / objection architecture

FAQ не вставляется автоматически. Создавай его там, где есть реальные повторяющиеся вопросы/возражения/поисковый интент.

Каждый ответ должен уменьшать неопределённость, риск или время выбора. Не раздувай FAQ десятками SEO-вопросов без реальной пользы.

## 6. Trust evidence layer

Как применимо:
- реальные примеры/кейсы;
- метод/принципы;
- прозрачные ограничения;
- авторство/экспертность;
- понятные контакты;
- юридические сведения там, где нужны;
- безопасность оплаты/выдачи;
- свежесть контента/данных;
- external proof без выдуманных логотипов/цифр.

## 7. Performance and search

Premium motion не отменяет page experience. Для реального сайта проверяй current Core Web Vitals, mobile, crawlability, accessibility, structured data where applicable, media weight and lazy-loading/streaming strategy.

Не утверждай, что «чем дольше человек на сайте, тем Яндекс/Google автоматически поднимет сайт». Видео может усиливать доверие/понимание/вовлечённость; влияние на поиск оценивается по текущим официальным источникам и фактической аналитике.

## 8. Portfolio consequence

Если DOKRUTI планирует продавать сайт/канал/creative implementation, сайт проходит ещё один вопрос:
**«Это доказательство уровня, за который бизнес заплатил бы значимую сумму, или просто аккуратный шаблон?»**

Если второе — visual freeze запрещён.

## 9. Current studio-reference scan

Before freezing a major visual direction, inspect a bounded sample of current high-end studio/product sites and extract **mechanics**, not copies: proprietary visual systems, art+UI combinations, concise copy, guided scrolling, dynamic typography, spatial/3D language, narrative interaction, motion restraint. Record `source/date → mechanic → why it works → fit to DOKRUTI → original adaptation → performance/accessibility risk`. Trends are inspiration, never mandatory templates.

## 10. Design-before-code visual freeze | r9 FINAL

When the material blocker is art direction/composition/originality, do not ask the implementation executor to invent the premium design while coding.

Required route:
`current render → reference mechanics → 2–3 materially different concepts when useful → selected DOKRUTI visual system → desktop proof → mobile proof → motion/interaction storyboard where material → VISUAL FREEZE → code → browser render → independent visual review`.

Low-risk technical/utility changes may remain code-first. Premium redesign does not.

The visual freeze may be a Figma file or another inspectable high-fidelity artifact. It must specify enough composition, type hierarchy, asset logic, states and motion intent that code production is implementation rather than open-ended art direction.

## 11. Executor graduation

Use [Artifact Outcome Evals / Executor Graduation](artifact-outcome-executor-graduation.md). Repeated similar Major/Critical visual failure after the rules are already explicit means the route/role is wrong, not automatically that the prompt needs more prose. Demote the weak executor from autonomous art direction and keep only the task classes it has actually passed.
