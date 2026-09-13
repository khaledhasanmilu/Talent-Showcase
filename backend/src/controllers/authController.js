import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { buildHandle, mapUserPublic } from '../utils/mappers.js';
import { signToken } from '../utils/jwt.js';

// POST /api/auth/register
export async function register(req, res) {
  const { firstName, lastName, email, password, avatar, role, category } = req.body || {};

  if (!firstName || !String(firstName).trim() || !lastName || !String(lastName).trim()) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  const safeRole = role === 'audience' ? 'audience' : 'creator';

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [
      String(email).trim().toLowerCase(),
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const name = `${String(firstName).trim()} ${String(lastName).trim()}`;
    const id = `user-${Date.now()}`;
    const passwordHash = await bcrypt.hash(String(password), 10);

    await pool.query(
      `INSERT INTO users
        (id, first_name, last_name, name, handle, email, password_hash, avatar, role, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        String(firstName).trim(),
        String(lastName).trim(),
        name,
        buildHandle(name),
        String(email).trim().toLowerCase(),
        passwordHash,
        avatar || null,
        safeRole,
        category || null,
      ],
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return res.status(201).json({ token: signToken(id), user: mapUserPublic(rows[0]) });
  } catch (err) {
    console.error('[register]', err.message);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !String(email).trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [
      String(email).trim().toLowerCase(),
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    return res.json({ token: signToken(user.id), user: mapUserPublic(user) });
  } catch (err) {
    console.error('[login]', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}

// GET /api/auth/me
export async function me(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: mapUserPublic(rows[0]) });
  } catch (err) {
    console.error('[me]', err.message);
    return res.status(500).json({ error: 'Could not load profile' });
  }
}
