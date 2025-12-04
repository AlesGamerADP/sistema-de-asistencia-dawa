/**
 * Script para Crear Tablas en Neon PostgreSQL
 * 
 * Este script crea todas las tablas necesarias en la base de datos.
 * Ejecutar con: node scripts/create-tables.js
 */

import dotenv from 'dotenv';
import sequelize from '../src/database/index.js';
import db from '../src/models/index.js';

dotenv.config();

const createTables = async () => {
  try {
    console.log('🚀 Iniciando creación de tablas...\n');

    // 1. Probar conexión
    console.log('📊 Verificando conexión a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a:', sequelize.config.database || 'Neon PostgreSQL\n');

    // 2. Crear todas las tablas
    console.log('🔨 Creando tablas...');
    
    // force: false - No borra tablas existentes
    // alter: true - Actualiza estructura si es necesario
    await sequelize.sync({ force: false, alter: true });
    
    console.log('\n✅ Tablas creadas/actualizadas correctamente:\n');
    
    // Listar tablas creadas
    const models = Object.keys(db).filter(key => 
      typeof db[key] === 'object' && 
      db[key].tableName
    );
    
    models.forEach((modelName, index) => {
      console.log(`   ${index + 1}. ${db[modelName].tableName}`);
    });
    
    console.log('\n🎉 ¡Base de datos lista para usar!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al crear tablas:', error.message);
    console.error('\n💡 Verifica:');
    console.error('   ✓ DATABASE_URL es correcta en .env');
    console.error('   ✓ La base de datos existe en Neon');
    console.error('   ✓ Tienes conexión a internet\n');
    process.exit(1);
  }
};

createTables();
