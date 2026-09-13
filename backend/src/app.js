import cors from 'cors';
import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import talentRoutes from './routes/talentRoutes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'talent-showcase-backend' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/talents', talentRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
