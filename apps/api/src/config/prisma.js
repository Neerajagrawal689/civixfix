require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL || 'libsql://civicfix-neeraj-agrawal-525.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
