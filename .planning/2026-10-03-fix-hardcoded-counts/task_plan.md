# Task Plan: Remove hardcoded demo counts from seeded talents

## Goal

Make like/vote/comment counts honest: seeded talents should start at 0 (or realistic starter values) so the frontend shows counts that grow from real user interactions instead of inflated demo numbers like "125.4k", "1M".

## Next Step

Zero out the hardcoded counts in seedData.js talents and users, re-seed, and verify counts.

## Current Phase

Phase 3: Implementation

## Phases

### Phase 1: Requirements & Discovery

- [x] Understand user intent: frontend shows hardcoded fake counts (2.5k, 1M)
- [x] Root cause: seedData.js injects inflated demo numbers directly into talents.likes/views/comments_count/votes and users.likes/votes/score
- **Status:** complete

### Phase 2: Planning & Structure

- [x] Approach: seed talents/users with 0 counts; counts grow only from real like/vote/comment actions
- [x] Also keep mockData.ts frontend fallback consistent (used only when backend offline)
- **Status:** complete

### Phase 3: Implementation

- [x] Zero likes/views/comments_count/votes in seedData.js talent rows
- [x] Zero users likes/votes (kept score/rank) in seedData.js
- [x] Re-run seed and verify backend returns 0-count talents
- [x] Zero mockTalents/mockLeaderboard counts in frontend mockData.ts fallback
- **Status:** complete

### Phase 4: Testing & Verification

- [x] Verify backend talents return 0/real counts
- [x] Verify like/vote/comment increments work from 0
- **Status:** complete

### Phase 5: Delivery

- [x] Review output files
- [x] Deliver to user
- **Status:** complete

## Key Questions

1. Should seeded demo talents start at 0 or a small realistic baseline? -> Start at 0 so counts are 100% honest; they grow from real interactions.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Seed talents with 0 for likes/views/comments_count/votes | Counts must reflect real interactions only |
| Leave seeded user `rank`/`score` as ranking display data (not interaction counts) | Keeps leaderboard visually useful; scores still grow via vote/publish |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes

- The frontend already renders real server counts correctly; the problem was only the fake seed data.