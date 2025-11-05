# Atualizações da API - Frontend TCC

## Resumo das Mudanças

Este documento descreve as adaptações realizadas no frontend para suportar a versão atualizada da API (04-11-2025).

## Principais Mudanças na API

### 1. **Login com Unidade Escolar**
- **Antes**: Login apenas com `username` e `password`
- **Agora**: Login requer `username`, `password` e `unitId`

### 2. **Novos Campos nos Models**

#### Admin
- ✅ Adicionado campo `name` (nome completo do administrador)

#### Student
- ✅ Adicionado campo `address` (endereço do estudante)
- ✅ Adicionado campo `status` (ACTIVE, INACTIVE, DELETED)

#### ActivitySubmission (Submissão de Atividades)
- ✅ Adicionado campo `comment` (comentário do professor na correção)
- ✅ Adicionado campo `teacherId` (ID do professor que corrigiu)
- ✅ Adicionado campo `correctedAt` (data/hora da correção)
- ✅ Suporte para upload de arquivo via `multipart/form-data`

#### Attendance (Presença)
- ✅ Adicionado campo `subject` (disciplina da aula)

## Arquivos Criados/Atualizados

### Novos Serviços

1. **`src/services/schoolUnitService.js`**
   - Gerenciamento de unidades escolares
   - Métodos: `getAllSchoolUnits()`, `getSchoolUnitById()`, `createSchoolUnit()`

2. **`src/services/adminService.js`**
   - CRUD completo de administradores
   - Suporte ao novo campo `name`
   - Validação de dados
   - Método especial: `resetBiometry()` para resetar todas as biometrias

3. **`src/services/studentService.js`**
   - CRUD completo de estudantes
   - Suporte aos campos `address` e `status`
   - Gerenciamento de matrículas (enrollment)
   - Gerenciamento de biometria
   - Validações de CPF e email
   - Formatação de CPF e telefone

4. **`src/services/teacherService.js`**
   - CRUD completo de professores
   - Busca de turmas e disciplinas do professor
   - Busca de horários
   - Validações de CPF e email

### Serviços Atualizados

1. **`src/services/authService.js`**
   - ✅ Método `login()` agora aceita `unitId` como terceiro parâmetro
   - ✅ Corrigido endpoint para `/auth/login` (sem prefixo `/api/` já que está na URL base)
   - ✅ Parsing correto do token de resposta (`response.data.token`)

2. **`src/services/activityService.js`**
   - ✅ Todos os endpoints atualizados (sem prefixo `/api/` pois já está na URL base)
   - ✅ Método `submitActivity()` agora suporta upload de arquivo via `FormData`
   - ✅ Novo método `submitCorrection()` substituindo `submitGrade()`
   - ✅ Suporte para comentário do professor na correção
   - ✅ Validação atualizada para aceitar submissão apenas com arquivo
   - ✅ Nova validação: `validateCorrectionData()`

### Componentes Atualizados

1. **`src/pages/Login.jsx`**
   - ✅ Adicionado campo de seleção de unidade escolar
   - ✅ Busca automática de unidades escolares da API
   - ✅ Loading state durante busca de unidades
   - ✅ Validação obrigatória do campo `unitId`
   - ✅ Ícone `Building2` para melhor UX

2. **`src/contexts/AuthContext.jsx`**
   - ✅ Método `login()` atualizado para passar `unitId`
   - ✅ Suporte ao novo fluxo de autenticação

3. **`src/components/ActivityGrading.jsx`**
   - ✅ Adicionado campo de comentário na correção
   - ✅ Busca e armazenamento de dados do professor (`teacherData`)
   - ✅ Exibição de comentário existente em submissões corrigidas
   - ✅ Envio de `teacherId` junto com a correção
   - ✅ Atualização automática após correção para mostrar novos dados
   - ✅ Mudança de terminologia: "Nota" → "Correção"

## Como Usar as Novas Funcionalidades

### Login com Unidade Escolar

```javascript
import { useAuth } from "../contexts/AuthContext";

const { login } = useAuth();

// Fazer login selecionando a unidade escolar
await login(username, password, unitId);
```

### Submeter Atividade com Arquivo

```javascript
import { activityService } from "../services/activityService";

// Criar FormData para enviar arquivo
const formData = new FormData();
formData.append('studentId', studentId);
formData.append('answerText', 'Minha resposta...');
formData.append('file', arquivoSelecionado);

// Submeter atividade
await activityService.submitActivity(activityId, formData);
```

### Corrigir Atividade com Comentário

```javascript
import { activityService } from "../services/activityService";

// Enviar correção com nota e comentário
await activityService.submitCorrection(submissionId, {
  grade: 8.5,
  comment: "Ótimo trabalho! Continue assim.",
  teacherId: teacherId
});
```

### Gerenciar Estudantes

```javascript
import { studentService } from "../services/studentService";

// Criar estudante com endereço
await studentService.createStudent({
  name: "João Silva",
  username: "joao.silva",
  password: "senha123",
  email: "joao@email.com",
  cpf: "123.456.789-00",
  address: "Rua Exemplo, 123",
  schoolClassId: 1,
  birthdate: "2005-05-15",
  unitId: 1,
  // ... outros campos
});

// Ativar matrícula
await studentService.setEnrollmentActive(studentId);

// Inativar matrícula
await studentService.setEnrollmentInactive(studentId);
```

### Gerenciar Unidades Escolares

```javascript
import { schoolUnitService } from "../services/schoolUnitService";

// Buscar todas as unidades
const units = await schoolUnitService.getAllSchoolUnits();

// Criar nova unidade
await schoolUnitService.createSchoolUnit({
  name: "ETEC Polivalente",
  address: "Rua da Escola, 100",
  phone: "(19) 99999-9999",
  email: "contato@etec.sp.gov.br"
});
```

## Status dos Campos da API

### ✅ Implementados
- [x] Login com `unitId`
- [x] Admin com campo `name`
- [x] Student com campo `address`
- [x] Student com campo `status`
- [x] ActivitySubmission com upload de arquivo
- [x] ActivitySubmission com campo `comment`
- [x] ActivitySubmission com campo `teacherId`
- [x] Todos os endpoints corrigidos (sem duplicação de `/api/`)

### ⚠️ Parcialmente Implementados
- [ ] Attendance com campo `subject` (backend pronto, frontend precisa de UI)

### 📋 Próximos Passos
1. Atualizar componentes de presença para incluir disciplina
2. Criar interface para visualização de comentários do aluno
3. Adicionar filtros por status de estudante
4. Implementar visualização de arquivo anexado em atividades

## Validações Implementadas

### CPF
- Validação de formato (11 dígitos)
- Validação de dígitos verificadores
- Formatação automática (xxx.xxx.xxx-xx)

### Email
- Validação de formato usando regex
- Verificação de domínio básica

### Telefone
- Formatação para (xx) xxxxx-xxxx ou (xx) xxxx-xxxx
- Suporte para números com 10 ou 11 dígitos

## Observações Importantes

1. **Endpoints não incluem prefixo `/api/`** - A URL base já contém `/api/`, portanto os endpoints nos serviços são apenas caminhos relativos (ex: `/student`, `/teacher`, etc).

2. **Upload de Arquivos** - Ao enviar arquivos, use `FormData` e configure o header `Content-Type: multipart/form-data`.

3. **Status do Estudante** - Os possíveis valores são:
   - `ACTIVE` - Estudante ativo
   - `INACTIVE` - Estudante inativo
   - `DELETED` - Estudante excluído (soft delete)

4. **Unidade Escolar** - Todos os usuários (exceto admin global) devem estar associados a uma unidade escolar.

## Compatibilidade

- ✅ Compatível com a API versão 04-11-2025
- ✅ Mantém retrocompatibilidade com funcionalidades anteriores
- ✅ Todos os testes de integração passando

## Suporte

Para dúvidas ou problemas relacionados às atualizações, consulte:
- Documentação da API: `/docs/api-04-11-2025.txt`
- Código fonte dos serviços: `/src/services/`
- Exemplos de uso: Este documento

---

**Última atualização**: 04/11/2025
**Versão do Frontend**: 2.0.0
**Versão da API**: 04-11-2025

**Nota importante**: Os endpoints nos serviços não incluem o prefixo `/api/` pois este já está configurado na URL base (`VITE_API_URI`) do arquivo `.env`.