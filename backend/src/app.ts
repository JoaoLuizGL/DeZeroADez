import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
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

// Get a single theme by ID
app.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const theme = await Theme.findById(id);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
});

export default app;
