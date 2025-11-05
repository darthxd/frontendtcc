# Guia de Testes - Atualizações da API

## 🧪 Guia Completo de Testes

Este documento fornece um roteiro detalhado para testar todas as novas funcionalidades implementadas.

---

## 📋 Pré-requisitos

Antes de iniciar os testes, certifique-se de que:

- [ ] A API está rodando e acessível
- [ ] O frontend está rodando (`npm run dev`)
- [ ] Você tem acesso ao console do navegador (F12)
- [ ] Existe pelo menos uma unidade escolar cadastrada na API

---

## 1. ✅ Teste de Login com Unidade Escolar

### Passos:
1. Acesse a página de login (`/login`)
2. Verifique se o campo "Unidade Escolar" aparece
3. Verifique se a lista de unidades carrega automaticamente
4. Selecione uma unidade escolar
5. Digite usuário e senha válidos
6. Clique em "Entrar"

### Resultado Esperado:
- ✅ Campo de unidade escolar deve estar visível
- ✅ Lista deve carregar com as unidades da API
- ✅ Deve mostrar "Carregando unidades..." enquanto busca
- ✅ Login deve ser bem-sucedido
- ✅ Deve redirecionar para o dashboard

### Verificações no Console:
```javascript
// O token deve conter o unitId
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Unit ID no token:', payload.unitId);
```

### Possíveis Erros:
❌ **"Selecione uma unidade escolar"** - Você não selecionou a unidade
❌ **"Erro ao carregar unidades escolares"** - API não está respondendo ou não há unidades cadastradas
❌ **"The user is not associated with the school unit"** - Usuário não pertence à unidade selecionada

---

## 2. ✅ Teste de Upload de Arquivo em Atividades

### Pré-requisitos:
- Login como estudante
- Ter uma atividade disponível para submeter

### Passos:
1. Acesse a lista de atividades
2. Clique em uma atividade não submetida
3. Preencha a resposta OU selecione um arquivo (ou ambos)
4. Clique em "Enviar Atividade"

### Resultado Esperado:
- ✅ Upload deve ser bem-sucedido
- ✅ Mensagem de sucesso deve aparecer
- ✅ Arquivo deve ser enviado para o servidor
- ✅ URL do arquivo deve ser retornada

### Verificações no Console:
```javascript
// Durante o upload, verifique o FormData
// No Network tab (F12), verifique:
// - Content-Type: multipart/form-data
// - Payload contém o arquivo
```

### Tipos de Arquivo Testados:
- [ ] PDF (.pdf)
- [ ] Documento Word (.docx)
- [ ] Imagem (.jpg, .png)
- [ ] Arquivo de texto (.txt)

### Possíveis Erros:
❌ **"É necessário fornecer uma resposta ou anexar um arquivo"** - Nada foi preenchido
❌ **"Arquivo inválido"** - Arquivo não é do tipo File
❌ **500 Error** - Problema no servidor ao salvar arquivo

---

## 3. ✅ Teste de Correção com Comentário

### Pré-requisitos:
- Login como professor
- Ter uma atividade com submissões

### Passos:
1. Acesse a lista de atividades
2. Clique em "Corrigir" em uma atividade
3. Selecione uma submissão para visualizar
4. Digite uma nota no campo "Atribuir Nota"
5. Digite um comentário (opcional)
6. Clique em "Enviar Correção"

### Resultado Esperado:
- ✅ Correção deve ser salva
- ✅ Nota e comentário devem aparecer na submissão
- ✅ Mensagem "Correção enviada com sucesso!" deve aparecer
- ✅ Lista de submissões deve atualizar automaticamente

### Verificações:
1. **Nota exibida corretamente:**
   - Badge verde com a nota
   - Percentual calculado corretamente

2. **Comentário exibido:**
   - Seção "Comentário do Professor" deve aparecer
   - Texto do comentário deve estar visível

3. **Dados do professor:**
   - `teacherId` deve ser enviado na requisição
   - `correctedAt` deve ter timestamp

### Verificações no Console:
```javascript
// No Network tab, verifique a requisição POST
// Endpoint: /api/activity/submission/{id}/grade
// Payload deve conter:
{
  "grade": 8.5,
  "comment": "Seu comentário aqui",
  "teacherId": 123
}
```

### Possíveis Erros:
❌ **"Dados do professor não encontrados"** - teacherData não foi carregado
❌ **"A nota deve estar entre 0 e X"** - Nota inválida
❌ **"Erro ao enviar correção"** - Problema na API

---

## 4. ✅ Teste de Visualização de Comentário Existente

### Pré-requisitos:
- Atividade já corrigida com comentário

### Passos:
1. Como professor, abra uma atividade
2. Clique em uma submissão já corrigida
3. Verifique se o comentário aparece

### Resultado Esperado:
- ✅ Badge verde com "Nota atual"
- ✅ Seção com "Comentário do Professor"
- ✅ Texto do comentário em itálico
- ✅ Campos de nota e comentário pré-preenchidos para edição

---

## 5. ✅ Teste de Criação de Administrador com Nome

### Pré-requisitos:
- Login como admin
- Acesso à página de criação de admin

### Passos:
1. Acesse a página de administradores
2. Clique em "Novo Administrador"
3. Preencha todos os campos, incluindo "Nome"
4. Selecione uma unidade escolar
5. Clique em "Salvar"

### Resultado Esperado:
- ✅ Admin criado com sucesso
- ✅ Campo "name" deve ser salvo
- ✅ Admin deve aparecer na lista

### Verificações via API:
```javascript
import { adminService } from './services/adminService';

// Buscar admin criado
const admin = await adminService.getAdminById(id);
console.log('Nome do admin:', admin.name);
```

---

## 6. ✅ Teste de Estudante com Endereço e Status

### Para testar via serviço:

```javascript
import { studentService } from './services/studentService';

// Criar estudante com endereço
const newStudent = await studentService.createStudent({
  name: "João da Silva",
  username: "joao.silva",
  password: "senha123",
  email: "joao@email.com",
  cpf: "123.456.789-00",
  phone: "11999999999",
  address: "Rua Exemplo, 123 - Centro",
  schoolClassId: 1,
  birthdate: "2005-05-15",
  unitId: 1,
  rm: 12345,
  ra: "123456789"
});

console.log('Estudante criado:', newStudent);
console.log('Status:', newStudent.status); // Deve ser "INACTIVE" por padrão

// Ativar estudante
await studentService.setEnrollmentActive(newStudent.id);

// Buscar novamente
const updated = await studentService.getStudentById(newStudent.id);
console.log('Status atualizado:', updated.status); // Deve ser "ACTIVE"
```

---

## 7. ✅ Teste de Validações

### CPF:
```javascript
import { studentService } from './services/studentService';

// Testar CPFs
console.log('CPF válido:', studentService.isValidCPF('123.456.789-09')); // true
console.log('CPF inválido:', studentService.isValidCPF('111.111.111-11')); // false
console.log('CPF formatado:', studentService.formatCPF('12345678909')); // 123.456.789-09
```

### Email:
```javascript
import { studentService } from './services/studentService';

// Testar emails
console.log('Email válido:', studentService.isValidEmail('teste@email.com')); // true
console.log('Email inválido:', studentService.isValidEmail('teste@')); // false
```

---

## 8. ✅ Teste de Endpoints com /api/

### Verificar todos os endpoints:

1. Abra o DevTools (F12)
2. Vá para a aba "Network"
3. Faça ações no sistema
4. Verifique se todas as requisições usam `/api/`:
   - ✅ `/api/auth/login`
   - ✅ `/api/activity/...`
   - ✅ `/api/student/...`
   - ✅ `/api/teacher/...`
   - ✅ `/api/admin/...`
   - ✅ `/api/schoolunit/...`

### Se encontrar endpoint sem /api/:
❌ Precisa ser atualizado no código

---

## 9. ✅ Teste de Busca de Unidades Escolares

### Via Console:
```javascript
import { schoolUnitService } from './services/schoolUnitService';

// Buscar todas as unidades
const units = await schoolUnitService.getAllSchoolUnits();
console.log('Unidades:', units);

// Buscar uma específica
const unit = await schoolUnitService.getSchoolUnitById(1);
console.log('Unidade:', unit);
```

---

## 10. ✅ Teste de Matrícula com Upload de Foto

### Pré-requisitos:
- Acesso à página de matrículas

### Passos:
1. Acesse a página de nova matrícula
2. Preencha todos os campos obrigatórios
3. Selecione uma foto do estudante
4. Clique em "Matricular"

### Resultado Esperado:
- ✅ Matrícula criada
- ✅ Foto enviada e URL salva
- ✅ Estudante criado com status INACTIVE
- ✅ Pode ser ativado posteriormente

---

## 📊 Checklist de Testes

### Login
- [ ] Login com unidade escolar funciona
- [ ] Lista de unidades carrega corretamente
- [ ] Validação de campo obrigatório funciona
- [ ] Token contém unitId

### Atividades
- [ ] Upload de arquivo PDF funciona
- [ ] Upload de imagem funciona
- [ ] Submissão apenas com texto funciona
- [ ] Submissão apenas com arquivo funciona
- [ ] Submissão com texto + arquivo funciona

### Correções
- [ ] Correção com nota funciona
- [ ] Correção com nota + comentário funciona
- [ ] Comentário é exibido corretamente
- [ ] Atualização de correção funciona
- [ ] teacherId é enviado corretamente

### Administradores
- [ ] Criar admin com nome funciona
- [ ] Campo name é obrigatório
- [ ] Admin aparece na lista com nome

### Estudantes
- [ ] Criar estudante com endereço funciona
- [ ] Status padrão é INACTIVE
- [ ] Ativar matrícula funciona
- [ ] Inativar matrícula funciona
- [ ] Address aparece nos dados

### Validações
- [ ] Validação de CPF funciona
- [ ] Validação de email funciona
- [ ] Formatação de CPF funciona
- [ ] Formatação de telefone funciona

### API
- [ ] Todos os endpoints usam /api/
- [ ] Erros são tratados corretamente
- [ ] Loading states funcionam

---

## 🐛 Relatório de Bugs

Use esta seção para documentar bugs encontrados:

### Bug #1: [Título]
- **Descrição**: 
- **Passos para reproduzir**:
  1. 
  2. 
  3. 
- **Resultado esperado**:
- **Resultado obtido**:
- **Console errors**:
- **Prioridade**: Alta / Média / Baixa

---

## ✅ Aprovação Final

Após completar todos os testes:

- [ ] Todos os testes de login passaram
- [ ] Todos os testes de upload passaram
- [ ] Todos os testes de correção passaram
- [ ] Validações funcionam corretamente
- [ ] Nenhum erro crítico no console
- [ ] Performance está adequada
- [ ] UX está intuitiva

**Data de aprovação**: ___/___/______
**Testado por**: _______________________
**Versão testada**: 2.0.0
**Versão da API**: 04-11-2025

---

## 📞 Suporte

Se encontrar problemas durante os testes:

1. Verifique o console do navegador (F12)
2. Verifique a aba Network para ver requisições
3. Consulte `API_UPDATES.md` para documentação
4. Consulte `IMPLEMENTATION_CHECKLIST.md` para status

---

**Última atualização**: 04/11/2025