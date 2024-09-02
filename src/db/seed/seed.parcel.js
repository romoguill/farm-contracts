require('dotenv').config({
  path: './.env.local',
});

const { Client } = require('pg');
const fs = require('node:fs/promises');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: false,
});

async function seedDB() {
  try {
    await client.connect();
    console.log('Connected to DB');

    const fileHandle = await fs.readFile('./src/db/seed/parcel.sql', 'utf-8');
    console.log('Loaded sql file');

    await client.query(fileHandle);
    console.log('Succesfully seeded db');
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
}

console.log('Starting seed');
seedDB();
