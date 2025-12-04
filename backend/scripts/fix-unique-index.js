/**
 * Script para arreglar el índice único de registros
 * Elimina el índice antiguo y crea uno nuevo que excluye registros eliminados
 */

import sequelize from '../src/database/index.js';

async function fixUniqueIndex() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conectado exitosamente');

    console.log('\n🗑️ Eliminando índice único antiguo...');
    await sequelize.query('DROP INDEX IF EXISTS unique_empleado_fecha;');
    console.log('✅ Índice antiguo eliminado');

    console.log('\n🆕 Creando índice único parcial (excluye eliminados)...');
    await sequelize.query(`
      CREATE UNIQUE INDEX unique_empleado_fecha 
      ON registros (empleado_id, fecha) 
      WHERE deleted_at IS NULL;
    `);
    console.log('✅ Índice nuevo creado exitosamente');

    console.log('\n✨ Migración completada con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  }
}

fixUniqueIndex();
