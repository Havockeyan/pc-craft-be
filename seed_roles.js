const mongoose = require('mongoose');
require('dotenv').config();
const Role = require('./models/Role');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  await Role.deleteMany({}); // Clear existing roles for idempotency
  await Role.create([{ name: 'admin' }, { name: 'user' }]);
  console.log('Roles seeded');
  process.exit(0);
}).catch(err => {
  console.error('Error seeding roles:', err);
  process.exit(1);
});

