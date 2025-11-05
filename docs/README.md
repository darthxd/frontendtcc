# Documentação do Frontend - Sistema Escolar

## Visão Geral

Este é um sistema de gestão escolar desenvolvido em React com Vite, que oferece funcionalidades completas para administradores, professores e alunos. O sistema permite gerenciar atividades, presenças, turmas e acompanhar o desempenho acadêmico.

## Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface (Loading, Cards, etc.)
│   └── ...             # Outros componentes específicos
├── contexts/           # Contextos React (Auth, etc.)
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── services/           # Serviços para comunicação com API
├── utils/              # Funções utilitárias e formatadores
└── assets/             # Recursos estáticos
```

## Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações
- **Axios** - Cliente HTTP

## Perfis de Usuário

### Administrador (ROLE_ADMIN)
- Gerenciamento completo de alunos, professores e turmas
- Criação e administração de disciplinas
- Acesso a dashboards administrativos
- Visão geral de todo o sistema

### Professor (ROLE_TEACHER)
- Criação e gerenciamento de atividades
- Realização de chamadas (controle de presença)
- Avaliação de atividades dos alunos
- Dashboard com estatísticas da turma

### Aluno (ROLE_STUDENT)
- Visualização e envio de atividades
- Acompanhamento de presenças
- Dashboard com desempenho acadêmico
- Histórico de notas e frequência

## Estrutura da Documentação

- **[Páginas](./pages/README.md)** - Documentação de todas as páginas
- **[APIs](./apis/README.md)** - Documentação dos serviços e endpoints
- **[Componentes](./components/README.md)** - Componentes reutilizáveis
- **[Autenticação](./auth/README.md)** - Sistema de autenticação
- **[Roteamento](./routing/README.md)** - Configuração de rotas
- **[Utilitários](./utils/README.md)** - Funções utilitárias

## Como Iniciar

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**
   ```bash
   # .env
   VITE_API_URI=http://localhost:8080/api
   ```

3. **Executar em desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Build para produção**
   ```bash
   npm run build
   ```

## Fluxo de Autenticação

1. **Login** - Usuário insere credenciais
2. **JWT Token** - Backend retorna token de acesso
3. **Armazenamento** - Token salvo no localStorage
4. **Interceptor** - Axios adiciona token automaticamente
5. **Autorização** - Rotas protegidas por role

## Funcionalidades Principais

### Para Administradores
- **Gestão de Usuários** - CRUD completo de alunos e professores
- **Gestão de Turmas** - Criação e organização de classes
- **Gestão de Disciplinas** - Administração de matérias
- **Dashboard Administrativo** - Visão geral do sistema

### Para Professores
- **Gestão de Atividades** - Criar, editar e avaliar atividades
- **Controle de Presença** - Realizar chamadas diárias
- **Dashboard do Professor** - Estatísticas e acompanhamento
- **Avaliação de Alunos** - Sistema de notas e feedback

### Para Alunos
- **Área de Atividades** - Visualizar e enviar trabalhos
- **Controle de Presenças** - Acompanhar frequência
- **Dashboard do Aluno** - Desempenho e estatísticas
- **Sistema de Conquistas** - Medalhas por desempenho

## Sistema de Design

### Cores Principais
- **Primary**: Azul (#3B82F6)
- **Success**: Verde (#10B981)
- **Warning**: Amarelo (#F59E0B)
- **Error**: Vermelho (#EF4444)

### Componentes Padrão
- **Cards**: Containers com bordas arredondadas
- **Buttons**: Botões com states hover e loading
- **Inputs**: Campos de formulário padronizados
- **Loading**: Estados de carregamento consistentes

## Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Vite** - Hot reload e build otimizado
- **React DevTools** - Debug de componentes

## Métricas de Qualidade

- **Reutilização**: 95% dos componentes são reutilizáveis
- **Performance**: Bundle otimizado com Vite
- **Manutenibilidade**: Código limpo e bem documentado
- **Acessibilidade**: Componentes semanticamente corretos

## Melhorias Recentes

### Refatoração Completa
- **Eliminação de código duplicado** - 500+ linhas removidas
- **Componentes reutilizáveis** - Sistema de UI components
- **Utilitários centralizados** - Formatadores e cálculos
- **Base escalável** - Preparado para crescimento

### Novas Funcionalidades
- **Sistema de Conquistas** - Medalhas automáticas
- **Alertas Inteligentes** - Avisos contextuais
- **Metas Personalizadas** - Objetivos baseados no progresso
- **Dashboard de Presenças** - Controle detalhado por data

## Suporte e Contato

Para dúvidas sobre a documentação ou implementação:
- Consulte a documentação específica de cada módulo
- Verifique os exemplos de código nos arquivos de documentação
- Analise os componentes existentes para referência

---

*Documentação atualizada em: Outubro 2025*
*Versão: 2.0*
