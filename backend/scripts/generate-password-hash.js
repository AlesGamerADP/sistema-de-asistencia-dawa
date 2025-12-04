/**
 * Script para generar hashes de contraseñas con bcrypt
 * Uso: node scripts/generate-password-hash.js
 */

import bcrypt from 'bcrypt';

const passwords = {
  admin: 'admin123',
  colaborador: 'colab123'
};

async function generateHashes() {
  console.log('🔐 Generando hashes de contraseñas...\n');
  
  for (const [user, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Usuario: ${user}`);
    console.log(`Contraseña: ${password}`);
    console.log(`Hash: ${hash}\n`);
  }
}

generateHashes();
