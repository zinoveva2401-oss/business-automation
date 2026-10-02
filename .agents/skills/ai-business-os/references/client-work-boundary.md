# Conditional client-work boundary

This module defines a future-compatible boundary only. It does not create a Client Factory, client project, client record, storage system or new workflow now.

The shared Business OS may serve `DOKRUTI_INTERNAL` or future `CLIENT_WORK`, but every task must bind explicitly to one context before reading project-specific sources or producing output.

## Context isolation contract

- `DOKRUTI_INTERNAL`: use DOKRUTI's live Business System, brand, offers, product/site/content sources, files and access rules.
- `CLIENT_WORK`: use only the identified client's authorized brief, brand guide, data, files, environments and access. Do not import DOKRUTI private state, claims, customer data, assets, credentials or unpublished strategy into client work.
- Shared modules may provide methods, checklists, generic code patterns and professional roles. Client identity/state/data/files/permissions stay in their authorized client project/source. Never create a parallel copy of the entire Business OS for each client.
- Before cross-context transfer, classify the material. Generic reusable know-how must be stripped of client-identifying, confidential, personal and licensed material. If permission or provenance is unclear, stop that transfer.
- Keep credentials in the approved secret manager/environment. Do not place client secrets in chat, repo, shared memory or DOKRUTI-owned files.
- If the client identity, scope, data rights, source of truth or access boundary is missing, mark `OWNER/CLIENT INPUT REQUIRED`; do not guess or cross-read another context.

This contract remains dormant unless a future authorized client task selects `CLIENT_WORK`.
