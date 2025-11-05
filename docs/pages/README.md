# Documentação das Páginas

Esta documentação detalha todas as páginas do sistema, suas funcionalidades, APIs utilizadas e elementos exibidos.

## Índice de Páginas

### Autenticação
- [Login](#login) - Página de autenticação

### Administrador (ROLE_ADMIN)
- [Dashboard Admin](#dashboard-admin) - Visão geral administrativa
- [Gestão de Alunos](#gestão-de-alunos) - CRUD de estudantes
- [Gestão de Professores](#gestão-de-professores) - CRUD de docentes
- [Gestão de Turmas](#gestão-de-turmas) - Administração de classes
- [Gestão de Disciplinas](#gestão-de-disciplinas) - Administração de matérias

### Professor (ROLE_TEACHER)
- [Dashboard Professor](#dashboard-professor) - Painel do docente
- [Gestão de Atividades](#gestão-de-atividades) - CRUD de atividades
- [Controle de Presença](#controle-de-presença) - Sistema de chamada

### Aluno (ROLE_STUDENT)
- [Dashboard Aluno](#dashboard-aluno) - Painel do estudante
- [Minhas Atividades](#minhas-atividades) - Área de atividades do aluno
- [Minhas Presenças](#minhas-presenças) - Histórico de frequência

### Outras
- [Não Autorizado](#não-autorizado) - Página de erro de acesso

---

## Login
**Arquivo**: `src/pages/Login.jsx`
**Rota**: `/login`
**Acesso**: Público

### Funcionalidades
- Autenticação de usuários (admin, professor, aluno)
- Validação de credenciais
- Redirecionamento baseado em role
- Tratamento de erros de login

### APIs Utilizadas
- `POST /auth/login` - Autenticação do usuário

### Elementos Exibidos
- **Formulário de Login**
  - Campo de usuário/email
  - Campo de senha
  - Botão "Entrar" com loading
- **Branding**
  - Logo do sistema
  - Título "Sistema Escolar"
- **Feedback**
  - Mensagens de erro
  - Estado de carregamento

### Fluxo
1. Usuário insere credenciais
2. Sistema valida dados
3. API autentica usuário
4. Token JWT é armazenado
5. Redirecionamento para dashboard apropriado

---

## Dashboard Admin
**Arquivo**: `src/pages/Dashboard.jsx`
**Rota**: `/dashboard` (para ROLE_ADMIN)
**Acesso**: Apenas administradores

### Funcionalidades
- Visão geral do sistema educacional
- Estatísticas gerais
- Navegação rápida para gestão

### APIs Utilizadas
- `GET /admin/username/{username}` - Dados do admin
- Estatísticas gerais do sistema

### Elementos Exibidos
- **Cards de Estatísticas**
  - Total de alunos
  - Total de professores
  - Total de turmas
  - Atividades criadas
- **Gráficos e Métricas**
  - Desempenho geral
  - Frequência média
- **Ações Rápidas**
  - Links para gestão
  - Atalhos administrativos

---

## Dashboard Professor
**Arquivo**: `src/pages/TeacherDashboard.jsx`
**Rota**: `/dashboard` (para ROLE_TEACHER)
**Acesso**: Apenas professores

### Funcionalidades
- Painel de controle do professor
- Estatísticas das turmas
- Gestão rápida de atividades e presenças

### APIs Utilizadas
- `GET /teacher/username/{username}` - Dados do professor
- `GET /activity/teacher/{id}` - Atividades do professor
- `GET /teacher/classes/{id}` - Turmas do professor
- `GET /submission/teacher/{id}` - Submissões para avaliar

### Elementos Exibidos
- **Informações Pessoais**
  - Nome, CPF, telefone
  - Email e disciplina
- **Estatísticas de Ensino**
  - Total de turmas
  - Total de alunos
  - Atividades criadas
  - Avaliações pendentes
- **Atividades Recentes**
  - Lista das últimas atividades
  - Status de envios
- **Próximas Ações**
  - Avaliações pendentes
  - Chamadas para fazer

---

## Dashboard Aluno
**Arquivo**: `src/pages/StudentDashboard.jsx`
**Rota**: `/dashboard` (para ROLE_STUDENT)
**Acesso**: Apenas alunos

### Funcionalidades
- Painel de controle do estudante
- Acompanhamento de desempenho
- Estatísticas acadêmicas
- Sistema de conquistas e metas

### APIs Utilizadas
- `GET /student/username/{username}` - Dados do aluno
- `GET /activity/schoolClass/{id}` - Atividades da turma
- `GET /submission/student/{id}` - Submissões do aluno
- `GET /attendance/student/{id}` - Presenças do aluno

### Elementos Exibidos
- **Informações Pessoais**
  - Nome, CPF, telefone, email
  - Turma atual
- **Cards de Desempenho**
  - Total de atividades
  - Atividades enviadas
  - Média das notas
  - Taxa de frequência
- **Análise Acadêmica**
  - Taxa de conclusão
  - Atividades avaliadas
  - Performance level
  - Atividades pendentes
- **Análise de Frequência**
  - Total de aulas
  - Presenças confirmadas
  - Taxa de presença
  - Nível de frequência
- **Sistema de Conquistas**
  - Medalhas conquistadas
  - Próximas metas
  - Alertas importantes

---

## Gestão de Atividades
**Arquivo**: `src/pages/Activities.jsx`
**Rota**: `/activities`
**Acesso**: Apenas professores

### Funcionalidades
- CRUD completo de atividades
- Filtros e busca avançada
- Avaliação de submissões
- Controle de prazos

### APIs Utilizadas
- `GET /activity/teacher/{id}` - Listar atividades do professor
- `POST /activity` - Criar nova atividade
- `PUT /activity/{id}` - Atualizar atividade
- `DELETE /activity/{id}` - Deletar atividade
- `GET /submission/activity/{id}` - Submissões da atividade
- `PUT /submission/{id}/grade` - Avaliar submissão

### Elementos Exibidos
- **Header com Estatísticas**
  - Total de atividades
  - Atividades ativas
  - Submissões pendentes
  - Avaliações realizadas
- **Filtros e Busca**
  - Busca por título
  - Filtro por turma
  - Filtro por status
  - Ordenação por data
- **Lista de Atividades**
  - Título e descrição
  - Turma e disciplina
  - Data de criação e prazo
  - Status (ativa/vencida)
  - Número de submissões
- **Modal de Criação/Edição**
  - Formulário completo
  - Upload de arquivos
  - Configuração de prazos
- **Modal de Avaliação**
  - Lista de submissões
  - Sistema de notas
  - Feedback para alunos

---

## Controle de Presença
**Arquivo**: `src/pages/AttendanceCall.jsx`
**Rota**: `/attendance-call`
**Acesso**: Apenas professores

### Funcionalidades
- Sistema de chamada diária
- Controle de presença por turma
- Histórico de chamadas
- Proteção contra duplicação

### APIs Utilizadas
- `GET /teacher/classes/{id}` - Turmas do professor
- `GET /attendance/class/{classId}/date/{date}` - Verificar chamada existente
- `POST /attendance/batch` - Salvar presenças em lote
- `GET /schoolClass/{id}/students` - Alunos da turma

### Elementos Exibidos
- **Seleção de Turma**
  - Dropdown com turmas do professor
  - Data automática (hoje)
  - Informações da turma selecionada
- **Lista de Alunos**
  - Nome completo
  - Controles de presença:
    - Presente na escola e na aula
    - Presente na escola, ausente na aula
    - Ausente da escola
- **Estatísticas em Tempo Real**
  - Total de alunos
  - Presentes
  - Ausentes
  - Taxa de presença
- **Controles de Ação**
  - Marcar todos como presentes
  - Salvar chamada
  - Cancelar alterações
- **Status de Proteção**
  - Aviso se chamada já foi feita
  - Bloqueio de edição quando necessário

---

## Minhas Atividades (Aluno)
**Arquivo**: `src/pages/StudentActivities.jsx`
**Rota**: `/student-activities`
**Acesso**: Apenas alunos

### Funcionalidades
- Visualização de todas as atividades da turma
- Envio de trabalhos
- Acompanhamento de status
- Histórico de notas

### APIs Utilizadas
- `GET /student/username/{username}` - Dados do aluno
- `GET /activity/schoolClass/{id}` - Atividades da turma
- `GET /submission/student/{id}` - Submissões do aluno
- `POST /submission` - Enviar nova submissão
- `PUT /submission/{id}` - Atualizar submissão

### Elementos Exibidos
- **Cards de Estatísticas**
  - Total de atividades
  - Enviadas
  - Pendentes
  - Atrasadas
  - Avaliadas
- **Filtros Inteligentes**
  - Por status (todas, pendentes, enviadas, avaliadas)
  - Busca por título
  - Ordenação por prazo
- **Lista de Atividades**
  - Título e descrição
  - Professor e disciplina
  - Data de postagem e prazo
  - Status visual com badges
  - Nota recebida (se avaliada)
- **Modal de Envio**
  - Upload de arquivos
  - Campo de observações
  - Validação de formatos
- **Modal de Visualização**
  - Detalhes completos
  - Arquivos anexados
  - Feedback do professor
  - Histórico de submissões

---

## Minhas Presenças (Aluno)
**Arquivo**: `src/pages/StudentAttendance.jsx`
**Rota**: `/student-attendance`
**Acesso**: Apenas alunos

### Funcionalidades
- Visualização de presenças por data
- Navegação entre dias
- Estatísticas de frequência
- Detalhes das aulas

### APIs Utilizadas
- `GET /student/username/{username}` - Dados do aluno
- `GET /attendance/student/{id}` - Todas as presenças do aluno
- `GET /teacher/{id}` - Dados dos professores (para nomes)

### Elementos Exibidos
- **Seletor de Data**
  - Input de data
  - Botões de navegação (anterior/próximo)
  - Botão "Hoje"
  - Data selecionada formatada
- **Estatísticas do Dia**
  - Total de aulas
  - Presenças confirmadas
  - Faltas
  - Estava na escola
- **Lista de Presenças**
  - Nome do professor
  - Disciplina (se disponível)
  - Data e hora da aula
  - Status visual:
    - Presente
    - Na escola, ausente da aula
    - Ausente da escola
  - Email do professor
- **Legenda Informativa**
  - Explicação dos diferentes status
  - Orientações sobre frequência
- **Estado Vazio**
  - Mensagem quando não há aulas
  - Orientação para selecionar outra data

---

## Gestão de Alunos
**Arquivo**: `src/pages/Students.jsx`
**Rota**: `/students`
**Acesso**: Apenas administradores

### Funcionalidades
- CRUD completo de estudantes
- Busca e filtros avançados
- Atribuição de turmas
- Visualização de detalhes

### APIs Utilizadas
- `GET /student` - Listar todos os alunos
- `POST /student` - Criar novo aluno
- `PUT /student/{id}` - Atualizar aluno
- `DELETE /student/{id}` - Deletar aluno
- `GET /schoolClass` - Listar turmas (para atribuição)

### Elementos Exibidos
- **Header com Ações**
  - Botão "Novo Aluno"
  - Campo de busca
  - Contador de resultados
- **Filtros**
  - Por turma
  - Por status
  - Ordenação
- **Tabela de Alunos**
  - Nome completo
  - CPF formatado
  - Email
  - Telefone formatado
  - Turma atual
  - Ações (ver, editar, excluir)
- **Modal de Criação/Edição**
  - Dados pessoais
  - Credenciais de acesso
  - Seleção de turma
  - Validação de campos
- **Modal de Detalhes**
  - Informações completas
  - Histórico acadêmico
  - Estatísticas de desempenho

---

## Gestão de Professores
**Arquivo**: `src/pages/Teachers.jsx`
**Rota**: `/teachers`
**Acesso**: Apenas administradores

### Funcionalidades
- CRUD completo de professores
- Atribuição de disciplinas
- Gestão de turmas
- Controle de permissões

### APIs Utilizadas
- `GET /teacher` - Listar todos os professores
- `POST /teacher` - Criar novo professor
- `PUT /teacher/{id}` - Atualizar professor
- `DELETE /teacher/{id}` - Deletar professor
- `GET /subject` - Listar disciplinas

### Elementos Exibidos
- **Header com Controles**
  - Botão "Novo Professor"
  - Busca avançada
  - Filtros por disciplina
- **Grid de Professores**
  - Foto/Avatar
  - Nome e especialização
  - CPF e contato
  - Disciplina lecionada
  - Status ativo/inativo
- **Modal de Formulário**
  - Dados pessoais completos
  - Informações profissionais
  - Seleção de disciplina
  - Configurações de acesso
- **Modal de Perfil**
  - Informações detalhadas
  - Turmas sob responsabilidade
  - Histórico de atividades
  - Estatísticas de ensino

---

## Gestão de Turmas
**Arquivo**: `src/pages/Classes.jsx`
**Rota**: `/classes`
**Acesso**: Apenas administradores

### Funcionalidades
- CRUD de turmas/classes
- Gestão de alunos por turma
- Atribuição de professores
- Controle de capacidade

### APIs Utilizadas
- `GET /schoolClass` - Listar turmas
- `POST /schoolClass` - Criar turma
- `PUT /schoolClass/{id}` - Atualizar turma
- `DELETE /schoolClass/{id}` - Deletar turma
- `GET /schoolClass/{id}/students` - Alunos da turma

### Elementos Exibidos
- **Cards de Turmas**
  - Nome e código da turma
  - Número de alunos
  - Professor responsável
  - Capacidade máxima
  - Status da turma
- **Modal de Criação**
  - Nome da turma
  - Descrição
  - Capacidade máxima
  - Professor responsável
- **Modal de Gestão**
  - Lista de alunos
  - Adicionar/remover alunos
  - Estatísticas da turma
  - Histórico de atividades

---

## Gestão de Disciplinas
**Arquivo**: `src/pages/Subjects.jsx`
**Rota**: `/subjects`
**Acesso**: Apenas administradores

### Funcionalidades
- CRUD de disciplinas/matérias
- Configuração de cargas horárias
- Atribuição de professores
- Controle curricular

### APIs Utilizadas
- `GET /subject` - Listar disciplinas
- `POST /subject` - Criar disciplina
- `PUT /subject/{id}` - Atualizar disciplina
- `DELETE /subject/{id}` - Deletar disciplina

### Elementos Exibidos
- **Lista de Disciplinas**
  - Nome da matéria
  - Código da disciplina
  - Carga horária
  - Professor responsável
  - Status ativo/inativo
- **Formulário de Disciplina**
  - Nome e código
  - Descrição
  - Carga horária semanal
  - Objetivos pedagógicos
- **Estatísticas**
  - Total de disciplinas
  - Professores atribuídos
  - Turmas que cursam
  - Atividades relacionadas

---

## Não Autorizado
**Arquivo**: `src/pages/Unauthorized.jsx`
**Rota**: `/unauthorized`
**Acesso**: Público (erro)

### Funcionalidades
- Página de erro 403
- Orientação ao usuário
- Navegação de retorno

### Elementos Exibidos
- **Mensagem de Erro**
  - Título "Acesso Negado"
  - Explicação sobre permissões
  - Orientações para o usuário
- **Ações Disponíveis**
  - Botão voltar
  - Link para login
  - Contato de suporte

---

## Padrões Comuns

### Estrutura de Loading
Todas as páginas implementam:
```jsx
if (loading) {
  return <Loading text="Carregando dados..." size="lg" />;
}
```

### Tratamento de Erros
```jsx
try {
  // Operação da API
} catch (error) {
  toast.error("Mensagem de erro");
  console.error("Log detalhado:", error);
}
```

### Estados Vazios
```jsx
{data.length === 0 && (
  <EmptyState
    icon={Icon}
    title="Nenhum item encontrado"
    message="Descrição orientativa"
  />
)}
```

### Proteção de Rotas
```jsx
<ProtectedRoute requiredRole="ROLE_ADMIN">
  <Layout>
    <ComponentePage />
  </Layout>
</ProtectedRoute>
```

---

*Documentação das páginas atualizada em: Outubro 2025*
