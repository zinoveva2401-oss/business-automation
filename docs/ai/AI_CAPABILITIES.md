# AI_CAPABILITIES

Статус: действующий time-stamped snapshot, проверен 13.09.2026.
Проект: `Докрути`.

Этот файл не заменяет live discovery конкретной сессии. Фактически доступный runtime имеет приоритет.

## 1. Подтверждённые repository capabilities

- Astro/TypeScript workspace: `npm run dev`, `npm run build`, `npm run preview`, `npm run check` из `package.json`.
- Repo-local adapter: `.qwen/skills/karpathy-guidelines/SKILL.md`.
- Active contracts: `AGENTS.md`, `docs/ai/`, `docs/ARTICLE_IMPORT.md`, `docs/PRODUCT_EXECUTION.md`.

## 2. Подтверждённые Codex skills

В текущем runtime обнаружены и пригодны по применимости: `astro-seo`, `design-review`, `frontend-design`, `kill-ai-slop`, `playwright`, `playwright-interactive`, `security-best-practices`, `screenshot`, `find-skills`, `ai-business-os`, `define-goal`, а также системные `openai-docs`, `imagegen`, `documents`, `pdf`, `presentations`, `spreadsheets`.

Наличие не означает обязательность чтения. Skill выбирается по классу и риску задачи; сайт в этой SYSTEM-задаче не переделывается.

## 3. Подтверждённые runtime tools/connectors

Фактической проверкой текущей среды подтверждены:

- `multi_agent_v1` — spawn/wait/send/close subagents;
- Google Drive — authenticated profile, file metadata, native Google Docs text, Google Sheets metadata/ranges;
- GitHub — authenticated profile, repository metadata и repo permissions;
- Playwright MCP — browser navigation, snapshot, screenshot, console/network and interaction;
- Context7 — documentation resolution/query;
- Figma MCP — tool surface обнаружен; authentication/use нужно проверять при конкретной задаче;
- Codex app tools, `image_gen`, local shell and workspace file operations.

Остальные приложения/плагины не считаются доступными для этой задачи без live call. Изменяемые external writes, OAuth, публикация, удаление и платные actions требуют отдельного owner gate.

## 4. Google Drive readiness

Google Drive/Sheets доступен из Codex read-only маршрутом и не требует owner action в текущей сессии. Проверены профиль владельца, spreadsheet `Бизнес-система`, sheet tabs и metadata/version/status целевых Docs. Не хранить OAuth tokens, passwords или API secrets в Git.

## 5. Capability gap protocol

Если нужного средства нет, сообщить:

```text
CAPABILITY GAP
Что требуется → почему текущих средств недостаточно → тип средства → существующая альтернатива → обязательное/желательное → ожидаемая польза
```

До разрешения владельца не устанавливать Skill, MCP, plugin, package, model или service.
