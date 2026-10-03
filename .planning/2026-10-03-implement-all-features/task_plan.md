# Task Plan: Real two-way direct messaging between any two users

## Goal

Replace the demo-only messaging (seeded inbox owned by lead-1 + canned auto-replies) with production-real, two-way DM between any two registered users — every user gets their own inbox, can start a conversation, and stale threads must not leak across user switches.

## Next Step

Implement backend: schema index, createConversation, mirrored sendMessage, users-search endpoint, and multi-user seeding.

## Current Phase

Phase 3: Backend implementation

## Phases

### Phase 1: Requirements & Discovery

- [x] Understand why auto-reply triggered (canned AUTO_REPLIES inject on every send)
- [x] Remove demo auto-reply (backend controller + frontend contract)
- [x] Identify why other users see stale messages and cannot send (seed only lead-1; no conversation create; state never cleared on logout/user switch)
- **Status:** complete

### Phase 2: Planning & Structure

- [x] Decide real-DM data model (two conversation rows per pair; sender enum per owner-view)
- [x] Decide endpoints (POST /api/conversations, GET /api/users, mirrored POST /:id/messages)
- **Status:** complete

### Phase 3: Implementation

- [ ] Schema: add UNIQUE(user_id, contact_id) to conversations
- [ ] Backend: createConversation (get-or-create own thread with a real user)
- [ ] Backend: sendMessage mirrors message into peer thread + unread bump
- [ ] Backend: listConversations joins live user data + marks read
- [ ] Backend: GET /api/users search endpoint + register route
- [ ] Seed: conversations/messages for all seeded users (not just lead-1)
- [ ] Frontend: clear chatThreads/notifications on logout + overwrite on login
- [ ] Frontend: api.getUsers + api.createConversation
- [ ] Frontend: InboxView "new message" UI
- **Status:** in_progress

### Phase 4: Testing & Verification

- [ ] Verify all requirements met
- [ ] Document test results in progress.md
- [ ] Restart backend + verify with two users
- **Status:** pending

### Phase 5: Delivery

- [ ] Review all output files
- [ ] Ensure deliverables are complete
- [ ] Deliver to user
- **Status:** pending

## Key Questions

1. How to model real DM with the existing `sender ENUM('user','contact')` schema? -> Two conversation rows per pair (one owned by each side); a user's own messages are `sender='user'`, the peer's are `sender='contact'`. No schema breaking change to `messages`.
2. Where should "start a conversation" live in the UI? -> "+" button in the inbox header opening a user search/message modal.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Keep two `conversations` rows per pair (owner + contact_id), contact data joined live from `users` | Preserves the existing frontend ChatThread contract and per-user inbox, no migration of messages |
| `sendMessage` mirrors into the peer thread as `sender='contact'` and bumps only the peer's unread_count | Both sides get real conversation history; unread stays meaningful |
| `listConversations` sets unread_count=0 after building the response | Opening the inbox marks messages read |
| New `GET /api/users` search endpoint for the message picker | Users need an entry point to start a real conversation |
| Frontend always overwrites chatThreads with fetch result (even empty) and clears on logout | Kills stale-data leakage between user sessions |
| Seed a conversation graph across all seeded users | Every demo account has a real, populated inbox |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| Canned auto-reply still appeared after code change | 1 | Root cause: backend process (PID 71895) still ran old code; restarted `npm start` detached (new PID 125230) |
| bash `&` background job killed on shell timeout | 2 | Use `setsid nohup ... & disown` so backend survives |

## Notes

- `npm start` has no `--watch`; any backend edit needs a manual restart.
- Two vite dev servers were running; the live one on :3000 is the newer PID.