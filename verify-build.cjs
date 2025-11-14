/**
 * Script de Verificação do Build
 * Verifica se o build foi gerado corretamente e todos os arquivos necessários existem
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando build do projeto...\n');

const distPath = path.join(__dirname, 'dist');
const errors = [];
const warnings = [];
const success = [];

// Verificar se a pasta dist existe
if (!fs.existsSync(distPath)) {
  errors.push('❌ Pasta dist/ não encontrada. Execute "npm run build" primeiro.');
  console.error(errors[0]);
  process.exit(1);
}

console.log('✅ Pasta dist/ encontrada');

// Verificar index.html
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  success.push('✅ index.html encontrado');

  // Verificar conteúdo do index.html
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  if (indexContent.includes('<div id="root"></div>')) {
    success.push('✅ Elemento #root presente no HTML');
  } else {
    errors.push('❌ Elemento #root não encontrado no index.html');
  }

  if (indexContent.includes('type="module"')) {
    success.push('✅ Script type="module" configurado corretamente');
  } else {
    warnings.push('⚠️  Script não está marcado como type="module"');
  }

  // Verificar se os assets estão referenciados
  const jsMatch = indexContent.match(/src="\.\/assets\/index-[a-f0-9]+\.js"/);
  const cssMatch = indexContent.match(/href="\.\/assets\/index-[a-f0-9]+\.css"/);

  if (jsMatch) {
    success.push(`✅ JavaScript bundle referenciado: ${jsMatch[0]}`);
  } else {
    errors.push('❌ JavaScript bundle não encontrado no index.html');
  }

  if (cssMatch) {
    success.push(`✅ CSS bundle referenciado: ${cssMatch[0]}`);
  } else {
    warnings.push('⚠️  CSS bundle não encontrado no index.html');
  }
} else {
  errors.push('❌ index.html não encontrado');
}

// Verificar pasta assets
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  success.push('✅ Pasta assets/ encontrada');

  const assetsFiles = fs.readdirSync(assetsPath);

  // Verificar arquivos JavaScript
  const jsFiles = assetsFiles.filter(f => f.endsWith('.js'));
  if (jsFiles.length > 0) {
    success.push(`✅ ${jsFiles.length} arquivo(s) JavaScript encontrado(s)`);
    jsFiles.forEach(file => {
      console.log(`   📄 ${file}`);

      // Verificar tamanho do arquivo
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      if (stats.size > 0) {
        console.log(`      Tamanho: ${sizeInMB} MB`);

        if (stats.size > 1024 * 1024) { // > 1MB
          warnings.push(`⚠️  Arquivo ${file} é grande (${sizeInMB} MB). Considere code splitting.`);
        }
      } else {
        errors.push(`❌ Arquivo ${file} está vazio`);
      }
    });
  } else {
    errors.push('❌ Nenhum arquivo JavaScript encontrado em assets/');
  }

  // Verificar arquivos CSS
  const cssFiles = assetsFiles.filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    success.push(`✅ ${cssFiles.length} arquivo(s) CSS encontrado(s)`);
    cssFiles.forEach(file => {
      console.log(`   🎨 ${file}`);

      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      console.log(`      Tamanho: ${sizeInKB} KB`);
    });
  } else {
    warnings.push('⚠️  Nenhum arquivo CSS encontrado em assets/');
  }

  // Verificar source maps
  const mapFiles = assetsFiles.filter(f => f.endsWith('.js.map'));
  if (mapFiles.length > 0) {
    success.push(`✅ ${mapFiles.length} source map(s) encontrado(s)`);
  } else {
    warnings.push('⚠️  Nenhum source map encontrado (útil para debug)');
  }
} else {
  errors.push('❌ Pasta assets/ não encontrada');
}

// Verificar vite.svg (ícone padrão)
const viteSvgPath = path.join(distPath, 'vite.svg');
if (fs.existsSync(viteSvgPath)) {
  success.push('✅ vite.svg encontrado');
} else {
  warnings.push('⚠️  vite.svg não encontrado (ícone do site)');
}

// Verificar estrutura de arquivos críticos no source
console.log('\n🔍 Verificando arquivos críticos do source...\n');

const criticalFiles = [
  'src/main.jsx',
  'src/App.jsx',
  'src/contexts/AuthContext.jsx',
  'src/services/authService.js',
  'src/services/api.js',
  'src/components/ErrorBoundary.jsx',
  'vite.config.js',
  'package.json'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    errors.push(`❌ Arquivo crítico não encontrado: ${file}`);
  }
});

// Verificar configuração do vite.config.js
console.log('\n🔍 Verificando configuração do Vite...\n');

const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');

  if (viteConfig.includes('base: "./"') || viteConfig.includes('base: \'./\'')) {
    success.push('✅ base: "./" configurado (correto para servir de subdiretórios)');
  } else {
    warnings.push('⚠️  base não está configurado como "./" - pode ter problemas em produção');
  }

  if (viteConfig.includes('sourcemap: true')) {
    success.push('✅ sourcemap habilitado (bom para debug)');
  } else {
    warnings.push('⚠️  sourcemap não habilitado');
  }

  if (viteConfig.includes('outDir: "dist"') || viteConfig.includes('outDir: \'dist\'')) {
    success.push('✅ outDir configurado como "dist"');
  }
}

// Verificar package.json
console.log('\n🔍 Verificando package.json...\n');

const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (packageJson.scripts && packageJson.scripts.build) {
    success.push(`✅ Script de build definido: ${packageJson.scripts.build}`);
  } else {
    errors.push('❌ Script de build não encontrado em package.json');
  }

  if (packageJson.dependencies) {
    const criticalDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
    const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);

    if (missingDeps.length === 0) {
      success.push('✅ Todas as dependências críticas instaladas');
    } else {
      errors.push(`❌ Dependências faltando: ${missingDeps.join(', ')}`);
    }
  }
}

// Relatório Final
console.log('\n' + '='.repeat(60));
console.log('📊 RELATÓRIO FINAL');
console.log('='.repeat(60) + '\n');

if (success.length > 0) {
  console.log('✅ SUCESSOS:\n');
  success.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  AVISOS:\n');
  warnings.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERROS:\n');
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

console.log('='.repeat(60));
console.log(`✅ Sucessos: ${success.length}`);
console.log(`⚠️  Avisos: ${warnings.length}`);
console.log(`❌ Erros: ${errors.length}`);
console.log('='.repeat(60) + '\n');

if (errors.length === 0) {
  console.log('🎉 Build verificado com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Testar localmente: cd dist && npx live-server');
  console.log('   2. Ou usar Python: cd dist && python -m http.server 8080');
  console.log('   3. Copiar conteúdo de dist/ para seu servidor');
  console.log('   4. Verificar console do navegador para logs de diagnóstico\n');
  process.exit(0);
} else {
  console.log('❌ Build tem problemas que precisam ser corrigidos.');
  console.log('\n📝 Ações recomendadas:');
  console.log('   1. Execute: npm run build');
  console.log('   2. Verifique os erros acima');
  console.log('   3. Consulte TROUBLESHOOTING.md para mais informações\n');
  process.exit(1);
}
