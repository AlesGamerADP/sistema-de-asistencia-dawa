/**
 * Script para Crear Usuarios de Prueba
 * 
 * Crea 2 usuarios:
 * 1. Admin (administrador@timetrack.com / Admin123!)
 * 2. Colaborador (colaborador@timetrack.com / Colaborador123!)
 * 
 * Ejecutar con: node scripts/seed-users.js
 */

import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sequelize from '../src/database/index.js';
import db from '../src/models/index.js';

dotenv.config();

const { Usuario, Empleado, Departamento } = db;

const seedUsers = async () => {
  try {
    console.log('🌱 Iniciando seed de usuarios de prueba...\n');

    // 1. Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // 2. Crear departamento de prueba si no existe
    console.log('📁 Verificando/creando departamento...');
    
    const [departamento] = await Departamento.findOrCreate({
      where: { nombre: 'Administración' },
      defaults: {
        nombre: 'Administración',
        descripcion: 'Departamento administrativo'
      }
    });
    
    console.log(`✅ Departamento: ${departamento.nombre} (ID: ${departamento.id})\n`);

    // 3. Crear empleados
    console.log('👥 Creando empleados...');
    
    // Empleado Admin
    const [empleadoAdmin, createdAdmin] = await Empleado.findOrCreate({
      where: { nombre: 'Admin', apellido: 'Sistema' },
      defaults: {
        nombre: 'Admin',
        apellido: 'Sistema',
        puesto: 'Administrador del Sistema',
        fecha_contratacion: new Date(),
        departamento_id: departamento.id,
        estado: 'activo',
        tipo_empleo: 'Full-time',
        hora_entrada: '09:00',
        hora_salida: '18:00'
      }
    });
    
    if (createdAdmin) {
      console.log('✅ Empleado Admin creado');
    } else {
      console.log('ℹ️  Empleado Admin ya existía');
    }

    // Empleado Colaborador
    const [empleadoColaborador, createdColaborador] = await Empleado.findOrCreate({
      where: { nombre: 'Juan', apellido: 'Pérez' },
      defaults: {
        nombre: 'Juan',
        apellido: 'Pérez',
        puesto: 'Colaborador',
        fecha_contratacion: new Date(),
        departamento_id: departamento.id,
        estado: 'activo',
        tipo_empleo: 'Full-time',
        hora_entrada: '09:00',
        hora_salida: '18:00'
      }
    });
    
    if (createdColaborador) {
      console.log('✅ Empleado Colaborador creado');
    } else {
      console.log('ℹ️  Empleado Colaborador ya existía');
    }
    
    console.log('');

    // 4. Crear usuarios con contraseñas hasheadas
    console.log('🔐 Creando usuarios con contraseñas...');
    
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    
    // Usuario Admin
    const passwordAdmin = 'Admin123!';
    const hashedPasswordAdmin = await bcrypt.hash(passwordAdmin, saltRounds);
    
    const [usuarioAdmin, createdUserAdmin] = await Usuario.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        contraseña: hashedPasswordAdmin,
        rol: 'admin',
        empleado_id: empleadoAdmin.id
      }
    });
    
    if (createdUserAdmin) {
      console.log('✅ Usuario Admin creado');
    } else {
      console.log('ℹ️  Usuario Admin ya existía - Actualizando contraseña...');
      usuarioAdmin.contraseña = hashedPasswordAdmin;
      await usuarioAdmin.save();
      console.log('✅ Contraseña Admin actualizada');
    }

    // Usuario Colaborador
    const passwordColaborador = 'Colaborador123!';
    const hashedPasswordColaborador = await bcrypt.hash(passwordColaborador, saltRounds);
    
    const [usuarioColaborador, createdUserColaborador] = await Usuario.findOrCreate({
      where: { username: 'colaborador' },
      defaults: {
        username: 'colaborador',
        contraseña: hashedPasswordColaborador,
        rol: 'empleado',
        empleado_id: empleadoColaborador.id
      }
    });
    
    if (createdUserColaborador) {
      console.log('✅ Usuario Colaborador creado');
    } else {
      console.log('ℹ️  Usuario Colaborador ya existía - Actualizando contraseña...');
      usuarioColaborador.contraseña = hashedPasswordColaborador;
      await usuarioColaborador.save();
      console.log('✅ Contraseña Colaborador actualizada');
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                 ✅ USUARIOS CREADOS                       ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log('👤 ADMINISTRADOR:');
    console.log('   Username: admin');
    console.log('   Password: Admin123!');
    console.log('   Rol:      admin\n');
    
    console.log('👤 COLABORADOR:');
    console.log('   Username: colaborador');
    console.log('   Password: Colaborador123!');
    console.log('   Rol:      empleado\n');
    
    console.log('💡 Usa estas credenciales para hacer login en tu aplicación\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al crear usuarios:', error.message);
    console.error('\n💡 Asegúrate de:');
    console.error('   ✓ Haber ejecutado create-tables.js primero');
    console.error('   ✓ DATABASE_URL es correcta');
    console.error('   ✓ Las tablas existen en la base de datos\n');
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

seedUsers();
