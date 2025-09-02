import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import AdminUser from '../models/AdminUser.js';

dotenv.config();

const initSuperAdmin = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB Atlas');

    // Verificar se já existe um super admin
    const existingSuperAdmin = await AdminUser.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('ℹ️  Super admin já existe:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Criar super admin
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@sosvozfeminina.com';
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123456';

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

    const superAdmin = new AdminUser({
      email: superAdminEmail,
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    });

    await superAdmin.save();

    console.log('✅ Super admin criado com sucesso!');
    console.log('📧 Email:', superAdminEmail);
    console.log('🔑 Senha:', superAdminPassword);
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inicializar super admin:', error);
    process.exit(1);
  }
};

initSuperAdmin();
