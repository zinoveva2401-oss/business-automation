# AI_CAPABILITIES

Статус: действующий time-stamped snapshot, проверен 22.09.2026.
Проект: `Докрути`.

Этот файл не заменяет live discovery конкретной сессии. Фактически доступный runtime имеет приоритет.

## 1. Подтверждённые repository capabilities

- Astro/TypeScript workspace: `npm run dev`, `npm run build`, `npm run preview`, `npm run check` из `package.json`.
- Active contracts: `AGENTS.md`, `docs/ai/`, `docs/ARTICLE_IMPORT.md`, `docs/PRODUCT_EXECUTION.md`, `docs/design/DESIGN.md`.
- Repo Skill: `.agents/skills/dokruti-web-design/SKILL.md`; frontmatter and manual structure checks pass. The official validator remains blocked by missing `PyYAML`; PyYAML was not installed.

## 2. Подтверждённые Codex skills

В текущем runtime обнаружены и пригодны по применимости: repo `dokruti-web-design`; official Product Design `0.1.55`; Build Web Apps `0.1.2` / `frontend-app-builder`; `imagegen`; `playwright`; `playwright-interactive`; `screenshot`; in-app Browser/CUA; а также системные `openai-docs`, `documents`, `pdf`, `presentations`, `spreadsheets`.

Наличие не означает обязательность чтения. Skill выбирается по классу и риску задачи; сайт в этой SYSTEM-задаче не переделывается.

## 3. Подтверждённые runtime tools/connectors

Фактической проверкой текущей среды подтверждены:

- CLI `codex-cli 0.155.0-alpha.9.2`; configured Desktop app version hint `26.915.31945`.
- `multi_agent` — stable/enabled in `codex features list`; `multi_agent_v2` — stable/false.
- Native subagent: `ENVIRONMENT-BLOCKED`. Fresh CLI probe в `-s read-only` не дошла до delegation: `failed to initialize in-process app-server client: Отказано в доступе (os error 5)` при открытии `C:\Users\user\.codex\state_5.sqlite`; current Desktop surface также не содержит spawn tool. Это не заменено через `create_thread`.
- Google Drive/Sheets — authenticated read-only profile, spreadsheet metadata/ranges, live `Бизнес-система`, DEC-147 readback;
- Figma MCP — authenticated account, seat `View`; write capability не доказана и не является обязательной;
- Browser/CUA, ImageGen, local shell and workspace file operations; official Product Design/Build Web Apps/Playwright/Screenshot skill files доступны.

Различать `CONFIGURED` и `CALLABLE`: `.codex/config.toml` содержит `agents.enabled=true`, но это не является доказательством callable native subagent. При `NATIVE_SUBAGENT = UNAVAILABLE` применяется sequential internal checklist и обязательный внешний Business OS QA.

Остальные приложения/плагины не считаются доступными для этой задачи без live call. Изменяемые external writes, OAuth, публикация, удаление и платные actions требуют отдельного owner gate. Production/site visual work в этой проверке не выполнялся.

## 4. Google Drive readiness

Google Drive/Sheets доступен из Codex read-only маршрутом и не требует owner action в текущей сессии. Проверены профиль владельца, spreadsheet `Бизнес-система`, sheet tabs и metadata/version/status целевых Docs. Не хранить OAuth tokens, passwords или API secrets в Git.

## 5. Capability gap protocol

Если нужного средства нет, сообщить:

```text
CAPABILITY GAP
Что требуется → почему текущих средств недостаточно → тип средства → существующая альтернатива → обязательное/желательное → ожидаемая польза
```

До разрешения владельца не устанавливать Skill, MCP, plugin, package, model или service.
