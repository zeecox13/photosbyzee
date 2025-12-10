/**
 * Script to create the first manager account
 * Usage: npx ts-node scripts/create-manager.ts
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('Creating Manager Account\n');

  const email = await question('Email: ');
  const password = await question('Password: ');
  const firstName = await question('First Name (optional): ');
  const lastName = await question('Last Name (optional): ');

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.error('User with this email already exists!');
    process.exit(1);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create manager
  const manager = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: firstName || null,
      lastName: lastName || null,
      role: 'MANAGER',
    },
  });

  console.log('\n✅ Manager account created successfully!');
  console.log(`ID: ${manager.id}`);
  console.log(`Email: ${manager.email}`);
  console.log(`Role: ${manager.role}`);

  rl.close();
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

