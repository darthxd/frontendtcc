# Rotas de Secretárias e Coordenadores - Documentação

## Resumo das Alterações

Este documento descreve as alterações realizadas para adicionar as páginas de cadastro e busca de Secretárias e Coordenadores ao Dashboard de Admin, incluindo a configuração das rotas no React Router.

## Arquivos Criados

### 1. `src/pages/Coordinators.jsx`
Nova página para gerenciamento completo de coordenadores com as seguintes funcionalidades:
- ✅ Listagem de todos os coordenadores
- ✅ Busca por nome de usuário, email ou telefone
- ✅ Cadastro de novos coordenadores
- ✅ Edição de coordenadores existentes
- ✅ Exclusão de coordenadores
- ✅ Associação com unidades escolares
- ✅ Validação de formulários com react-hook-form
- ✅ Notificações toast para feedback do usuário

## Arquivos Modificados

### 1. `src/App.jsx`
**Alterações:**
- Importação dos componentes `Secretaries` e `Coordinators`
- Adição de duas novas rotas protegidas (apenas ROLE_ADMIN):
  - `/secretaries` - Página de gerenciamento de secretárias
  - `/coordinators` - Página de gerenciamento de coordenadores

**Rotas Adicionadas:**
```javascript
<Route
  path="/secretaries"
  element={
    <ProtectedRoute requiredRole="ROLE_ADMIN">
      <Layout>
        <Secretaries />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/coordinators"
  element={
    <ProtectedRoute requiredRole="ROLE_ADMIN">
      <Layout>
        <Coordinators />
      </Layout>
    </ProtectedRoute>
  }
/>
```

### 2. `src/components/Layout.jsx`
**Alterações:**
- Importação dos ícones `Shield` e `UserCog` do lucide-react
- Adição de dois novos itens no array de navegação do Admin:

**Novos Itens de Menu:**
```javascript
{
  name: "Secretárias",
  href: "/secretaries",
  icon: UserCog,
  role: "ROLE_ADMIN",
},
{
  name: "Coordenadores",
  href: "/coordinators",
  icon: Shield,
  role: "ROLE_ADMIN",
}
```

## Estrutura das Páginas

### Página de Coordinators (`Coordinators.jsx`)

#### Estados Gerenciados:
- `coordinators` - Lista de coordenadores
- `loading` - Estado de carregamento
- `showForm` - Controle de exibição do formulário
- `editingCoordinator` - Coordenador sendo editado
- `searchTerm` - Termo de busca
- `filteredCoordinators` - Lista filtrada
- `schoolUnits` - Unidades escolares disponíveis
- `loadingUnits` - Estado de carregamento das unidades

#### Funcionalidades:
1. **Busca em Tempo Real**
   - Filtra por username, email ou telefone
   - Atualização automática da lista

2. **Formulário de Cadastro/Edição**
   - Modal com validação completa
   - Campos: username, password (só no cadastro), email, phone, unitId
   - Validações:
     - Username: mínimo 3 caracteres
     - Password: mínimo 6 caracteres (apenas criação)
     - Email: formato válido
     - Telefone: obrigatório
     - Unidade Escolar: obrigatória

3. **Tabela de Coordenadores**
   - Colunas: Usuário, Email, Telefone, Unidade Escolar, Ações
   - Ações: Editar e Excluir
   - Estado vazio com mensagem amigável
   - Loading state com spinner

#### Endpoints da API:
- `GET /coordinator` - Lista todos os coordenadores
- `POST /coordinator` - Cria novo coordenador
- `PUT /coordinator/:id` - Atualiza coordenador
- `DELETE /coordinator/:id` - Exclui coordenador

### Página de Secretaries (`Secretaries.jsx`)
A página de Secretaries já existia e segue a mesma estrutura da página de Coordinators, com funcionalidades equivalentes.

## Navegação do Dashboard Admin

### Menu Lateral (Sidebar)
Ordem dos itens para ROLE_ADMIN:
1. 🏠 Dashboard
2. 👥 Alunos
3. 🎓 Professores
4. 👥 Administradores
5. 👤 **Secretárias** (NOVO)
6. 🛡️ **Coordenadores** (NOVO)
7. 📚 Turmas
8. 📖 Disciplinas

## Segurança e Permissões

### Controle de Acesso:
- ✅ Todas as rotas estão protegidas com `ProtectedRoute`
- ✅ Apenas usuários com `ROLE_ADMIN` podem acessar
- ✅ Redirecionamento automático para `/unauthorized` em caso de acesso negado
- ✅ Validação de token JWT em todas as requisições

### Integração com Unidades Escolares:
- ✅ Utiliza `schoolUnitService` para buscar unidades
- ✅ Suporte para `getUnitIdFromToken()` - pega ID da unidade do token
- ✅ Seleção de unidade escolar no formulário

## Estilos e UX

### Design Consistente:
- ✅ Utiliza classes Tailwind CSS do sistema
- ✅ Botões com classes `btn btn-primary` e `btn btn-secondary`
- ✅ Cards com classe `card`
- ✅ Ícones Lucide React
- ✅ Estados de loading e empty states
- ✅ Hover effects nas linhas da tabela
- ✅ Modal centralizado com overlay

### Feedback do Usuário:
- ✅ Toast notifications com `react-hot-toast`
- ✅ Mensagens de sucesso em verde
- ✅ Mensagens de erro em vermelho
- ✅ Confirmação antes de excluir (window.confirm)

## Como Testar

### 1. Acessar as Páginas:
```
1. Fazer login como ROLE_ADMIN
2. Clicar em "Secretárias" no menu lateral
3. Clicar em "Coordenadores" no menu lateral
```

### 2. Testar Funcionalidades:
- ✅ Criar novo coordenador/secretária
- ✅ Editar coordenador/secretária existente
- ✅ Buscar por diferentes termos
- ✅ Excluir coordenador/secretária
- ✅ Verificar validações de formulário
- ✅ Testar associação com unidades escolares

### 3. Verificar Responsividade:
- Desktop (sidebar fixa)
- Tablet (sidebar responsiva)
- Mobile (menu hambúrguer)

## Dependências Utilizadas

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "react-hook-form": "^7.x",
  "react-hot-toast": "^2.x",
  "lucide-react": "latest"
}
```

## Próximos Passos (Sugestões)

1. **Filtros Avançados:**
   - Filtrar por unidade escolar
   - Filtrar por status (ativo/inativo)

2. **Paginação:**
   - Adicionar paginação para listas grandes
   - Controle de itens por página

3. **Exportação:**
   - Exportar lista para CSV/Excel
   - Relatórios em PDF

4. **Detalhes:**
   - Página de detalhes do coordenador/secretária
   - Histórico de ações

5. **Bulk Actions:**
   - Seleção múltipla
   - Ações em lote (excluir, atualizar unidade)

## Troubleshooting

### Problema: Rotas não aparecem no menu
**Solução:** Verificar se o usuário tem `ROLE_ADMIN` no token JWT

### Problema: Erro 403 ao carregar dados
**Solução:** Verificar permissões no backend para os endpoints `/coordinator` e `/secretary`

### Problema: Unidades não carregam
**Solução:** Verificar se o `schoolUnitService` está configurado corretamente

### Problema: Formulário não valida
**Solução:** Verificar se o `react-hook-form` está importado e configurado

## Conclusão

As rotas de Secretárias e Coordenadores foram implementadas com sucesso no Dashboard Admin, seguindo os padrões do projeto e integrando-se perfeitamente com o React Router e o sistema de autenticação existente.

Todas as funcionalidades estão operacionais e prontas para uso em produção! 🚀