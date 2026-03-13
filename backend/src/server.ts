import app from './app';
import { connectDB } from './db';
import { config } from './config/index';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Start Express Server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running in ${config.nodeEnv} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();
