# Channel capability preflight — 2026-10-06

Срез отражает свежую проверку официальных источников и доступов DOKRUTI. Этот файл маршрутизирует исполнение; он не заменяет повторную проверку перед canary.

## Telegram — live adapter сохранён

Контент-система подтверждает действующий Apps Script Publisher для `@dokruti_biz`, доступ администратора и автоматическую публикацию. Существующий route не менялся. Дальнейшие изменения только через отдельные regression-контракты Content Factory.

## VK — внешний USER OAuth wait

Применять свежие данные владельца: VK app 54808225 создано; group token даёт `groups.getMembers`, но `wall.get`, `stats.get` и `photos.getWallUploadServer` завершились VK error 27. Запрос прав USER-scope уже отправлен. Group token не использовать для публикации/аналитики. Ждать ответ VK; после разрешения настроить callback в существующем Apps Script, один OAuth consent, затем отдельные canary community/personal и readback. Не создавать проект Publisher, не отправлять дубль запроса и не повторять setup.

## MAX — официальный API подходит, доступ DOKRUTI ещё не проверен

Проверено 06.10.2026 по [MAX Bot API — отправка сообщений](https://dev.max.ru/docs-api/methods/POST/messages), [загрузка медиа](https://dev.max.ru/docs-api/methods/POST/uploads), [чтение сообщений/постов](https://dev.max.ru/docs-api/methods/GET/messages) и [добавление бота в каналы](https://dev.max.ru/docs-api/use-cases/bot-in-chats-and-channels): канал поддерживает официальный `POST /messages`, медиа — через `/uploads`, readback — через `GET /messages`. Для публикации боту требуется право администратора `write`; чтение истории требует `read_all_messages`; статистика канала — `view_stats`. Объект поста может содержать публичный URL и счётчики просмотров/репостов.

Публичная страница DOKRUTI `https://max.ru/channel_dokruti_biz` и вход владельца через web подтверждены в Content System. Bot token, membership, права публикации, readback и stats для DOKRUTI не подтверждены. Runtime adapter готов для auth/capability canary после безопасной настройки секрета и прав. API docs перечисляют текст/медиа, но не параметр отложенной публикации; до появления такого официального параметра планировать запуском из устойчивой очереди, а не заявлять native scheduling.

## Дзен — официальная публикация доступна через Studio; API не подтверждён

На 06.10.2026 проверка публичной документации не выявила официального стабильного авторского publishing API. Авторский профиль и вход в браузере были подтверждены Content System 05.10.2026. Маршрут: нативный draft в существующем Content System → видимое управление через авторизованную Dzen Studio → сохранить точное состояние draft/scheduled/published → открыть публичный URL и сверить readback. Не использовать сторонние/скрытые endpoints. Если управляемая UI-автоматизация не проходит live capability canary, оставить контролируемый полуавтоматический шаг в Studio.

## vc.ru — официально поддерживаемый publishing API не подтверждён

На 06.10.2026 в официальной публичной документации vc.ru не найден внешний поддерживаемый author publishing API. В сети есть документация/SDK для Osnova, но это не подтверждает официальный статус, стабильность или разрешение для DOKRUTI; internal/private endpoints не использовать. Live Content System указывает пустой профиль и только публичное чтение, без подтверждённого входа автора. Подготовленный нативный draft и контролируемый переход владельца в обычный редактор vc.ru допустимы после получения доступа; повторно публиковать уже опубликованный материал без согласования нельзя. Публикации не должны превращаться в однотипный спам или рекламный блог; это ограничивают [правила vc.ru](https://vc.ru/rules).

## Instagram — официальный publishing API есть, фактическая eligibility DOKRUTI неизвестна

Meta официально поддерживает content publishing для professional Instagram accounts через Instagram Platform. Проверенный маршрут использует OAuth, `/{ig-id}/media` → `/{ig-id}/media_publish` и последующую проверку статуса/readback; метрики доступны в API для разрешённого аккаунта. См. [Meta Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) и [Meta Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api).

Content System пока подтверждает только публичный `@svetlana.24011982` с 34 followers/11 публикациями, старым retail-positioning и отсутствующим login на компьютере. Не подтверждены Business/Creator type, связанная Facebook Page, Page Publishing Authorization, Meta app и permissions/token. Поэтому DOKRUTI eligibility = UNKNOWN, API canary не готов. Точный owner action: восстановить вход, проверить account type и linked Page, затем один consent существующему/разрешённому Meta app, если оно есть. Не менять тип аккаунта и не запускать сторонний browser automation без решения владельца. До этого — пакет нативного draft; публикация через Meta Business Suite как ручной approved UI route.

## Каналы и video

MAX — готовность к mocked regression и owner-auth canary после выдачи доступа. Дзен — готовность к draft/UI capability canary. vc.ru и Instagram — draft-ready, live account authorization pending. Video production plan формируется из approved master и не блокирует параллельные публикационные каналы. Отсутствующие метрики всегда остаются `UNKNOWN`, а не нулём.
