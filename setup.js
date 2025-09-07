const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Employee Management System...\n');

// Create necessary directories
const directories = [
  'logs',
  'exports',
  'dist'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory already exists: ${dir}`);
  }
});

// Copy .env.example to .env if .env doesn't exist
if (!fs.existsSync('.env')) {
  if (fs.existsSync('env.example')) {
    fs.copyFileSync('env.example', '.env');
    console.log('✅ Created .env file from env.example');
  } else {
    console.log('⚠️  env.example not found. Please create .env file manually.');
  }
} else {
  console.log('📄 .env file already exists');
}

console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

console.log('\n🗄️  Setting up database...');
console.log('Please make sure MySQL is running and create a database named "employee_management"');
console.log('Update your .env file with the correct database credentials');
console.log('\nTo run migrations: npm run migrate');
console.log('To seed the database: npm run seed');
console.log('To start the development server: npm run dev');

console.log('\n🎉 Setup completed!');
console.log('\nNext steps:');
console.log('1. Update .env file with your database credentials');
console.log('2. Run: npm run migrate');
console.log('3. Run: npm run seed');
console.log('4. Run: npm run dev');
console.log('\nAPI will be available at: http://localhost:3000');
console.log('Health check: http://localhost:3000/health');

