# Página de Unidades Escolares - Documentação Completa

## 📋 Resumo

Esta documentação descreve a implementação completa da página de gerenciamento de Unidades Escolares no Dashboard de Administrador, incluindo funcionalidades CRUD, interface em cards, validações e integração com a API.

---

## 🎯 Funcionalidades Implementadas

### ✅ Gerenciamento Completo (CRUD)
- **CREATE** - Cadastro de novas unidades escolares
- **READ** - Listagem e busca de unidades
- **UPDATE** - Edição de unidades existentes
- **DELETE** - Exclusão de unidades (com confirmação)

### ✅ Interface do Usuário
- Layout em **cards responsivos** (grid 1-2-3 colunas)
- Busca em tempo real por múltiplos campos
- Modal para formulários de cadastro/edição
- Estados de loading e empty state
- Toast notifications para feedback

### ✅ Validações
- Nome: mínimo 3 caracteres
- Endereço: mínimo 10 caracteres
- Telefone: formato numérico (10-11 dígitos)
- Email: formato válido
- Todos os campos obrigatórios

---

## 📁 Arquivos Criados/Modificados

### 1. `src/pages/SchoolUnits.jsx` ⭐ NOVO
Página principal de gerenciamento de unidades escolares.

**Estrutura:**
```javascript
const SchoolUnits = () => {
  // Estados
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);

  // Funcionalidades
  - fetchSchoolUnits()     // Busca todas as unidades
  - onSubmit(data)         // Cria ou atualiza unidade
  - handleEdit(unit)       // Prepara edição
  - handleDelete(id)       // Exclui unidade
  - handleCancel()         // Cancela operação
}
```

### 2. `src/services/schoolUnitService.js` 🔄 ATUALIZADO
Adicionados métodos de update e delete.

**Métodos Adicionados:**
```javascript
// Atualiza unidade existente
async updateSchoolUnit(id, data)

// Exclui unidade
async deleteSchoolUnit(id)
```

### 3. `src/App.jsx` 🔄 ATUALIZADO
Adicionada nova rota protegida.

**Rota Adicionada:**
```javascript
<Route
  path="/school-units"
  element={
    <ProtectedRoute requiredRole="ROLE_ADMIN">
      <Layout>
        <SchoolUnits />
      </Layout>
    </ProtectedRoute>
  }
/>
```

### 4. `src/components/Layout.jsx` 🔄 ATUALIZADO
Adicionado item de menu na navegação.

**Novo Item:**
```javascript
{
  name: "Unidades Escolares",
  href: "/school-units",
  icon: Building2,
  role: "ROLE_ADMIN",
}
```

---

## 🎨 Interface e Design

### Layout de Cards

A página utiliza um design em **cards** ao invés de tabela, proporcionando:
- ✅ Melhor visualização em dispositivos móveis
- ✅ Mais espaço para informações
- ✅ Interface mais moderna e amigável
- ✅ Ícones ilustrativos para cada informação

### Estrutura de um Card:

```
┌─────────────────────────────────────────┐
│ 🏢 Nome da Unidade          [✏️] [🗑️]  │
│                                          │
│ 📍 Endereço completo da unidade         │
│ 📞 Telefone                              │
│ 📧 Email                                 │
│ ──────────────────────────────────      │
│ ID: 1                                    │
└─────────────────────────────────────────┘
```

### Grid Responsivo:
- **Mobile** (< 768px): 1 coluna
- **Tablet** (768px - 1024px): 2 colunas
- **Desktop** (> 1024px): 3 colunas

---

## 🔍 Sistema de Busca

### Campos Pesquisáveis:
- ✅ Nome da unidade
- ✅ Endereço
- ✅ Email
- ✅ Telefone

### Características:
- Busca em tempo real (sem necessidade de clicar em botão)
- Case-insensitive (não diferencia maiúsculas/minúsculas)
- Filtro aplicado automaticamente ao digitar
- Contador de resultados implícito

---

## 📝 Formulário de Cadastro/Edição

### Campos do Formulário:

#### 1. **Nome da Unidade** (obrigatório)
- Tipo: Text
- Validação: Mínimo 3 caracteres
- Placeholder: "Ex: ETEC Polivalente Americana"

#### 2. **Endereço** (obrigatório)
- Tipo: Text
- Validação: Mínimo 10 caracteres
- Placeholder: "Ex: Rua Exemplo, 1000 - Centro"

#### 3. **Telefone** (obrigatório)
- Tipo: Tel
- Validação: Apenas números, 10-11 dígitos
- Pattern: `/^[0-9]{10,11}$/`
- Placeholder: "Ex: 11999999999"

#### 4. **Email** (obrigatório)
- Tipo: Email
- Validação: Formato de email válido
- Pattern: `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i`
- Placeholder: "Ex: contato@escola.com"

---

## 🔐 Segurança e Permissões

### Controle de Acesso:
```
✅ Rota protegida com ProtectedRoute
✅ Acesso restrito a ROLE_ADMIN
✅ Validação JWT em todas as requisições
✅ Redirecionamento para /unauthorized se não autorizado
```

### Confirmação de Exclusão:
```javascript
window.confirm(
  "Tem certeza que deseja excluir esta unidade escolar? 
   Esta ação pode afetar outros registros do sistema."
)
```

**Importante:** A exclusão de uma unidade pode afetar:
- Alunos associados
- Professores associados
- Turmas da unidade
- Secretárias e Coordenadores

---

## 🔗 Endpoints da API

### Base URL: `/api/schoolunit`

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| GET | `/api/schoolunit` | Lista todas as unidades | - |
| POST | `/api/schoolunit` | Cria nova unidade | SchoolUnitRequestDTO |
| PUT | `/api/schoolunit/:id` | Atualiza unidade | SchoolUnitRequestDTO |
| DELETE | `/api/schoolunit/:id` | Exclui unidade | - |

### DTOs:

**SchoolUnitRequestDTO:**
```json
{
  "name": "string",
  "address": "string",
  "phone": "string",
  "email": "string"
}
```

**SchoolUnitResponseDTO:**
```json
{
  "id": "number",
  "name": "string",
  "address": "string",
  "phone": "string",
  "email": "string"
}
```

---

## 🎭 Estados da Interface

### 1. **Loading State**
```
┌─────────────────────────────────────────┐
│                                          │
│            ⏳ (spinner girando)          │
│                                          │
└─────────────────────────────────────────┘
```

### 2. **Empty State** (sem busca)
```
┌─────────────────────────────────────────┐
│              🏢                          │
│   Nenhuma unidade escolar encontrada    │
│   Comece criando uma nova unidade       │
└─────────────────────────────────────────┘
```

### 3. **Empty State** (com busca)
```
┌─────────────────────────────────────────┐
│              🏢                          │
│   Nenhuma unidade escolar encontrada    │
│   Tente buscar com outros termos        │
└─────────────────────────────────────────┘
```

### 4. **Com Dados**
```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Card 1  │ │ Card 2  │ │ Card 3  │
└─────────┘ └─────────┘ └─────────┘
```

---

## 🎨 Componentes Visuais Utilizados

### Ícones (Lucide React):
- `Building2` - Ícone principal (prédio/escola)
- `MapPin` - Endereço
- `Phone` - Telefone
- `Mail` - Email
- `Plus` - Adicionar nova unidade
- `Edit` - Editar unidade
- `Trash2` - Excluir unidade
- `Search` - Campo de busca
- `X` - Fechar modal

### Classes Tailwind CSS:
- `card` - Container de card padrão
- `btn btn-primary` - Botão primário
- `btn btn-secondary` - Botão secundário
- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 📱 Responsividade

### Breakpoints:
```css
/* Mobile First */
Base: grid-cols-1 (1 coluna)

/* Tablet */
md: (768px+) grid-cols-2 (2 colunas)

/* Desktop */
lg: (1024px+) grid-cols-3 (3 colunas)
```

### Adaptações Mobile:
- ✅ Cards ocupam largura total
- ✅ Botões de ação empilhados verticalmente
- ✅ Modal com scroll quando necessário
- ✅ Fonte e espaçamentos otimizados

---

## 🚀 Como Usar

### 1. Acessar a Página:
```
1. Fazer login como ROLE_ADMIN
2. No menu lateral, clicar em "Unidades Escolares"
3. A página será carregada em /school-units
```

### 2. Criar Nova Unidade:
```
1. Clicar no botão "Nova Unidade" (+ ícone)
2. Preencher todos os campos do formulário
3. Clicar em "Criar"
4. Aguardar notificação de sucesso
```

### 3. Buscar Unidade:
```
1. Digitar no campo de busca
2. Resultados filtrados em tempo real
3. Busca em nome, endereço, email e telefone
```

### 4. Editar Unidade:
```
1. Clicar no ícone de edição (✏️) no card
2. Formulário será preenchido com dados atuais
3. Modificar campos desejados
4. Clicar em "Atualizar"
```

### 5. Excluir Unidade:
```
1. Clicar no ícone de lixeira (🗑️) no card
2. Confirmar exclusão no popup
3. Aguardar notificação de sucesso
```

---

## 🧪 Testes Recomendados

### Testes Funcionais:
- [ ] Criar nova unidade com todos os campos válidos
- [ ] Tentar criar sem preencher campos obrigatórios
- [ ] Editar unidade existente
- [ ] Excluir unidade e confirmar
- [ ] Excluir unidade e cancelar
- [ ] Buscar por nome
- [ ] Buscar por endereço
- [ ] Buscar por email
- [ ] Buscar por telefone
- [ ] Buscar termo inexistente

### Testes de Validação:
- [ ] Nome com menos de 3 caracteres
- [ ] Endereço com menos de 10 caracteres
- [ ] Telefone com letras
- [ ] Telefone com menos de 10 dígitos
- [ ] Email em formato inválido
- [ ] Campos vazios

### Testes de Interface:
- [ ] Responsividade em mobile (1 coluna)
- [ ] Responsividade em tablet (2 colunas)
- [ ] Responsividade em desktop (3 colunas)
- [ ] Loading state ao carregar
- [ ] Empty state sem dados
- [ ] Empty state com busca sem resultado
- [ ] Hover nos cards
- [ ] Hover nos botões

---

## 💡 Feedback do Usuário

### Toast Notifications:

#### ✅ Sucesso (Verde):
- "Unidade escolar criada com sucesso!"
- "Unidade escolar atualizada com sucesso!"
- "Unidade escolar excluída com sucesso!"

#### ❌ Erro (Vermelho):
- "Erro ao carregar unidades escolares"
- "Erro ao salvar unidade escolar"
- "Erro ao excluir unidade escolar"

### Confirmações:
- Popup de confirmação antes de excluir
- Aviso sobre impacto em outros registros

---

## 🗂️ Menu de Navegação Atualizado

### Dashboard Admin (ROLE_ADMIN):
```
🏠 Dashboard
👥 Alunos
🎓 Professores
👥 Administradores
👤 Secretárias
🛡️ Coordenadores
🏢 Unidades Escolares ⭐ NOVO
📚 Turmas
📖 Disciplinas
```

---

## 🔄 Fluxo de Dados

### Criação de Unidade:
```
User Input → Form Validation → API POST → 
Success Toast → Reload List → Close Modal
```

### Edição de Unidade:
```
Click Edit → Load Data to Form → User Edit → 
Form Validation → API PUT → Success Toast → 
Reload List → Close Modal
```

### Exclusão de Unidade:
```
Click Delete → Confirm Dialog → API DELETE → 
Success Toast → Reload List
```

### Busca:
```
User Types → Filter Array → Update Display
(No API call - client-side filtering)
```

---

## 🛠️ Dependências

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "react-hook-form": "^7.x",
  "react-hot-toast": "^2.x",
  "lucide-react": "latest"
}
```

---

## 📊 Comparação: Antes vs Depois

### ❌ Antes:
- Sem página de gerenciamento de unidades
- Unidades só acessíveis via API direta
- Sem interface para criar/editar
- Administradores não podiam gerenciar

### ✅ Depois:
- Página completa e funcional
- Interface amigável em cards
- CRUD completo
- Busca em tempo real
- Validações robustas
- Feedback visual em todos os passos

---

## 🎯 Próximas Melhorias (Sugestões)

### Funcionalidades:
1. **Estatísticas por Unidade**
   - Número de alunos
   - Número de professores
   - Número de turmas

2. **Filtros Avançados**
   - Filtrar por região
   - Ordenar por nome/data criação

3. **Exportação**
   - Exportar lista para CSV/Excel
   - Relatórios em PDF

4. **Paginação**
   - Limitar cards por página
   - Navegação entre páginas

5. **Upload de Logo**
   - Adicionar logo da unidade
   - Exibir no card

6. **Mapa de Localização**
   - Integração com Google Maps
   - Mostrar localização no mapa

### UX/UI:
1. **Drag and Drop**
   - Reordenar unidades

2. **Modo Escuro**
   - Tema dark mode

3. **Atalhos de Teclado**
   - Ctrl+N: Nova unidade
   - Esc: Fechar modal

---

## 🐛 Troubleshooting

### Problema: Página não carrega
**Solução:** Verificar se o usuário tem ROLE_ADMIN

### Problema: Erro ao criar unidade
**Solução:** Verificar se o endpoint `/api/schoolunit` existe no backend

### Problema: Unidades não aparecem
**Solução:** Verificar permissões e logs do console

### Problema: Validação não funciona
**Solução:** Verificar se react-hook-form está instalado

### Problema: Cards desalinhados
**Solução:** Verificar classes Tailwind CSS

---

## 📝 Notas Importantes

⚠️ **ATENÇÃO:**
- Excluir uma unidade pode afetar outros registros
- Sempre faça backup antes de excluir
- Não é possível desfazer uma exclusão
- Recomenda-se desativar ao invés de excluir (futura implementação)

✅ **BOAS PRÁTICAS:**
- Sempre preencher todos os campos
- Usar endereço completo
- Telefone com DDD
- Email institucional
- Revisar dados antes de salvar

---

## 🎉 Conclusão

A página de Unidades Escolares foi implementada com sucesso! A interface em cards proporciona uma experiência moderna e responsiva, com todas as funcionalidades necessárias para gerenciar as unidades do sistema de forma eficiente e intuitiva.

**Status:** ✅ Pronto para Produção

**Última Atualização:** 2024
**Versão:** 1.0.0

---

**Desenvolvido com ❤️ para o Sistema Escolar TCC**