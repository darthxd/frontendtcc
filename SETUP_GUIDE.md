# Guia de Instalação e Uso - Sistema de Atividades

## 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn** como gerenciador de pacotes
- **Git** para controle de versão
- **Backend API** rodando na porta 8080

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd frontendtcc
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

O sistema está configurado para conectar com o backend em `http://localhost:8080`. Se necessário, altere a URL base no arquivo:
```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';
```

### 4. Execute o projeto
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:5173`

## 🔐 Acesso ao Sistema

### Usuários de Teste

Para testar as funcionalidades, você precisará de contas com diferentes roles:

#### Professor (ROLE_TEACHER)
- Username: professor1
- Password: senha123

#### Estudante (ROLE_STUDENT)
- Username: aluno1
- Password: senha123

#### Administrador (ROLE_ADMIN)
- Username: admin
- Password: senha123

*Nota: Estes são exemplos. Use as credenciais reais do seu backend.*

## 📖 Como Usar

### 👨‍🏫 Para Professores

1. **Fazer Login**
   - Acesse `http://localhost:5173/login`
   - Entre com credenciais de professor

2. **Acessar Atividades**
   - No menu lateral, clique em "Atividades"
   - Selecione uma turma no dropdown

3. **Criar Nova Atividade**
   - Clique no botão "Nova Atividade"
   - Preencha os campos:
     - **Título**: Nome da atividade
     - **Descrição**: Detalhes da atividade
     - **Prazo**: Data e hora limite para entrega
     - **Nota Máxima**: Valor entre 0 e 10
     - **Turma**: Selecione uma das suas turmas
   - Clique em "Criar"

4. **Gerenciar Atividades**
   - ✏️ **Editar**: Clique no ícone de lápis
   - 🗑️ **Excluir**: Clique no ícone de lixeira
   - 👁️ **Visualizar**: Veja status e informações detalhadas

### 👨‍🎓 Para Estudantes

1. **Fazer Login**
   - Acesse `http://localhost:5173/login`
   - Entre com credenciais de estudante

2. **Visualizar Dashboard**
   - O dashboard do aluno será exibido automaticamente
   - Veja suas estatísticas:
     - Total de atividades
     - Atividades enviadas
     - Atividades pendentes
     - Média geral

3. **Enviar Atividade**
   - Encontre a atividade na lista
   - Clique no botão "Enviar" (apenas para atividades pendentes)
   - Preencha sua resposta no campo de texto
   - Opcionalmente, adicione um link para arquivo
   - Clique em "Enviar Atividade"

4. **Acompanhar Status**
   - 🟡 **Pendente**: Atividade não enviada (dentro do prazo)
   - 🔵 **Enviado**: Atividade enviada, aguardando avaliação
   - 🟢 **Avaliado**: Atividade avaliada com nota
   - 🔴 **Atrasado**: Atividade não enviada após o prazo

## 🔧 Funcionalidades Técnicas

### Autenticação
- JWT Token armazenado no localStorage
- Interceptors automáticos para requisições
- Redirecionamento automático em caso de token expirado

### Responsividade
- Design mobile-first
- Sidebar colapsível em dispositivos móveis
- Cards e formulários adaptativos

### Notificações
- Toast notifications para feedback
- Mensagens de erro e sucesso
- Loading states durante operações

## 🐛 Solução de Problemas

### Erro de Conexão com Backend
```
Error: Network Error
```
**Solução**: Verifique se o backend está rodando na porta 8080

### Token Expirado
```
401 Unauthorized
```
**Solução**: Faça login novamente. O sistema redirecionará automaticamente.

### Dados Não Carregam
**Verificações**:
1. Backend está online?
2. Usuário tem as permissões corretas?
3. Dados existem no banco?

### Formulários Não Funcionam
**Verificações**:
1. Todos os campos obrigatórios foram preenchidos?
2. Formato da data está correto?
3. Nota máxima está entre 0 e 10?

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.jsx      # Layout principal com navegação
│   ├── EmptyState.jsx  # Estados vazios
│   └── StatusIcon.jsx  # Ícones de status
├── contexts/           # Contextos React
│   └── AuthContext.jsx # Autenticação
├── pages/              # Páginas principais
│   ├── Activities.jsx  # Gestão de atividades (Professor)
│   ├── StudentDashboard.jsx # Dashboard do aluno
│   └── Login.jsx       # Página de login
├── services/           # Serviços de API
│   ├── api.js         # Configuração do Axios
│   ├── authService.js # Autenticação
│   └── activityService.js # Atividades
└── App.jsx            # Componente principal com rotas
```

## 🔄 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Executar em modo desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build de produção
```

### Linting e Formatação
```bash
npm run lint         # Verificar código
```

## 📞 Suporte

Em caso de problemas:

1. **Verifique os logs do console** (F12 → Console)
2. **Confirme se o backend está funcionando**
3. **Teste com dados diferentes**
4. **Documente o erro** com prints e logs

## 🎯 Próximos Passos

Funcionalidades que podem ser implementadas:

- [ ] Upload de arquivos para atividades
- [ ] Comentários em atividades
- [ ] Relatórios de desempenho
- [ ] Notificações em tempo real
- [ ] Rubrica de avaliação
- [ ] Atividades em grupo
- [ ] Calendário de atividades
- [ ] Exportar relatórios em PDF

## 📝 Changelog

### v1.0.0 (Atual)
- ✅ Sistema de login por roles
- ✅ CRUD de atividades para professores
- ✅ Dashboard personalizado para alunos
- ✅ Sistema de submissão de atividades
- ✅ Cálculo automático de estatísticas
- ✅ Interface responsiva
- ✅ Validação de formulários
- ✅ Tratamento de erros