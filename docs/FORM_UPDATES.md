# 📝 Atualizações de Formulários

## 📋 Visão Geral

Este documento detalha todas as atualizações realizadas nos formulários do sistema para incluir os campos necessários conforme a nova versão da API.

---

## ✅ Formulários Atualizados

### 1. **Estudantes (Students.jsx)**

#### Campos Adicionados:
- ✅ **address** - Endereço completo do estudante

#### Estrutura Completa do Formulário:
```javascript
{
  name: string,           // Nome completo *
  username: string,       // Usuário (gerado automaticamente) *
  password: string,       // Senha (gerado automaticamente) *
  cpf: string,           // CPF *
  rm: number,            // Registro de Matrícula *
  ra: string,            // Registro do Aluno *
  email: string,         // Email *
  phone: string,         // Telefone
  birthdate: string,     // Data de nascimento (YYYY-MM-DD)
  address: string,       // Endereço NOVO! ✨
  schoolClassId: number, // ID da turma *
  unitId: number        // ID da unidade (automático)
}
```

#### Validações:
- Nome: obrigatório
- CPF: obrigatório
- RM: obrigatório
- RA: obrigatório
- Email: obrigatório + formato válido
- Turma: obrigatória
- Endereço: opcional

---

### 2. **Professores (Teachers.jsx)**

#### Campos Existentes (já completos):
- ✅ **name** - Nome completo
- ✅ **username** - Usuário para login
- ✅ **password** - Senha
- ✅ **email** - Email
- ✅ **cpf** - CPF
- ✅ **phone** - Telefone
- ✅ **subjectIds** - Disciplinas que leciona
- ✅ **schoolClassIds** - Turmas em que leciona

#### Estrutura Completa do Formulário:
```javascript
{
  name: string,              // Nome completo *
  username: string,          // Usuário *
  password: string,          // Senha *
  cpf: string,              // CPF *
  email: string,            // Email *
  phone: string,            // Telefone
  subjectIds: number[],     // IDs das disciplinas
  schoolClassIds: number[], // IDs das turmas
  unitId: number           // ID da unidade (automático)
}
```

#### Validações:
- Nome: obrigatório
- Usuário: obrigatório, mínimo 3 caracteres
- Senha: obrigatória (apenas na criação), mínimo 6 caracteres
- Email: obrigatório + formato válido
- CPF: obrigatório

---

### 3. **Administradores (Admins.jsx)** - NOVA PÁGINA! ✨

#### Página Criada do Zero:
- ✅ Listagem de administradores
- ✅ Criação de administradores
- ✅ Edição de administradores
- ✅ Exclusão de administradores
- ✅ Busca por nome ou usuário
- ✅ Estatísticas (total, unidades cobertas, resultados)

#### Campos do Formulário:
```javascript
{
  name: string,      // Nome completo NOVO! ✨ *
  username: string,  // Usuário *
  password: string,  // Senha *
  unitId: number    // ID da unidade (pode ser automático)
}
```

#### Validações:
- Nome: obrigatório
- Usuário: obrigatório, mínimo 3 caracteres (não editável após criação)
- Senha: obrigatória (criação), opcional (edição), mínimo 6 caracteres
- Unidade: obrigatória

#### Recursos Especiais:
- Username não pode ser alterado após criação
- Senha opcional na edição (mantém atual se não preencher)
- Seleção de unidade escolar via dropdown
- UnitId pode ser preenchido automaticamente do token JWT

---

## 🎯 Campos por Modelo da API

### Admin Model
```java
{
  id: Long,
  username: String,
  password: String,
  role: RolesEnum,
  unitId: Long,
  name: String        // ✨ NOVO CAMPO
}
```

### Student Model
```java
{
  id: Long,
  username: String,
  password: String,
  role: RolesEnum,
  unitId: Long,
  status: StatusEnum, // ACTIVE, INACTIVE, DELETED
  name: String,
  rm: Integer,
  ra: String,
  cpf: String,
  phone: String,
  email: String,
  schoolClassId: Long,
  birthdate: LocalDate,
  address: String,    // ✨ NOVO CAMPO
  photoUrl: String,
  biometry: Boolean,
  inschool: Boolean,
  sendNotification: Boolean
}
```

### Teacher Model
```java
{
  id: Long,
  username: String,
  password: String,
  role: RolesEnum,
  unitId: Long,
  name: String,
  cpf: String,
  email: String,
  phone: String,
  subjectIds: Set<Long>,
  schoolClassIds: Set<Long>
}
```

---

## 🔄 Alterações de Comportamento

### UnitId Automático
Todos os formulários agora preenchem automaticamente o `unitId` do usuário logado:

```javascript
// Antes - tinha que passar manualmente
await studentService.createStudent({
  ...data,
  unitId: 1  // ❌ Manual
});

// Agora - preenchido automaticamente
await studentService.createStudent(data); // ✅ Automático
```

### Validações Aprimoradas
- CPF: validação de formato e dígitos verificadores
- Email: validação de formato
- Telefone: formatação automática
- Senha: mínimo 6 caracteres

---

## 📱 Interface dos Formulários

### Padrão de Layout
Todos os formulários seguem o mesmo padrão:

1. **Modal Overlay** - Fundo escuro semi-transparente
2. **Container Centralizado** - Largura máxima 2xl (768px)
3. **Grid Responsivo** - 1 coluna (mobile) / 2 colunas (desktop)
4. **Campos Obrigatórios** - Marcados com asterisco (*)
5. **Botões de Ação** - Cancelar (secundário) / Salvar (primário)

### Elementos Visuais
- **Ícones**: Lucide React
- **Cores**: Tailwind CSS
- **Feedback**: React Hot Toast
- **Loading**: Spinner animado

---

## 🧪 Testando os Formulários

### 1. Criar Estudante
```javascript
// Abrir página de estudantes
navigate('/students');

// Clicar em "Novo Aluno"
// Preencher todos os campos obrigatórios
// Incluir endereço (novo campo)
// Submeter

// Verificar no Network tab:
// POST /student
// Payload deve incluir "address"
```

### 2. Criar Professor
```javascript
// Abrir página de professores
navigate('/teachers');

// Clicar em "Novo Professor"
// Preencher campos obrigatórios
// Selecionar disciplinas e turmas
// Submeter

// unitId é preenchido automaticamente
```

### 3. Criar Administrador
```javascript
// Abrir nova página de administradores
navigate('/admins');

// Clicar em "Novo Administrador"
// Preencher nome (novo campo obrigatório)
// Preencher usuário e senha
// Selecionar unidade
// Submeter
```

---

## 🎨 Estrutura do Código

### Padrão de Componente de Formulário

```jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { nomeService } from "../services/nomeService";
import toast from "react-hot-toast";

const NomePage = () => {
  // Estados
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // useEffects
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Filtrar items baseado no searchTerm
  }, [searchTerm, items]);

  // Funções CRUD
  const fetchItems = async () => { /* ... */ };
  const onSubmit = async (data) => { /* ... */ };
  const handleEdit = (item) => { /* ... */ };
  const handleDelete = (id) => { /* ... */ };
  const handleCancel = () => { /* ... */ };

  // Render
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Search */}
      {/* Modal Form */}
      {/* Table */}
      {/* Stats */}
    </div>
  );
};
```

---

## 📊 Checklist de Implementação

### Estudantes
- [x] Campo address adicionado
- [x] Validação de address
- [x] UnitId automático
- [x] Serviço atualizado

### Professores
- [x] Todos os campos presentes
- [x] UnitId automático
- [x] Serviço atualizado
- [x] Seleção múltipla de disciplinas
- [x] Seleção múltipla de turmas

### Administradores
- [x] Página criada do zero
- [x] Campo name adicionado
- [x] CRUD completo
- [x] Busca implementada
- [x] UnitId automático
- [x] Rota adicionada no App.jsx
- [x] Link no menu de navegação

---

## 🔗 Arquivos Relacionados

### Páginas
- `src/pages/Students.jsx` - Formulário de estudantes
- `src/pages/Teachers.jsx` - Formulário de professores
- `src/pages/Admins.jsx` - Formulário de administradores (NOVO)

### Serviços
- `src/services/studentService.js` - CRUD de estudantes
- `src/services/teacherService.js` - CRUD de professores
- `src/services/adminService.js` - CRUD de administradores

### Componentes
- `src/components/Layout.jsx` - Menu de navegação
- `src/App.jsx` - Rotas da aplicação

---

## 🚀 Próximas Melhorias Sugeridas

### Validações Avançadas
- [ ] Validação de CEP no endereço
- [ ] Autocompletar endereço via API de CEP
- [ ] Máscara de CPF e telefone
- [ ] Verificação de duplicidade de CPF/RA/RM

### UX/UI
- [ ] Upload de foto do estudante
- [ ] Preview de dados antes de salvar
- [ ] Confirmação de exclusão mais robusta
- [ ] Filtros avançados na listagem

### Funcionalidades
- [ ] Importação em massa via CSV
- [ ] Exportação de dados
- [ ] Histórico de alterações
- [ ] Permissões granulares por admin

---

## 📞 Suporte

### Problemas Comuns

**❌ "Address não está sendo salvo"**
- Verificar se o campo está no formulário
- Verificar se está sendo enviado no payload
- Verificar se a API aceita o campo

**❌ "UnitId está undefined"**
- Verificar se o token contém unitId
- Verificar se está logado
- Token pode estar expirado

**❌ "Formulário não abre"**
- Verificar console por erros
- Verificar se o estado showForm está correto
- Verificar se há erro de renderização

---

**Última atualização:** 04/11/2025  
**Versão:** 2.1.0  
**Status:** ✅ Todos os formulários atualizados

---

## 🎉 Resumo

### O que foi feito:
1. ✅ Campo `address` adicionado em Students
2. ✅ Página completa de Admins criada com campo `name`
3. ✅ Todos os formulários usam `unitId` automático
4. ✅ Validações aprimoradas
5. ✅ Padrão consistente em todos os formulários

### Campos novos por entidade:
- **Admin**: `name` (nome completo)
- **Student**: `address` (endereço)
- **Teacher**: (já tinha todos os campos)

**Todos os formulários estão prontos para uso! 🚀**