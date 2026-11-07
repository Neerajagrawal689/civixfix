require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const prisma = require('./src/config/prisma');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    const password = await bcrypt.hash('officer123', 10);
    
    await prisma.user.upsert({
      where: { email: 'officer@civicfix.gov' },
      update: {},
      create: {
        email: 'officer@civicfix.gov',
        password_hash: password,
        name: 'Chief Officer John',
        role: 'OFFICER'
      }
    });

    console.log('Officer created: officer@civicfix.gov / officer123');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
