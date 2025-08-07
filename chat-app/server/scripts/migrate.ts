import fs from 'fs';
import path from 'path';
import { pool } from '../src/config/database';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');

    const migrationPath = path.join(__dirname, '..', 'src', 'config', 'migrations.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await pool.query(sql);
    
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();