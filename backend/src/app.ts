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

// Create a new theme
app.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl, items, creator } = req.body;

    if (!name || !description || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields: name, description, and items (array)' });
    }

    const newTheme = new Theme({
      name,
      description,
      imageUrl,
      items,
      creator: creator || 'Original',
    });

    const savedTheme = await newTheme.save();
    res.status(201).json(savedTheme);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create theme' });
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
