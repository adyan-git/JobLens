const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');

const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = (process.env.FRONTEND_URL || '').trim().replace(/\/$/, '');

function stripTrailingSlash(origin) {
  return (origin || '').replace(/\/$/, '');
}

/** Typical Vite / local dev: http://localhost:5173 or http://127.0.0.1:3000 */
function isLocalDevOrigin(origin) {
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

function isAllowedCorsOrigin(origin) {
  if (!origin) return true;

  const normalized = stripTrailingSlash(origin);
  if (frontendUrl && normalized === frontendUrl) return true;

  if (!isProduction) {
    if (!frontendUrl) return true;
    if (isLocalDevOrigin(origin)) return true;
    return false;
  }

  return Boolean(frontendUrl && normalized === frontendUrl);
}

const app = express();

if (isProduction && !frontendUrl) {
  console.warn(
    'FRONTEND_URL is not set; browser CORS will reject requests that send an Origin header until you set it.'
  );
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedCorsOrigin(origin));
    },
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('JobLens backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`server started on ${port}`);
    });
  })
  .catch((err) => {
    console.log('db connection failed:', err?.message || err);
    process.exit(1);
  });

