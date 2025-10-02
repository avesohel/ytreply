/**
 * Database Schema Checker
 * Verifies all required tables exist in Supabase
 *
 * Usage: node scripts/check-db.mjs
 *
 * Author: Ali Sohel <avesohel@gmail.com>
 */

import { createClient } from '@supabase/supabase-js';

// Read from environment or use defaults
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://dfnkryamumtoqjqiuwjl.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbmtyeWFtdW10b3FqcWl1d2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.4o_CmZyrGVSa_uVOQh1aymnlQGWWjqCdJ6_VsDo17Q4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const REQUIRED_TABLES = [
  'profiles',
  'youtube_channels',
  'videos',
  'comment_replies',
  'usage_stats',
  'subscription_events',
  'reply_templates'
];

async function checkSchema() {
  console.log('🔍 Checking Supabase database schema...\n');
  console.log(`📡 Connected to: ${SUPABASE_URL}\n`);

  let allTablesExist = true;

  for (const table of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table.padEnd(20)} - NOT FOUND: ${error.message}`);
        allTablesExist = false;
      } else {
        const rowCount = data && data.length > 0 ? 'has data' : 'empty';
        console.log(`✅ ${table.padEnd(20)} - EXISTS (${rowCount})`);
      }
    } catch (e) {
      console.log(`❌ ${table.padEnd(20)} - ERROR: ${e.message}`);
      allTablesExist = false;
    }
  }

  console.log('\n' + '='.repeat(50));

  if (allTablesExist) {
    console.log('✅ All required tables exist!');
    console.log('\n💡 Your database is ready to use.');
  } else {
    console.log('⚠️  Some tables are missing!');
    console.log('\n📝 Next steps:');
    console.log('   1. Open Supabase SQL Editor');
    console.log('   2. Run: scripts/supabase-schema.sql');
    console.log('   3. Run this script again to verify');
  }

  console.log('='.repeat(50) + '\n');
  process.exit(allTablesExist ? 0 : 1);
}

checkSchema().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
