import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Theme } from './models/Theme';
import { Image } from './models/Image';
import { User } from './models/User';
import { config } from './config';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Authentication Middleware
const authenticate = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, config.jwtSecret);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Auth Routes
app.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, config.jwtSecret, { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user: any = await User.findOne({ username: login });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// User Routes
app.patch('/users/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Ensure user is updating their own profile
    if ((req as any).user._id.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }

    const user: any = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = password; // The pre-save hook will hash this
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully',
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Post an image
app.post('/images', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const newImage = new Image({ data });
    const savedImage = await newImage.save();
    
    // Return only the ID which will be used in imageUrl
    res.status(201).json({ id: savedImage._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get an image by ID
app.get('/images/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

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
app.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl, items } = req.body;
    const user = (req as any).user;

    if (!name || !description || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields: name, description, and items (array)' });
    }

    const newTheme = new Theme({
      name,
      description,
      imageUrl,
      items,
      creator: user.username,
    });

    const savedTheme = await newTheme.save();
    res.status(201).json(savedTheme);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create theme' });
  }
});

// Get themes for the logged-in user
app.get('/themes/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const themes = await Theme.find({ creator: user.username });
    res.status(200).json(themes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your themes' });
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

// Update a theme
app.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, items } = req.body;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const theme = await Theme.findById(id);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    // Check if the authenticated user is the creator
    if (theme.creator !== user.username) {
      return res.status(403).json({ error: 'Forbidden: You are not the creator of this theme' });
    }

    if (name) theme.name = name;
    if (description) theme.description = description;
    if (imageUrl) theme.imageUrl = imageUrl;
    if (items) theme.items = items;

    const updatedTheme = await theme.save();
    res.status(200).json(updatedTheme);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

export default app;
