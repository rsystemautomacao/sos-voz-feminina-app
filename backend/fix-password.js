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

async function fixPassword() {
  try {
    console.log('🔧 Corrigindo senha do super admin...');
    
    // Buscar usuário
    const user = await AdminUser.findOne({ email: 'sosvozfeminina@administrador.com' });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('👤 Usuário encontrado:', {
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    
    // Nova senha
    const newPassword = '@VozAdministrador!25';
    console.log('🔑 Definindo nova senha:', newPassword);
    
    // Gerar hash da nova senha
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Atualizar senha
    user.password = hashedPassword;
    await user.save();
    
    console.log('✅ Senha atualizada com sucesso!');
    
    // Testar a nova senha
    const isValid = await bcrypt.compare(newPassword, user.password);
    console.log('🔑 Nova senha válida:', isValid);
    
  } catch (error) {
    console.error('💥 Erro:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixPassword();
