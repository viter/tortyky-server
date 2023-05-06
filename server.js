import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import tortyRoutes from './routes/api/torty.js';
import korzhiRoutes from './routes/api/korzhi.js';
import register from './routes/api/register.js';
import auth from './routes/api/auth.js';
import refresh from './routes/api/refresh.js';
import logout from './routes/api/logout.js';
import { corsOptinos } from './config/cors.js';
import { verifyJWT } from './middleware/verifyJWT.js';
import { credentials } from './middleware/credentials.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;

app.use(credentials);

app.use(cors(corsOptinos));

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/register', register);
app.use('/auth', auth);
app.use('/refresh', refresh);
app.use('/logout', logout);

//app.use(verifyJWT);
app.use('/torty', tortyRoutes);
app.use('/korzhi', korzhiRoutes);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('application/json')) {
    res.json({ error: '404 Not Found' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
