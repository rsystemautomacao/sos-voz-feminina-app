import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para ler o arquivo package.json
function readPackageJson() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  return JSON.parse(packageContent);
}

// Função para atualizar a versão
function updateVersion() {
  const packageJson = readPackageJson();
  const currentVersion = packageJson.version;
  
  // Incrementar patch version (1.0.2 -> 1.0.3)
  const versionParts = currentVersion.split('.');
  const patch = parseInt(versionParts[2]) + 1;
  const newVersion = `${versionParts[0]}.${versionParts[1]}.${patch}`;
  
  // Atualizar package.json
  packageJson.version = newVersion;
  fs.writeFileSync(
    path.join(__dirname, '..', 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );
  
  // Atualizar o arquivo AboutModal.tsx
  const aboutModalPath = path.join(__dirname, '..', 'src', 'components', 'AboutModal.tsx');
  let aboutModalContent = fs.readFileSync(aboutModalPath, 'utf8');
  
  // Substituir a versão no AboutModal
  aboutModalContent = aboutModalContent.replace(
    /const appVersion = "[\d.]+";/,
    `const appVersion = "${newVersion}";`
  );
  
  fs.writeFileSync(aboutModalPath, aboutModalContent);
  
  // Atualizar o hook useAppUpdate.ts
  const useAppUpdatePath = path.join(__dirname, '..', 'src', 'hooks', 'useAppUpdate.ts');
  let useAppUpdateContent = fs.readFileSync(useAppUpdatePath, 'utf8');
  
  // Substituir a versão no useAppUpdate
  useAppUpdateContent = useAppUpdateContent.replace(
    /const currentVersion = '[\d.]+';/,
    `const currentVersion = '${newVersion}';`
  );
  
  fs.writeFileSync(useAppUpdatePath, useAppUpdateContent);
  
  console.log(`✅ Versão atualizada de ${currentVersion} para ${newVersion}`);
  console.log('📝 Arquivos atualizados:');
  console.log('  - package.json');
  console.log('  - src/components/AboutModal.tsx');
  console.log('  - src/hooks/useAppUpdate.ts');
  
  return newVersion;
}

// Executar se chamado diretamente
try {
  const newVersion = updateVersion();
  console.log(`\n🎉 Versão ${newVersion} configurada com sucesso!`);
} catch (error) {
  console.error('❌ Erro ao atualizar versão:', error.message);
  process.exit(1);
}
