# Task Plan: Auto-capture video thumbnails from the uploaded file

## Goal

Video posts get a real thumbnail captured from the user's uploaded video file (via hidden video + canvas frame grab) instead of the same hardcoded Unsplash stock photo for every video.

## Next Step

Done — committed and pushed. Follow-up candidate: persist the video file itself (backend stores SAMPLE_VIDEO_URL; frontend blob URL dies on reload).

## Current Phase

Phase 5: Delivery (complete)

## Phases

### Phase 1: Requirements & Discovery

- [x] User asked where video-post thumbnails come from -> hardcoded Unsplash placeholders per type (backend PLACEHOLDER_THUMBNAILS + modal fallback)
- [x] User chose: auto-capture from video
- **Status:** complete

### Phase 2: Planning & Structure

- [x] Approach: frontend grabs a frame (canvas -> JPEG dataURL) on video select; sends as `thumbnail` in createTalent; backend stores it; placeholder only as fallback
- [x] Constraints found: express.json limit 1mb (raise to 5mb); talents.thumbnail TEXT 64KB (ALTER to MEDIUMTEXT + update schema.sql); mapper already passes thumbnail through
- **Status:** complete

### Phase 3: Implementation

- [x] New `frontend/src/utils/videoThumbnail.ts` with captureVideoThumbnail()
- [x] UploadTalentModal: capture on video file select, show preview, send thumbnail, use in response + offline fallback, reset state
- [x] api/client.ts: add `thumbnail?: string` to CreateTalentPayload
- [x] Backend createTalent: accept and store client thumbnail (fallback to placeholder)
- [x] app.js: raise express.json limit 1mb -> 5mb
- [x] schema.sql: talents.thumbnail TEXT -> MEDIUMTEXT; ALTER live DB (verified mediumtext)
- [x] Restart backend (no --watch on npm start)
- **Status:** complete

### Phase 4: Testing & Verification

- [x] tsc --noEmit clean
- [x] POST /api/talents with thumbnail dataURL stores + returns it (verified exact match)
- [x] Missing thumbnail falls back to placeholder (verified)
- **Status:** complete

### Phase 5: Delivery

- [x] Commit + push
- [x] Deliver to user
- **Status:** complete

## Key Questions

1. Frame capture size vs DB column? -> Capture at max 480px wide JPEG (~30-60KB), shrink to 320px if >60k chars; MEDIUMTEXT removes the ceiling.
2. Capture failure (corrupt file, codec)? -> Resolve null, fall back to the existing placeholder thumbnail. Never blocks publishing.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| New utils/videoThumbnail.ts file | Capture logic is reusable/testable; stuffing it into confetti.ts or the modal would be wrong |
| Keep placeholder as fallback | Capture can fail; publishing must never break |
| Raise body limit + MEDIUMTEXT | dataURL thumbnails are tens of KB; default 1mb/64KB limits are borderline |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes

- Known out-of-scope limitation: the video *file* itself is never uploaded (backend stores SAMPLE_VIDEO_URL; frontend uses a session blob URL). Only the thumbnail now persists for real.
