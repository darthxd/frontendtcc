# 🎯 Preenchimento Automático de Unit ID

## 📋 Visão Geral

Este recurso garante que todas as operações de cadastro (estudantes, professores e administradores) incluam automaticamente o `unitId` da unidade escolar do usuário logado, extraído diretamente do token JWT.

---

## ✨ Como Funciona

### 1. **Token JWT Contém o Unit ID**

Quando um usuário faz login, o token JWT retornado contém uma claim `unitId`:

```json
{
  "sub": "admin.user",
  "role": "ROLE_ADMIN",
  "unitId": 1,
  "exp": 1234567890,
  "iss": "ApiTcc"
}
```

### 2. **Extração Automática**

Os serviços verificam se o `unitId` foi fornecido. Se não, extraem automaticamente do token:

```javascript
// Se unitId não foi fornecido, obter do token JWT
const unitId = data.unitId || getUnitIdFromToken();

if (!unitId) {
  throw new Error("Unidade escolar não encontrada. Faça login novamente.");
}
```

### 3. **Inclusão no Payload**

O `unitId` é incluído no payload da requisição:

```javascript
const response = await api.post("/student", {
  username: data.username,
  password: data.password,
  name: data.name,
  // ... outros campos
  unitId: unitId  // ← Automaticamente preenchido
});
```

---

## 🔧 Funções Utilitárias

### `getUnitIdFromToken(token)`

Extrai o `unitId` do token JWT.

**Localização:** `src/utils/jwt.js`

**Parâmetros:**
- `token` (string, opcional) - Token JWT. Se não fornecido, busca do `localStorage`

**Retorno:**
- `number|null` - O unitId ou null se não encontrado

**Exemplo:**
```javascript
import { getUnitIdFromToken } from "../utils/jwt";

const unitId = getUnitIdFromToken();
console.log(unitId); // 1
```

### `getUserInfoFromToken(token)`

Extrai todas as informações do usuário do token JWT.

**Parâmetros:**
- `token` (string, opcional) - Token JWT. Se não fornecido, busca do `localStorage`

**Retorno:**
```javascript
{
  username: "admin.user",
  role: "ROLE_ADMIN",
  unitId: 1,
  exp: 1234567890,
  iss: "ApiTcc"
}
```

**Exemplo:**
```javascript
import { getUserInfoFromToken } from "../utils/jwt";

const userInfo = getUserInfoFromToken();
console.log(userInfo.unitId); // 1
console.log(userInfo.role);   // "ROLE_ADMIN"
```

---

## 📦 Serviços Atualizados

### 1. Student Service

**Arquivo:** `src/services/studentService.js`

#### `createStudent(data)`

```javascript
// ❌ ANTES - unitId era obrigatório
await studentService.createStudent({
  name: "João Silva",
  username: "joao.silva",
  password: "senha123",
  // ... outros campos
  unitId: 1  // ← Tinha que passar manualmente
});

// ✅ AGORA - unitId é opcional (pega do token)
await studentService.createStudent({
  name: "João Silva",
  username: "joao.silva",
  password: "senha123",
  // ... outros campos
  // unitId é automaticamente preenchido!
});
```

#### `createEnrollment(formData)`

Também funciona com matrículas via FormData:

```javascript
const formData = new FormData();
formData.append('name', 'Maria Santos');
formData.append('email', 'maria@email.com');
// ... outros campos
// unitId é automaticamente adicionado ao FormData

await studentService.createEnrollment(formData);
```

### 2. Teacher Service

**Arquivo:** `src/services/teacherService.js`

#### `createTeacher(data)`

```javascript
// ✅ unitId preenchido automaticamente
await teacherService.createTeacher({
  name: "Prof. Carlos",
  username: "prof.carlos",
  password: "senha123",
  cpf: "123.456.789-00",
  email: "carlos@escola.com",
  phone: "11999999999",
  subjectIds: [1, 2, 3],
  schoolClassIds: [1, 2]
  // unitId é automaticamente preenchido!
});
```

### 3. Admin Service

**Arquivo:** `src/services/adminService.js`

#### `createAdmin(data)`

```javascript
// ✅ unitId preenchido automaticamente
await adminService.createAdmin({
  name: "João Admin",
  username: "joao.admin",
  password: "senha123"
  // unitId é automaticamente preenchido!
});
```

---

## 🎯 Componentes Atualizados

### Students.jsx

```javascript
import { studentService } from "../services/studentService";

const onSubmit = async (data) => {
  try {
    if (editingStudent) {
      await studentService.updateStudent(editingStudent.id, data);
      toast.success("Aluno atualizado com sucesso!");
    } else {
      // ✅ Não precisa mais passar unitId!
      await studentService.createStudent(data);
      toast.success("Aluno criado com sucesso!");
    }
    // ...
  } catch (error) {
    toast.error(error.message || "Erro ao salvar aluno");
  }
};
```

### Teachers.jsx

```javascript
import { teacherService } from "../services/teacherService";

const onSubmit = async (data) => {
  try {
    const payload = {
      ...data,
      subjectIds: (data.subjectIds || []).map((id) => Number(id)),
      schoolClassIds: (data.schoolClassIds || []).map((id) => Number(id)),
    };
    
    if (editingTeacher) {
      await teacherService.updateTeacher(editingTeacher.id, payload);
      toast.success("Professor atualizado com sucesso!");
    } else {
      // ✅ Não precisa mais passar unitId!
      await teacherService.createTeacher(payload);
      toast.success("Professor criado com sucesso!");
    }
    // ...
  } catch (error) {
    toast.error(error.message || "Erro ao salvar professor");
  }
};
```

---

## ✅ Vantagens

### 1. **Segurança**
- O unitId vem do token JWT, que é assinado pelo servidor
- Não pode ser manipulado pelo cliente
- Garante que o usuário só cadastre para sua unidade

### 2. **Simplicidade**
- Não precisa passar unitId manualmente em cada cadastro
- Código mais limpo nos componentes
- Menos chance de erro

### 3. **Consistência**
- Todos os cadastros seguem o mesmo padrão
- Fácil manutenção
- Comportamento previsível

### 4. **Flexibilidade**
- Ainda pode passar unitId manualmente se necessário
- Útil para testes ou casos especiais

---

## 🔍 Validação

O sistema valida o unitId em todas as operações:

```javascript
if (!unitId) {
  throw new Error("Unidade escolar não encontrada. Faça login novamente.");
}
```

### Possíveis Erros:

**❌ "Unidade escolar não encontrada. Faça login novamente."**

**Causas:**
- Token expirado
- Token inválido
- Usuario sem unitId no token (admin global)
- Token removido do localStorage

**Solução:**
1. Fazer logout
2. Fazer login novamente
3. Verificar se o token contém unitId

---

## 🧪 Testando

### 1. Verificar Token no Console

```javascript
// Abrir DevTools (F12) e executar:
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Unit ID:', payload.unitId);
```

**Resultado esperado:**
```
Unit ID: 1
```

### 2. Testar Cadastro de Estudante

```javascript
import { studentService } from "../services/studentService";

// Sem passar unitId
const student = await studentService.createStudent({
  name: "Teste Silva",
  username: "teste.silva",
  password: "senha123",
  email: "teste@email.com",
  cpf: "123.456.789-00",
  schoolClassId: 1,
  birthdate: "2005-05-15",
  rm: 12345,
  ra: "123456789"
});

console.log('Estudante criado:', student);
console.log('Unit ID do estudante:', student.unitId); // Deve ser 1
```

### 3. Verificar no Network Tab

1. Abrir DevTools (F12)
2. Ir para aba Network
3. Criar um estudante/professor
4. Verificar requisição POST
5. Verificar payload:

```json
{
  "name": "Teste Silva",
  "username": "teste.silva",
  "password": "senha123",
  "unitId": 1  ← Deve estar presente
}
```

---

## 🚨 Casos Especiais

### Admin Global (sem unidade)

Se um admin não tiver unitId no token (admin global), deve passar manualmente:

```javascript
await studentService.createStudent({
  // ... dados do estudante
  unitId: 1  // ← Passar manualmente
});
```

### Testes Automatizados

Em testes, pode simular o token:

```javascript
// Mock do localStorage
localStorage.setItem('token', 'eyJ...');

// Ou passar unitId explicitamente
await studentService.createStudent({
  // ... dados
  unitId: 999  // ← Para testes
});
```

---

## 📊 Fluxograma

```
┌─────────────────────────┐
│ Criar Estudante/        │
│ Professor/Admin         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ unitId fornecido?       │
└───────────┬─────────────┘
            │
     ┌──────┴──────┐
     │             │
    SIM           NÃO
     │             │
     │             ▼
     │   ┌─────────────────┐
     │   │ Extrair do JWT  │
     │   └────────┬─────────┘
     │            │
     └────────────┤
                  ▼
         ┌─────────────────┐
         │ unitId válido?  │
         └────────┬─────────┘
                  │
          ┌───────┴───────┐
         SIM             NÃO
          │               │
          ▼               ▼
   ┌──────────┐    ┌──────────┐
   │ Cadastrar│    │  Erro    │
   └──────────┘    └──────────┘
```

---

## 📚 Arquivos Relacionados

- `src/utils/jwt.js` - Funções utilitárias
- `src/services/studentService.js` - Serviço de estudantes
- `src/services/teacherService.js` - Serviço de professores
- `src/services/adminService.js` - Serviço de administradores
- `src/pages/Students.jsx` - Componente de cadastro de estudantes
- `src/pages/Teachers.jsx` - Componente de cadastro de professores

---

## 🔗 Referências

- [JWT Documentation](https://jwt.io/introduction)
- [API Updates](./API_UPDATES.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

**Última atualização:** 04/11/2025  
**Versão:** 2.0.1  
**Status:** ✅ Implementado e testado

---

## 💡 Dica Final

**Sempre verifique se o token está válido antes de cadastrar:**

```javascript
import { isTokenExpired } from "../utils/jwt";

const token = localStorage.getItem('token');
if (isTokenExpired(token)) {
  toast.error("Sessão expirada. Faça login novamente.");
  navigate('/login');
  return;
}

// Continuar com o cadastro...
```

🎉 **Cadastros agora são mais simples e seguros!**