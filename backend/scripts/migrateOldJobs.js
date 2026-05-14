/**
 * One-time migration: assign userId to Job documents created before auth.
 *
 * How to run (from the backend folder):
 *   node scripts/migrateOldJobs.js
 *
 * Before running:
 *   1. Set TARGET_USER_EMAIL below to the account that should own legacy jobs.
 *   2. Ensure backend/.env has a valid MONGO_URI (same as the app).
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDb = require('../config/db');
const Job = require('../models/Job');
const User = require('../models/User');

/** Change this to your real user email before running. */
const TARGET_USER_EMAIL = 'adyan2k4@gmail.com';

const jobsMissingUserIdFilter = {
  $or: [{ userId: { $exists: false } }, { userId: null }],
};

async function main() {
  await connectDb();

  const email = TARGET_USER_EMAIL.trim().toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    console.error(`Migration stopped: no user found for email "${email}".`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const matchedBefore = await Job.countDocuments(jobsMissingUserIdFilter);
  if (matchedBefore === 0) {
    console.log('No jobs without userId found. Nothing to update.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const result = await Job.updateMany(jobsMissingUserIdFilter, {
    $set: { userId: user._id },
  });

  console.log(`User: ${user.email} (${user._id})`);
  console.log(`Jobs matched (missing userId): ${result.matchedCount}`);
  console.log(`Jobs updated: ${result.modifiedCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Migration failed:', err?.message || err);
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch {
    // ignore
  }
  process.exit(1);
});
