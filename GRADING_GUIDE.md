# Guia de Correção de Atividades - Professor

## 📋 Visão Geral

O sistema de correção permite que professores visualizem todas as submissões dos alunos para suas atividades e atribuam notas de forma intuitiva e organizada.

## 🚀 Como Acessar a Correção

### 1. Navegue para Atividades
- Faça login como professor
- Clique em "Atividades" no menu lateral
- Selecione uma turma no dropdown

### 2. Identifique Atividades com Submissões
- Atividades com submissões mostram estatísticas: "X submissões, Y corrigidas"
- Botão verde "Corrigir" com badge vermelho indica submissões pendentes
- Barra de progresso visual mostra percentual de correções

### 3. Abrir Interface de Correção
- Clique no ícone verde de "Corrigir" (CheckCircle)
- Interface modal abre em tela cheia dividida em duas colunas

## 📊 Interface de Correção

### Coluna Esquerda: Lista de Submissões
- **Lista completa** de alunos que enviaram a atividade
- **Informações exibidas**:
  - Nome completo do aluno
  - Email do aluno
  - Data/hora de envio
  - Status: "Pendente" (amarelo) ou "Avaliado" (verde)
  - Nota atual (se já corrigida)
- **Navegação**: Clique em qualquer submissão para ver detalhes

### Coluna Direita: Detalhes da Submissão
- **Informações do Aluno**:
  - Nome, email, data de envio
- **Resposta do Aluno**:
  - Texto completo da resposta
  - Link para arquivo anexo (se houver)
- **Seção de Avaliação**:
  - Campo para inserir nota (0 até nota máxima da atividade)
  - Botão para atribuir/atualizar nota
  - Visualização da nota atual e percentual

## 🎯 Processo de Correção

### Passo a Passo:

1. **Selecionar Submissão**
   - Clique na submissão desejada na lista à esquerda
   - Aguarde carregar os detalhes

2. **Analisar Resposta**
   - Leia a resposta do aluno
   - Acesse arquivo anexo se necessário (clique em "Visualizar arquivo")

3. **Atribuir Nota**
   - Digite a nota no campo (aceita decimais, ex: 8.5)
   - Nota deve estar entre 0 e a nota máxima da atividade
   - Clique em "Atribuir Nota" ou "Atualizar Nota"

4. **Confirmar e Continuar**
   - Sistema confirma sucesso com toast notification
   - Submissão atualizada automaticamente na lista
   - Continue para próxima submissão

## 💡 Funcionalidades Avançadas

### Indicadores Visuais
- **Badge de Progresso**: Barra verde mostra % de correções concluídas
- **Cores de Status**:
  - 🟡 Amarelo: Aguardando correção
  - 🟢 Verde: Já corrigido
- **Cores de Notas**:
  - 🟢 Verde: ≥ 70% da nota máxima
  - 🟡 Amarelo: 50-69% da nota máxima
  - 🔴 Vermelho: < 50% da nota máxima

### Estatísticas em Tempo Real
- **Na página principal**: Cards mostram totais gerais
- **Por atividade**: Contador de submissões vs corrigidas
- **Atualizações automáticas** após cada correção

### Notificações Badge
- **Número vermelho** no botão de correção indica quantas submissões pendentes
- **Atualiza automaticamente** conforme você corrige

## ⚙️ Validações e Regras

### Validação de Notas
- **Mínimo**: 0
- **Máximo**: Nota máxima definida na atividade
- **Formato**: Aceita decimais (ex: 7.5, 8.25)
- **Obrigatório**: Campo não pode ficar vazio

### Regras de Negócio
- Professor só vê submissões das suas turmas
- Notas podem ser atualizadas quantas vezes necessário
- Sistema mantém histórico da última atualização
- Prazo expirado não impede correção

## 🔍 Estados da Interface

### Estados de Carregamento
- **Lista de submissões**: Spinner durante carregamento inicial
- **Detalhes**: Spinner ao trocar de submissão
- **Atribuição de nota**: Botão desabilitado durante envio

### Estados de Erro
- **Erro ao carregar**: Toast de erro + logs no console
- **Erro ao salvar**: Mensagem específica do servidor
- **Conexão perdida**: Redirecionamento automático para login

### Estados Vazios
- **Sem submissões**: Mensagem explicativa com ícone
- **Seleção vazia**: Instruções para selecionar submissão

## 📱 Responsividade

### Desktop (Recomendado)
- Interface em duas colunas lado a lado
- Visualização completa e confortável
- Navegação rápida entre submissões

### Tablet
- Colunas adaptam proporção automaticamente
- Interface permanece funcional

### Mobile
- **Não recomendado** para correção extensiva
- Interface funciona mas com limitações de espaço

## ⚡ Dicas de Uso Eficiente

### Fluxo Recomendado
1. **Planejamento**: Corrija por turma/atividade
2. **Batch Processing**: Corrija todas de uma vez
3. **Consistência**: Use critérios uniformes de avaliação
4. **Feedback**: Use notas como forma de comunicação

### Atalhos de Produtividade
- **Tab**: Navegar entre campos
- **Enter**: Confirmar nota (quando campo ativo)
- **Clique rápido**: Alternar entre submissões
- **Scroll**: Navegar na lista de submissões

### Boas Práticas
- **Critérios claros**: Defina rubrica antes de começar
- **Notas consistentes**: Mantenha padrão entre alunos
- **Feedback construtivo**: Use comentários quando possível (futuro)
- **Backup**: Sistema salva automaticamente

## 🔧 Resolução de Problemas

### Problemas Comuns

#### "Erro ao carregar submissões"
- **Causa**: Problema de conexão ou permissões
- **Solução**: Recarregar página, verificar login

#### "Nota não foi salva"
- **Causa**: Valor inválido ou problema de rede
- **Solução**: Verificar formato da nota, tentar novamente

#### "Lista vazia"
- **Causa**: Nenhum aluno enviou a atividade ainda
- **Solução**: Aguardar submissões ou verificar prazo

#### Interface não carrega
- **Causa**: JavaScript/CSS não carregou
- **Solução**: Limpar cache, recarregar página

### Logs e Debug
- **Console do navegador**: F12 → Console
- **Erros de rede**: Aba Network
- **Estado da aplicação**: Redux DevTools (se disponível)

## 📊 Exemplos Práticos

### Cenário 1: Primeira Correção
```
1. Atividade: "Exercício de Matemática" 
2. Submissões: 25 alunos enviaram
3. Status: 0 corrigidas, 25 pendentes
4. Badge vermelho: "25" no botão de correção
5. Ação: Clique em "Corrigir" → Interface abre
```

### Cenário 2: Correção Parcial
```
1. Progresso atual: 15/25 corrigidas
2. Barra de progresso: 60% preenchida (verde)
3. Badge: "10" submissões pendentes
4. Lista: Verde (corrigidas) + Amarelo (pendentes)
```

### Cenário 3: Atualização de Nota
```
1. Aluno já tem nota: 7.5
2. Nova análise: Merece 8.0
3. Campo pré-preenchido: "7.5"
4. Alterar para: "8.0"
5. Botão: "Atualizar Nota"
```

## 📈 Métricas e Analytics

### Dados Disponíveis
- **Por Professor**: Total de atividades, submissões, correções
- **Por Turma**: Desempenho médio, taxa de envio
- **Por Atividade**: Estatísticas detalhadas de cada tarefa
- **Temporal**: Evolução das correções ao longo do tempo

### Relatórios (Futuro)
- Exportar notas para planilha
- Gráficos de desempenho da turma
- Comparativo entre atividades
- Tempo médio de correção

## 🔒 Segurança e Privacidade

### Controles de Acesso
- **Professor**: Só vê submissões das próprias turmas
- **Autenticação**: JWT token obrigatório
- **Autorização**: Verificação de permissões no backend
- **Auditoria**: Logs de todas as ações

### Proteção de Dados
- **HTTPS**: Todas as comunicações criptografadas
- **Sanitização**: Inputs tratados contra XSS
- **Validação**: Backend valida todas as notas
- **Backup**: Dados replicados automaticamente

## 📞 Suporte

### Contatos
- **Suporte Técnico**: suporte@sistema.com
- **Dúvidas Pedagógicas**: pedagogico@sistema.com
- **Emergências**: (11) 9999-9999

### Recursos Adicionais
- **Manual Completo**: /docs/manual-professor.pdf
- **Vídeos Tutoriais**: /videos/correcao-atividades
- **FAQ**: /ajuda/perguntas-frequentes
- **Chat Online**: Disponível 8h-18h