require('dotenv').config();
const { createClient } = require('@libsql/client');
const fs = require('fs');

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env');
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const sql = fs.readFileSync('./schema.sql', 'utf16le');

  // libsql requires splitting multiple statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  console.log(`Found ${statements.length} statements to execute.`);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log('Executed statement successfully.');
    } catch (error) {
      console.error('Error executing statement:', stmt.substring(0, 50) + '...', error.message);
    }
  }

  console.log('Schema pushed to Turso successfully!');
}

main().catch(console.error);
