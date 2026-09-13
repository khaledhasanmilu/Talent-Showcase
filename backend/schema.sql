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
