# Channel profile: Instagram

## Текущая capability

Официальный Meta Instagram Platform поддерживает создание и публикацию медиа для подходящих professional accounts. Перед интеграцией проверь фактический type аккаунта, linked Facebook Page (для выбранного login route), Meta app, permissions, Page Publishing Authorization и публичную доступность export media. Не считать наличие публичного профиля доказательством API eligibility.

## Native production

Создавай отдельные Reels/video/image/carousel версии из approved master. Используй собственную речь/позицию только с подтверждённым источником; готовь вертикальный экспорт, встроенные читаемые captions, cover, короткую подпись и alt text где поддерживается. Нативный Instagram package не равен публикации.

## Publish, readback и insights

Для официального API сначала выполни owner OAuth с минимальными scopes; публикуй только approved payload. Применяй официальный create-container → status polling → media_publish → media readback маршрут. Сохраняй external media ID, permalink, фактическое время, попытки и результат сверки. Метрики запрашивай только с соответствующими разрешениями; missing/unsupported fields = UNKNOWN. Media source URL должен быть доступен Meta во время запроса. Никогда не передавай токен в log/Git/Content System.

## Fallback

Если DOKRUTI account ещё consumer/personal, business/creator linking отсутствует или permission review не пройден, оставь публикацию в draft и подготовь owner-пакет для Meta Business Suite. Не использовать private endpoints, парольную автоматизацию или неразрешённый scraper.

## Источники и live статус

Проверено 06.10.2026: [Meta — Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/), [Meta — Instagram API](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api). В Content System найден `@svetlana.24011982`, однако вход на компьютере не восстановлен; professional type, Page link, app/scopes/token неизвестны. Статус DOKRUTI eligibility = UNKNOWN. См. `capability-preflight-2026-10-06.md`.
