const mongoose = require('mongoose');

async function connectDb() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in .env');
  }

  if (mongoUri.includes('your_mongodb_atlas_connection_string_here')) {
    throw new Error('MONGO_URI still has the placeholder value');
  }

  await mongoose.connect(mongoUri);
  console.log('mongo connected');
}

module.exports = connectDb;

