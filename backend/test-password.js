import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env' });

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI);

const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  isActive: Boolean
}));

async function testPassword() {
  try {
    console.log('🔍 Testando senha...');
    
    // Buscar usuário
    const user = await AdminUser.findOne({ email: 'sosvozfeminina@administrador.com' });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('👤 Usuário encontrado:', {
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      passwordHash: user.password.substring(0, 20) + '...'
    });
    
    // Testar senha
    const testPassword = '@VozAdministrador!25';
    console.log('🔑 Testando senha:', testPassword);
    
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('🔑 Senha válida:', isValid);
    
    // Testar com senha incorreta
    const wrongPassword = 'senhaerrada';
    const isWrongValid = await bcrypt.compare(wrongPassword, user.password);
    console.log('🔑 Senha errada válida:', isWrongValid);
    
  } catch (error) {
    console.error('💥 Erro:', error);
  } finally {
    mongoose.disconnect();
  }
}

testPassword();
