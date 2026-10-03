// Seeds demo users + homepage talents into the `talent_showcase` database.
// Usage:
//   1) mysql -u root -p < schema.sql
//   2) copy .env.example to .env and set your DB credentials
//   3) npm install
//   4) npm run seed
//
// All seeded users share the password:  password123

import bcrypt from 'bcryptjs';
import { pool } from './src/config/db.js';
import { SEED_PASSWORD, seedConversations, seedNotifications, seedTalents, seedUsers } from './seedData.js';

function toJson(value) {
  if (value === null || value === undefined) return null;
  return JSON.stringify(value);
}

try {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const u of seedUsers) {
    await pool.query(
      `INSERT INTO users
         (id, first_name, last_name, name, handle, email, password_hash,
          avatar, role, category, location, bio,
          talent_count, score, likes, votes, \`rank\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         name = VALUES(name),
         handle = VALUES(handle),
         avatar = VALUES(avatar),
         role = VALUES(role),
         category = VALUES(category),
         location = VALUES(location),
         bio = VALUES(bio),
         talent_count = VALUES(talent_count),
         score = VALUES(score),
         likes = VALUES(likes),
         votes = VALUES(votes),
         \`rank\` = VALUES(\`rank\`)`,
      [
        u.id, u.firstName, u.lastName, u.name, u.handle, u.email, passwordHash,
        u.avatar, u.role, u.category, u.location, u.bio,
        u.talentCount, u.score, u.likes, u.votes, u.rank,
      ],
    );
  }
  console.log(`[seed] Upserted ${seedUsers.length} users (password for all: "${SEED_PASSWORD}")`);

  for (const t of seedTalents) {
    await pool.query(
      `INSERT INTO talents
         (id, title, type, category, author_name, author_handle, author_avatar,
          author_location, author_rank, is_verified, created_label,
          likes, views, comments_count, votes, description, thumbnail, content_url,
          poem_text, audio_duration, tags, audio_waveform)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title), type = VALUES(type), category = VALUES(category),
         author_name = VALUES(author_name), author_handle = VALUES(author_handle),
         author_avatar = VALUES(author_avatar), author_location = VALUES(author_location),
         author_rank = VALUES(author_rank), is_verified = VALUES(is_verified),
         created_label = VALUES(created_label), likes = VALUES(likes), views = VALUES(views),
         comments_count = VALUES(comments_count), votes = VALUES(votes),
         description = VALUES(description), thumbnail = VALUES(thumbnail),
         content_url = VALUES(content_url), poem_text = VALUES(poem_text),
         audio_duration = VALUES(audio_duration), tags = VALUES(tags),
         audio_waveform = VALUES(audio_waveform)`,
      [
        t.id, t.title, t.type, t.category, t.authorName, t.authorHandle, t.authorAvatar,
        t.authorLocation, t.authorRank, t.isVerified, t.createdLabel,
        t.likes, t.views, t.commentsCount, t.votes, t.description, t.thumbnail, t.contentUrl,
        toJson(t.poemText), t.audioDuration, toJson(t.tags), toJson(t.audioWaveform),
      ],
    );
  }
  console.log(`[seed] Upserted ${seedTalents.length} talents`);

  // Build a lookup of seeded users so conversation contacts match stored data.
  const userById = new Map(seedUsers.map((u) => [u.id, u]));
  for (const conv of seedConversations) {
    const contact = userById.get(conv.contactId) || {};
    const lastMsg = conv.messages.length
      ? conv.messages[conv.messages.length - 1].text
      : '';
    await pool.query(
      `INSERT INTO conversations
         (id, user_id, contact_id, contact_name, contact_avatar, contact_handle,
          contact_online, contact_location, last_message, unread_count)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         contact_name = VALUES(contact_name),
         contact_avatar = VALUES(contact_avatar),
         contact_handle = VALUES(contact_handle),
         contact_location = VALUES(contact_location),
         last_message = VALUES(last_message)`,
      [
        conv.id,
        conv.userId,
        conv.contactId,
        contact.name || 'Contact',
        contact.avatar || null,
        contact.handle || null,
        contact.location || 'Bangladesh',
        lastMsg,
      ],
    );

    for (const m of conv.messages) {
      await pool.query(
        `INSERT INTO messages (id, conversation_id, sender, text)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE text = VALUES(text)`,
        [`${conv.id}-${m.sender}-${m.text.length}-${Math.abs([...m.text].reduce((a, c) => a + c.charCodeAt(0), 0))}`, conv.id, m.sender, m.text],
      );
    }
  }
  console.log(`[seed] Upserted ${seedConversations.length} conversations`);

  for (const n of seedNotifications) {
    await pool.query(
      `INSERT INTO notifications
         (id, user_id, type, actor_name, actor_avatar, message, talent_title, talent_id, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE
         actor_name = VALUES(actor_name), actor_avatar = VALUES(actor_avatar),
         message = VALUES(message), talent_title = VALUES(talent_title),
         talent_id = VALUES(talent_id)`,
      [
        n.id,
        n.userId,
        n.type,
        n.actorName,
        n.actorAvatar || null,
        n.message,
        n.talentTitle || null,
        n.talentId || null,
      ],
    );
  }
  console.log(`[seed] Upserted ${seedNotifications.length} notifications`);

  console.log('[seed] Done.');
} catch (err) {
  console.error('[seed] Failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
