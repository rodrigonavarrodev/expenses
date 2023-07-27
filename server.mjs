// server.mjs
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { router } from './src/routes/router.mjs';
import mongoose from 'mongoose';
import config from './config.mjs';
import cors from 'cors';

const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', router);

// Serve static files (optional, for frontend)
app.use(express.static(__dirname + '/public'));

// Conectar a la base de datos
mongoose
  .connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

server.listen(config.serverPort, () => {
  console.log(`Server listening on port ${config.serverPort}`);
});
