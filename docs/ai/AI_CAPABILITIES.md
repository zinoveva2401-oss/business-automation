# AI_CAPABILITIES

Статус: ACTIVE  
Проект: `Докрути`

Этот файл хранит репозиторные возможности и известные gaps. Возможности внешних агентов/моделей/плагинов всегда проверяются в их фактической среде и не считаются вечными.

## Repository capabilities

### Skills
- `.qwen/skills/karpathy-guidelines/SKILL.md` — инженерная дисциплина и верификация.

### Build
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check`

### Content Collections
- `src/content/articles/`
- `src/content/tools/`
- `src/content/services/`
- `src/content.config.ts`

### QA
- Playwright / `.playwright-cli/` — если доступен в текущей среде.

### Static assets
- `public/`

## External agents

Codex, Qwen и другие внешние агенты могут работать с репозиторием. Их модели, thinking mode, квоты, плагины, MCP и инструменты не фиксируются здесь как гарантированное текущее состояние.

Единая точка входа для любого агента — `AGENTS.md`.

## Capability gap

Если качественное выполнение требует отсутствующего средства:

```text
CAPABILITY GAP
Что нужно → почему текущего недостаточно → существующая альтернатива → обязательное/желательное → ожидаемая польза
```

Ничего не устанавливать без разрешения владельца.

## Known gaps

CI/CD не считать настроенным, пока это не подтверждено фактической конфигурацией репозитория. Текущий обязательный минимум проверки сайта: `npm run check` + `npm run build` + доступный visual/route QA.
