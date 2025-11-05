# Página de Presenças do Aluno

Esta documentação descreve a nova funcionalidade de visualização de presenças para alunos no sistema escolar.

## Funcionalidades

### 1. Seletor de Data
- **Seleção manual**: Input de data para escolher qualquer dia
- **Navegação**: Botões para navegar entre dias (anterior/próximo)
- **Botão "Hoje"**: Acesso rápido para a data atual
- **Formatação**: Exibe a data selecionada em formato brasileiro

### 2. Estatísticas do Dia
Quando há dados de presença para o dia selecionado, são exibidos cards com:
- **Total de Aulas**: Número total de aulas no dia
- **Presenças**: Quantidade de aulas em que o aluno esteve presente
- **Faltas**: Quantidade de faltas no dia
- **Estava na Escola**: Quantidade de registros onde o aluno estava presente na escola

### 3. Lista Detalhada de Presenças
Para cada registro de presença, são exibidas as seguintes informações:
- **Status visual**: Ícones coloridos indicando o status
- **Nome do Professor**: Obtido via API `/teacher/{id}`
- **Disciplina**: Se disponível nos dados do professor
- **Data e Hora**: Formatada em português brasileiro
- **Email do Professor**: Se disponível
- **Status da Presença**: Badge colorido com descrição detalhada

### 4. Tipos de Status
- 🟢 **Presente**: Aluno presente na aula
- 🟡 **Na escola, mas ausente da aula**: Aluno estava na escola mas faltou à aula específica
- 🔴 **Ausente da escola**: Aluno não estava na escola

### 5. Legenda Informativa
Explicação detalhada dos diferentes status de presença para orientar o aluno.

## APIs Utilizadas

### Endpoint Principal
```
GET /attendance/student/{id}
```
Retorna todas as presenças do aluno.

### Endpoint Secundário
```
GET /teacher/{id}
```
Busca informações detalhadas do professor (nome, email, disciplina).

## Estrutura de Dados

### Objeto de Presença
```javascript
{
  date: "2024-01-15T08:00:00Z",
  teacherId: 123,
  isInSchool: true,
  present: true
}
```

### Objeto de Professor
```javascript
{
  id: 123,
  name: "Nome do Professor",
  email: "professor@escola.com",
  subject: {
    name: "Matemática"
  }
}
```

## Componentes e Serviços

### AttendanceService
Localizado em: `src/services/attendanceService.js`

**Métodos principais:**
- `getStudentAttendance(studentId)`: Busca todas as presenças
- `getStudentAttendanceByDate(studentId, date)`: Filtra por data
- `getTeacherById(teacherId)`: Busca dados do professor
- `getMultipleTeachers(teacherIds)`: Busca múltiplos professores
- `formatDate(dateString)`: Formata data para exibição
- `getCurrentDate()`: Retorna data atual

### StudentAttendance Component
Localizado em: `src/pages/StudentAttendance.jsx`

**Estados principais:**
- `selectedDate`: Data selecionada
- `attendanceData`: Lista de presenças do dia
- `teachers`: Mapa de professores indexados por ID
- `studentData`: Dados do aluno logado
- `loading`: Estado de carregamento inicial
- `loadingAttendance`: Estado de carregamento das presenças

## Navegação

A página é acessível através do menu lateral para usuários com role `ROLE_STUDENT`:
- **Menu**: "Minhas Presenças"
- **Rota**: `/student-attendance`
- **Ícone**: Calendar (Lucide React)

## Estilização

Utiliza o mesmo padrão visual das outras páginas:
- **Cards**: Classe `.card` do Tailwind CSS
- **Cores**: Sistema de cores do tema (primary, green, red, yellow)
- **Responsividade**: Grid responsivo para diferentes tamanhos de tela
- **Loading States**: Spinners animados durante carregamentos

## Estados da Interface

### Estado Inicial
- Carregamento dos dados do aluno
- Data inicial definida como hoje

### Estado de Carregamento
- Spinner durante busca de dados
- Indicador de carregamento no header da lista

### Estado Vazio
- Mensagem informativa quando não há aulas no dia
- Ícone de calendário para representar ausência de dados

### Estado com Dados
- Cards de estatísticas
- Lista completa de presenças
- Legenda explicativa

## Tratamento de Erros

- **Toast notifications** para erros de API
- **Fallbacks** para dados ausentes (ex: nome do professor)
- **Logs** detalhados no console para debugging
- **Estados seguros** que previnem crashes da aplicação

## Acessibilidade

- **Títulos descritivos** em botões
- **Textos alternativos** adequados
- **Contraste de cores** seguindo diretrizes
- **Navegação por teclado** funcional
- **Semântica HTML** apropriada

## Possíveis Melhorias Futuras

1. **Filtros avançados**: Por professor, disciplina, status
2. **Exportação**: PDF ou Excel dos dados de presença
3. **Calendário visual**: Visualização em formato de calendário
4. **Notificações**: Alertas sobre faltas excessivas
5. **Gráficos**: Visualização estatística da frequência
6. **Histórico**: Comparação entre períodos diferentes