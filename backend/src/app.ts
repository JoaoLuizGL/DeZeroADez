import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { Theme } from './models/Theme';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Get all themes
app.get('/', async (req: Request, res: Response) => {
  try {
    const themes = await Theme.find();
    res.status(200).json(themes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch themes' });
  }
});

export default app;
