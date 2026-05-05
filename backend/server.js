const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('JobLens backend is running');
});

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

