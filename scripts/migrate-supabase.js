#!/usr/bin/env node

/**
 * Supabase Migration Helper
 * 
 * Prepares all migrations for easy copy-paste execution in Supabase Dashboard
 * 
 * Usage: node scripts/migrate-supabase.js
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_PROJECT_URL = 'https://supabase.com/dashboard/project/snrjxwutqxokeujuiepn/sql/new';

async function main() {
  console.log('🚀 Supabase Migration Helper\n');
  console.log('=' .repeat(70));
  
  const migrationsDir = path.join(__dirname, '../apps/ekza/supabase/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('⚠️  No migration files found');
    return;
  }

  console.log(`\n📦 Found ${files.length} migration(s) to execute:\n`);

  files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('📋 QUICK SETUP INSTRUCTIONS:');
  console.log('='.repeat(70));
  console.log('\n1. Open Supabase Dashboard:');
  console.log(`   ${SUPABASE_PROJECT_URL}\n`);
  console.log('2. For each migration below:');
  console.log('   - Copy the SQL code');
  console.log('   - Paste into SQL Editor');
  console.log('   - Click "Run" (or Cmd/Ctrl + Enter)\n');
  console.log('3. Verify tables were created in Table Editor\n');

  console.log('='.repeat(70));
  console.log('MIGRATIONS TO EXECUTE:');
  console.log('='.repeat(70) + '\n');

  files.forEach((file, index) => {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`MIGRATION ${index + 1}/${files.length}: ${file}`);
    console.log('─'.repeat(70));
    console.log('\n' + sql);
    console.log('\n' + '─'.repeat(70) + '\n');
  });

  console.log('='.repeat(70));
  console.log('✅ All migrations displayed above');
  console.log('='.repeat(70));
  console.log('\n💡 Tip: You can copy all SQL at once and execute in one go!\n');
}

main().catch(error => {
  console.error('\n❌ Error:');
  console.error(error);
  process.exit(1);
});
