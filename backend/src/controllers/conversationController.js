import { pool } from '../config/db.js';

function mapMessage(row) {
  return {
    id: row.id,
    sender: row.sender,
    text: row.text,
    timestamp: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
  };
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Load the owner's thread by id, ensuring it belongs to the given user.
async function getOwnedThread(threadId, userId) {
  const [rows] = await pool.query(
    `SELECT c.*,
            u.name  AS contact_name,
            u.avatar AS contact_avatar,
            u.handle AS contact_handle,
            u.location AS contact_location
       FROM conversations c
       JOIN users u ON u.id = c.contact_id
      WHERE c.id = ? AND c.user_id = ? LIMIT 1`,
    [threadId, userId],
  );
  return rows[0] || null;
}

function toThread(c) {
  return {
    id: c.id,
    contact: {
      id: c.contact_id,
      name: c.contact_name,
      avatar: c.contact_avatar,
      handle: c.contact_handle,
      online: Boolean(c.contact_online),
      location: c.contact_location || 'Bangladesh',
    },
    lastMessage: c.last_message || '',
    timestamp: c.updated_at
      ? new Date(c.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
      : '',
    unreadCount: c.unread_count,
    messages: [],
  };
}

// GET /api/conversations (auth) — list the user's threads with messages.
export async function listConversations(req, res) {
  try {
    const [convs] = await pool.query(
      `SELECT c.*,
              u.name AS contact_name,
              u.avatar AS contact_avatar,
              u.handle AS contact_handle,
              u.location AS contact_location
         FROM conversations c
         JOIN users u ON u.id = c.contact_id
        WHERE c.user_id = ?
        ORDER BY c.updated_at DESC`,
      [req.userId],
    );

    const result = [];
    for (const c of convs) {
      const [msgs] = await pool.query(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 200',
        [c.id],
      );
      result.push({ ...toThread(c), messages: msgs.map(mapMessage) });
    }

    // Opening the inbox marks threads as read.
    await pool.query('UPDATE conversations SET unread_count = 0 WHERE user_id = ?', [req.userId]);

    return res.json({ conversations: result });
  } catch (err) {
    console.error('[conversations-list]', err.message);
    return res.status(500).json({ error: 'Could not load conversations' });
  }
}

// POST /api/conversations (auth) — start (or fetch) a thread with a real user.
export async function createConversation(req, res) {
  const { contactId } = req.body || {};

  if (!contactId) {
    return res.status(400).json({ error: 'contactId is required' });
  }
  if (contactId === req.userId) {
    return res.status(400).json({ error: 'You cannot message yourself' });
  }

  try {
    const [contacts] = await pool.query(
      'SELECT id, name, handle, avatar, location FROM users WHERE id = ? LIMIT 1',
      [contactId],
    );
    if (contacts.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const contact = contacts[0];

    const [existing] = await pool.query(
      'SELECT * FROM conversations WHERE user_id = ? AND contact_id = ? LIMIT 1',
      [req.userId, contactId],
    );

    let convId;
    if (existing.length > 0) {
      convId = existing[0].id;
    } else {
      convId = newId('conv');
      await pool.query(
        `INSERT INTO conversations
           (id, user_id, contact_id, contact_name, contact_avatar, contact_handle,
            contact_online, contact_location, last_message, unread_count)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, '', 0)
         ON DUPLICATE KEY UPDATE id = id`,
        [
          convId,
          req.userId,
          contact.id,
          contact.name,
          contact.avatar || null,
          contact.handle || null,
          contact.location || 'Bangladesh',
        ],
      );
    }

    const row = await getOwnedThread(convId, req.userId);
    return res.status(201).json({ conversation: toThread(row) });
  } catch (err) {
    console.error('[conversations-create]', err.message);
    return res.status(500).json({ error: 'Could not start conversation' });
  }
}

// POST /api/conversations/:id/messages (auth) — send a message, mirrored to the peer.
export async function sendMessage(req, res) {
  const { id } = req.params;
  const { text } = req.body || {};

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  try {
    const conv = await getOwnedThread(id, req.userId);
    if (!conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    const cleanText = String(text).trim();
    const peerUserId = conv.contact_id;

    // 1. Insert the sender's message into their own thread.
    const userMsgId = newId('msg');
    await pool.query(
      'INSERT INTO messages (id, conversation_id, sender, text) VALUES (?, ?, ?, ?)',
      [userMsgId, id, 'user', cleanText],
    );

    await pool.query('UPDATE conversations SET last_message = ? WHERE id = ?', [cleanText, id]);

    // 2. Mirror into the peer's thread (their view sees it as from the contact).
    const [peerRows] = await pool.query(
      'SELECT id FROM conversations WHERE user_id = ? AND contact_id = ? LIMIT 1',
      [peerUserId, req.userId],
    );
    if (peerRows.length > 0) {
      const peerMsgId = newId('msg');
      await pool.query(
        'INSERT INTO messages (id, conversation_id, sender, text) VALUES (?, ?, ?, ?)',
        [peerMsgId, peerRows[0].id, 'contact', cleanText],
      );
      await pool.query(
        'UPDATE conversations SET last_message = ?, unread_count = unread_count + 1 WHERE id = ?',
        [cleanText, peerRows[0].id],
      );
    }

    return res.status(201).json({
      userMessage: mapMessage({ id: userMsgId, sender: 'user', text: cleanText, created_at: new Date() }),
      lastMessage: cleanText,
    });
  } catch (err) {
    console.error('[conversations-send]', err.message);
    return res.status(500).json({ error: 'Could not send message' });
  }
}