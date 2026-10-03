-- ============================================================
-- Talent Showcase — MySQL schema (1st update: auth + homepage)
--
-- DATABASE NAME: talent_showcase
--
-- Create it with:
--   mysql -u root -p < schema.sql
-- Then seed demo data with:
--   cd backend && npm install && npm run seed
-- ============================================================

CREATE DATABASE IF NOT EXISTS talent_showcase
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE talent_showcase;

-- ---------------- Users (login / registration) ----------------
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(50)  PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  name          VARCHAR(210) NOT NULL,
  handle        VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar        TEXT         NULL,
  role          ENUM('creator','audience') NOT NULL DEFAULT 'creator',
  category      VARCHAR(50)  NULL,
  location      VARCHAR(255) NOT NULL DEFAULT '',
  bio           TEXT         NULL,
  talent_count  INT          NOT NULL DEFAULT 0,
  score         INT          NOT NULL DEFAULT 0,
  likes         INT          NOT NULL DEFAULT 0,
  votes         INT          NOT NULL DEFAULT 0,
  `rank`        INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------- Talents (homepage / dashboard feed) ----------------
CREATE TABLE IF NOT EXISTS talents (
  id             VARCHAR(50)  PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  type           ENUM('audio','video','text') NOT NULL,
  category       VARCHAR(50)  NOT NULL,
  author_name    VARCHAR(210) NOT NULL,
  author_handle  VARCHAR(100) NOT NULL,
  author_avatar  TEXT         NULL,
  author_location VARCHAR(255) NULL,
  author_rank    INT          NULL,
  is_verified    TINYINT(1)   NOT NULL DEFAULT 0,
  created_label  VARCHAR(50)  NULL,
  likes          INT          NOT NULL DEFAULT 0,
  views          INT          NOT NULL DEFAULT 0,
  comments_count INT          NOT NULL DEFAULT 0,
  votes          INT          NOT NULL DEFAULT 0,
  description    TEXT         NULL,
  thumbnail      TEXT         NULL,
  content_url    TEXT         NULL,
  poem_text      JSON         NULL,
  audio_duration VARCHAR(20)  NULL,
  tags           JSON         NULL,
  audio_waveform JSON         NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_talents_type (type),
  INDEX idx_talents_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------- Talent content interactions (like / vote / save) ----------------
-- One row per (user, talent) holding that user's like/vote/save state.
CREATE TABLE IF NOT EXISTS content_interactions (
  user_id    VARCHAR(50) NOT NULL,
  talent_id  VARCHAR(50) NOT NULL,
  liked      TINYINT(1)  NOT NULL DEFAULT 0,
  voted      TINYINT(1)  NOT NULL DEFAULT 0,
  saved      TINYINT(1)  NOT NULL DEFAULT 0,
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, talent_id),
  INDEX idx_ci_talent (talent_id),
  INDEX idx_ci_user_saved (user_id, saved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------- Comments ----------------
CREATE TABLE IF NOT EXISTS comments (
  id            VARCHAR(50)  PRIMARY KEY,
  talent_id     VARCHAR(50)  NOT NULL,
  user_id       VARCHAR(50)  NOT NULL,
  author_name   VARCHAR(210) NOT NULL,
  author_avatar TEXT         NULL,
  text          TEXT         NOT NULL,
  likes         INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_comments_talent (talent_id),
  INDEX idx_comments_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------- Per-user comment likes ----------------
CREATE TABLE IF NOT EXISTS comment_likes (
  user_id    VARCHAR(50) NOT NULL,
  comment_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, comment_id),
  INDEX idx_cl_comment (comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------- Conversations (owned per app user) ----------------
CREATE TABLE IF NOT EXISTS conversations (
  id               VARCHAR(50)  PRIMARY KEY,
  user_id          VARCHAR(50)  NOT NULL,
  contact_id       VARCHAR(50)  NOT NULL,
  contact_name     VARCHAR(210) NOT NULL,
  contact_avatar   TEXT         NULL,
  contact_handle   VARCHAR(100) NULL,
  contact_online   TINYINT(1)   NOT NULL DEFAULT 0,
  contact_location VARCHAR(255) NULL,
  last_message     VARCHAR(500) NULL,
  unread_count     INT          NOT NULL DEFAULT 0,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_conversations_user (user_id),
  UNIQUE KEY uk_conversations_owner_contact (user_id, contact_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------- Messages ----------------
CREATE TABLE IF NOT EXISTS messages (
  id              VARCHAR(50) PRIMARY KEY,
  conversation_id VARCHAR(50) NOT NULL,
  sender          ENUM('user','contact') NOT NULL,
  text            TEXT        NOT NULL,
  created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_messages_conversation (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------- Notifications ----------------
CREATE TABLE IF NOT EXISTS notifications (
  id           VARCHAR(50)  PRIMARY KEY,
  user_id      VARCHAR(50)  NOT NULL,
  type         ENUM('like','vote','follow','milestone','comment') NOT NULL,
  actor_name   VARCHAR(210) NOT NULL,
  actor_avatar TEXT         NULL,
  message      TEXT         NULL,
  talent_title VARCHAR(255) NULL,
  talent_id    VARCHAR(50)  NULL,
  is_read      TINYINT(1)   NOT NULL DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notifications_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
