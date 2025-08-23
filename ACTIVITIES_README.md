# Sistema de Atividades - Frontend TCC

## 📋 Novas Funcionalidades Implementadas

Este documento descreve as novas funcionalidades adicionadas ao sistema escolar para gestão de atividades pelos professores e acompanhamento pelos alunos.

## 🎯 Funcionalidades Criadas

### 1. **Página de Atividades para Professores** (`/activities`)
- **Acesso:** Somente usuários com role `ROLE_TEACHER`
- **Funcionalidades:**
  - Visualizar todas as atividades das turmas do professor
  - Criar novas atividades
  - Editar atividades existentes
  - Excluir atividades
  - Filtrar atividades por turma
  - Visualizar status das atividades (prazo, nota máxima)
  - **Corrigir submissões** - visualizar respostas dos alunos e atribuir notas
  - Estatísticas em tempo real (total de submissões, corrigidas, pendentes)
  - Indicadores visuais para submissões pendentes de correção

### 2. **Dashboard do Aluno** (`/dashboard` - para estudantes)
- **Acesso:** Somente usuários com role `ROLE_STUDENT`
- **Funcionalidades:**
  - Visualizar estatísticas pessoais (atividades totais, enviadas, pendentes, média)
  - Ver informações pessoais do aluno
  - Acompanhar desempenho acadêmico
  - Listar todas as atividades da turma
  - Enviar respostas para atividades
  - Visualizar notas recebidas
  - Status das atividades (Pendente, Enviado, Avaliado, Atrasado)

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
- `src/services/activityService.js` - Serviço para comunicação com a API de atividades
- `src/pages/Activities.jsx` - Página de gestão de atividades para professores
- `src/pages/StudentDashboard.jsx` - Dashboard personalizado para estudantes
- `src/components/StatusIcon.jsx` - Componente para ícones de status

### Arquivos Modificados:
- `src/App.jsx` - Adicionadas novas rotas e separação de dashboards por role
- `src/components/Layout.jsx` - Adicionado link "Atividades" na navegação para professores
- `src/index.css` - Adicionados estilos para as novas funcionalidades

## 🔌 Integração com Backend

### Endpoints Utilizados:
- `GET /api/activity/{id}` - Buscar atividade por ID
- `GET /api/activity/schoolclass/{id}` - Listar atividades por turma
- `GET /api/activity/{id}/submission` - **Listar submissões por atividade**
- `POST /api/activity` - Criar nova atividade
- `PUT /api/activity/{id}` - Atualizar atividade
- `DELETE /api/activity/{id}` - Deletar atividade
- `GET /api/activity/submission/{id}` - Buscar submissão por ID
- `GET /api/activity/submission/student/{id}` - Listar submissões por estudante
- `POST /api/activity/submission/{id}` - Enviar atividade
- `POST /api/activity/submission/{id}/grade` - Avaliar submissão
- `GET /api/student/username/{username}` - Dados do estudante por username
- `GET /api/student/{id}` - **Dados do estudante por ID**
- `GET /api/teacher/username/{username}` - Dados do professor por username

### DTOs Esperados:
- `ActivityRequestDTO`: title, description, deadline, maxScore, teacherId, schoolClassId
- `ActivitySubmissionRequestDTO`: studentId, answerText, fileUrl
- `GradeSubmissionRequestDTO`: grade

## 🎨 Interface do Usuário

### Design System:
- Utiliza Tailwind CSS para estilização
- Componentes reutilizáveis com classes CSS personalizadas
- Ícones do Lucide React
- Responsivo (mobile-first)
- Tema consistente com cores primárias azuis

### Componentes de UI:
- Cards informativos com estatísticas
- Formulários modais para criação/edição
- Tabelas e listas responsivas
- Badges de status coloridos
- Botões de ação contextuais
- **Interface de correção em duas colunas**: lista de submissões + detalhes
- **Indicadores de progresso**: barras visuais para submissões corrigidas
- **Notificações badge**: números em vermelho para submissões pendentes

## 🔐 Controle de Acesso

### Professores (`ROLE_TEACHER`):
- Acesso à página de atividades
- Podem criar atividades apenas para suas turmas
- Visualizam apenas atividades das turmas que lecionam
- **Correção de atividades**: visualizar submissões e atribuir notas
- Estatísticas detalhadas de submissões por atividade

### Estudantes (`ROLE_STUDENT`):
- Dashboard personalizado com suas atividades
- Podem enviar respostas para atividades da sua turma
- Visualizam apenas suas próprias submissões e notas

### Administradores (`ROLE_ADMIN`):
- Mantém acesso ao dashboard administrativo original
- Não têm acesso direto às páginas de atividades (podem ser adicionadas permissões futuras)

## 🚀 Como Usar

### Para Professores:
1. Fazer login com conta de professor
2. Navegar para "Atividades" no menu lateral
3. Selecionar uma turma no dropdown
4. Clicar em "Nova Atividade" para criar
5. Preencher formulário com título, descrição, prazo e nota máxima
6. Gerenciar atividades existentes com opções de editar/excluir
7. **Corrigir atividades**:
   - Clicar no ícone verde de "Corrigir" em qualquer atividade
   - Visualizar lista de submissões dos alunos
   - Selecionar uma submissão para ver detalhes
   - Ler a resposta do aluno e arquivos anexos
   - Atribuir ou atualizar a nota (0 até nota máxima da atividade)
   - Acompanhar progresso com indicadores visuais

### Para Estudantes:
1. Fazer login com conta de estudante
2. O dashboard será exibido automaticamente
3. Visualizar estatísticas pessoais no topo
4. Ver lista de atividades da turma
5. Clicar em "Enviar" para responder atividades pendentes
6. Acompanhar status e notas recebidas

## 🔧 Configuração Técnica

### Dependências Necessárias:
- React 18+
- React Router DOM 6+
- Axios para requisições HTTP
- Tailwind CSS para estilos
- Lucide React para ícones
- React Hot Toast para notificações

### Variáveis de Ambiente:
- Backend deve estar rodando em `http://localhost:8080`
- JWT Token armazenado em localStorage
- Autenticação via interceptors do Axios

## 🐛 Tratamento de Erros

- Validação de formulários com mensagens claras
- Toast notifications para feedback de ações
- Loading states durante requisições
- Fallbacks para dados não encontrados
- Redirects apropriados para usuários não autorizados

## 📱 Responsividade

- Design mobile-first
- Breakpoints configurados: sm (640px), md (768px), lg (1024px)
- Sidebar colapsível em dispositivos móveis
- Cards e formulários adaptáveis
- Textos e botões otimizados para touch

## 🔄 Estados da Aplicação

### Status das Atividades:
- **Pendente** (amarelo): Atividade não enviada, dentro do prazo
- **Enviado** (azul): Atividade enviada, aguardando avaliação
- **Avaliado** (verde): Atividade avaliada com nota
- **Atrasado** (vermelho): Atividade não enviada após o prazo

### Fluxo de Dados:
1. Professor cria atividade → Aluno visualiza
2. Aluno envia resposta → Status muda para "Enviado"
3. Professor avalia → Status muda para "Avaliado"
4. Estatísticas são atualizadas automaticamente

## 📊 Métricas e Analytics

### Dashboard do Estudante:
- Total de atividades disponíveis
- Atividades enviadas vs pendentes
- Média geral das notas
- Taxa de conclusão percentual
- Histórico de submissões

### Página do Professor:
- Número de atividades criadas por turma
- Visualização de prazos e status
- Gestão eficiente de múltiplas turmas