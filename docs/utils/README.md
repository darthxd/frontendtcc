# Documentação dos Utilitários

Esta documentação detalha todas as funções utilitárias e helpers do sistema, organizadas por categoria e funcionalidade.

## Índice

- [Formatadores](#formatadores)
- [Dashboard Utils](#dashboard-utils)
- [Autenticação](#autenticação)
- [Validadores](#validadores)
- [Helpers Gerais](#helpers-gerais)

---

## Formatadores

**Arquivo**: `src/utils/formatters.js`

### Formatação de Datas

#### `formatDate(dateString, options = {})`
Formata uma data para exibição em português brasileiro.

**Parâmetros**:
- `dateString` (string|Date): Data a ser formatada
- `options` (object): Opções de formatação (opcional)

**Retorno**: String formatada ou mensagem de erro

**Exemplo**:
```javascript
import { formatDate } from '../utils/formatters';

formatDate('2024-12-15');           // "15/12/2024"
formatDate('2024-12-15', {          // "15 de dezembro de 2024"
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});
```

#### `formatDateTime(dateString, options = {})`
Formata data e hora para exibição.

**Exemplo**:
```javascript
formatDateTime('2024-12-15T14:30:00'); // "15/12/2024 14:30"
```

#### `formatLongDate(dateString)`
Formata data longa com dia da semana.

**Exemplo**:
```javascript
formatLongDate('2024-12-15'); // "domingo, 15 de dezembro de 2024"
```

#### `formatShortDate(dateString)`
Formata data curta com dia da semana abreviado.

**Exemplo**:
```javascript
formatShortDate('2024-12-15'); // "dom, 15/12"
```

#### `formatMonthYear(dateString)`
Formata apenas mês e ano.

**Exemplo**:
```javascript
formatMonthYear('2024-12-15'); // "dezembro de 2024"
```

#### `getCurrentDate()`
Obtém a data atual no formato YYYY-MM-DD.

**Exemplo**:
```javascript
getCurrentDate(); // "2024-12-15"
```

#### `formatDateForInput(dateString)`
Formata data para input HTML (YYYY-MM-DD).

**Exemplo**:
```javascript
formatDateForInput('15/12/2024'); // "2024-12-15"
```

### Formatação de Documentos

#### `formatCPF(cpf)`
Formata CPF para exibição com máscara.

**Exemplo**:
```javascript
formatCPF('12345678901');     // "123.456.789-01"
formatCPF('');                // "Não informado"
formatCPF('123');             // "123" (retorna original se inválido)
```

#### `formatPhone(phone)`
Formata telefone para exibição.

**Exemplo**:
```javascript
formatPhone('11999887766');   // "(11) 99988-7766"
formatPhone('1133445566');    // "(11) 3344-5566"
formatPhone('');              // "Não informado"
```

### Formatação de Números

#### `formatPercentage(value, decimals = 1)`
Formata número como percentual.

**Exemplo**:
```javascript
formatPercentage(85.67);      // "85.7%"
formatPercentage(85.67, 2);   // "85.67%"
formatPercentage(NaN);        // "0%"
```

#### `formatGrade(grade)`
Formata nota com uma casa decimal.

**Exemplo**:
```javascript
formatGrade(8.5);             // "8.5"
formatGrade(null);            // "N/A"
formatGrade(undefined);       // "N/A"
```

### Formatação de Texto

#### `capitalize(str)`
Capitaliza primeira letra.

**Exemplo**:
```javascript
capitalize('joão silva');     // "João silva"
capitalize('');               // ""
```

#### `truncateText(text, maxLength = 50)`
Trunca texto com reticências.

**Exemplo**:
```javascript
truncateText('Este é um texto muito longo', 15); // "Este é um texto..."
```

### Validadores

#### `isValidDate(dateString)`
Valida se uma data é válida.

**Exemplo**:
```javascript
isValidDate('2024-12-15');    // true
isValidDate('data inválida'); // false
```

#### `isToday(dateString)`
Verifica se uma data é hoje.

**Exemplo**:
```javascript
isToday(new Date().toISOString()); // true
isToday('2024-01-01');             // false
```

#### `isPastDate(dateString)`
Verifica se uma data é no passado.

**Exemplo**:
```javascript
isPastDate('2023-01-01');     // true
isPastDate('2025-01-01');     // false
```

### Utilitários de Status

#### `getStatusConfig(status)`
Obtém configuração de status com cor e texto.

**Status Disponíveis**:
- `PENDING` - Pendente
- `SUBMITTED` - Enviado
- `GRADED` - Avaliado
- `OVERDUE` - Atrasado
- `PRESENT` - Presente
- `ABSENT` - Ausente
- `PARTIAL` - Parcialmente presente

**Exemplo**:
```javascript
getStatusConfig('PENDING');
// {
//   color: 'bg-yellow-100 text-yellow-800',
//   text: 'Pendente',
//   icon: 'Clock'
// }
```

### Utilitários de Performance

#### `getPerformanceLevel(average)`
Obtém nível de performance baseado na média.

**Exemplo**:
```javascript
getPerformanceLevel(9.2);
// { level: 'Excelente', color: 'text-green-600' }

getPerformanceLevel(6.5);
// { level: 'Regular', color: 'text-yellow-600' }
```

#### `getAttendanceLevel(rate)`
Obtém nível de frequência baseado na taxa.

**Exemplo**:
```javascript
getAttendanceLevel(95);
// { level: 'Excelente', color: 'text-green-600' }

getAttendanceLevel(65);
// { level: 'Crítica', color: 'text-red-600' }
```

### Utilitários de Array

#### `removeDuplicates(array, key)`
Remove duplicatas de um array baseado em uma propriedade.

**Exemplo**:
```javascript
const users = [
  { id: 1, name: 'João' },
  { id: 2, name: 'Maria' },
  { id: 1, name: 'João' }
];

removeDuplicates(users, 'id');
// [{ id: 1, name: 'João' }, { id: 2, name: 'Maria' }]
```

#### `groupBy(array, key)`
Agrupa array por propriedade.

**Exemplo**:
```javascript
const students = [
  { name: 'João', class: 'A' },
  { name: 'Maria', class: 'B' },
  { name: 'Pedro', class: 'A' }
];

groupBy(students, 'class');
// {
//   A: [{ name: 'João', class: 'A' }, { name: 'Pedro', class: 'A' }],
//   B: [{ name: 'Maria', class: 'B' }]
// }
```

### Utilitários de Ordenação

#### `sortByDate(array, dateKey, order = 'desc')`
Ordena array por data.

**Exemplo**:
```javascript
const activities = [
  { title: 'Atividade 1', date: '2024-12-10' },
  { title: 'Atividade 2', date: '2024-12-15' }
];

sortByDate(activities, 'date', 'asc');
// Ordenado por data crescente
```

### Utilitários de Busca

#### `filterBySearch(array, searchTerm, searchKeys = [])`
Filtra array por termo de busca.

**Exemplo**:
```javascript
const users = [
  { name: 'João Silva', email: 'joao@email.com' },
  { name: 'Maria Santos', email: 'maria@email.com' }
];

filterBySearch(users, 'joão', ['name']);
// [{ name: 'João Silva', email: 'joao@email.com' }]
```

---

## Dashboard Utils

**Arquivo**: `src/utils/dashboardUtils.js`

### Cálculos de Atividades

#### `calculateActivityStats(activities = [], submissions = [])`
Calcula estatísticas de atividades do aluno.

**Retorno**:
```javascript
{
  total: number,           // Total de atividades
  submitted: number,       // Atividades enviadas
  graded: number,         // Atividades avaliadas
  pending: number,        // Atividades pendentes
  averageGrade: number,   // Média das notas
  completionRate: number, // Taxa de conclusão (%)
  performanceLevel: {     // Nível de desempenho
    level: string,
    color: string
  }
}
```

**Exemplo**:
```javascript
const stats = calculateActivityStats(activities, submissions);
console.log(stats.averageGrade);     // 7.5
console.log(stats.completionRate);   // 85.2
```

#### `calculateAttendanceStats(attendance = [])`
Calcula estatísticas de frequência.

**Retorno**:
```javascript
{
  totalClasses: number,      // Total de aulas
  attendedClasses: number,   // Aulas com presença
  inSchoolClasses: number,   // Aulas que estava na escola
  attendanceRate: number,    // Taxa de frequência (%)
  attendanceLevel: {         // Nível de frequência
    level: string,
    color: string
  }
}
```

#### `calculateDailyAttendanceStats(dailyAttendance = [])`
Calcula estatísticas para um dia específico.

**Retorno**:
```javascript
{
  total: number,    // Total de aulas do dia
  present: number,  // Presenças confirmadas
  absent: number,   // Faltas
  inSchool: number  // Estava na escola
}
```

### Cálculos de Professor

#### `calculateTeacherStats(classes = [], activities = [], submissions = [])`
Calcula estatísticas do professor.

**Retorno**:
```javascript
{
  totalClasses: number,      // Total de turmas
  totalStudents: number,     // Total de alunos
  totalActivities: number,   // Total de atividades criadas
  pendingGrading: number,    // Avaliações pendentes
  gradedSubmissions: number, // Submissões avaliadas
  averageGrade: number,      // Média geral das turmas
  gradingProgress: number    // Progresso de avaliação (%)
}
```

### Sistema de Alertas

#### `getStudentAlerts(activityStats, attendanceStats)`
Gera alertas inteligentes para alunos.

**Tipos de Alerta**:
- **Frequência Baixa**: < 75%
- **Desempenho Crítico**: Média < 5.0
- **Muitas Atividades Pendentes**: > 3 atividades
- **Taxa de Entrega Baixa**: < 50%

**Retorno**:
```javascript
[
  {
    type: 'warning',
    title: 'Frequência Baixa',
    message: 'Sua frequência está em 65.0%. É importante manter pelo menos 75%.',
    priority: 'high'
  }
]
```

### Sistema de Conquistas

#### `getStudentAchievements(activityStats, attendanceStats)`
Gera conquistas baseadas no desempenho.

**Conquistas Disponíveis**:
- **Excelência Acadêmica**: Média ≥ 9.0
- **Frequência Exemplar**: ≥ 95% de presença
- **100% das Atividades**: Todas as atividades enviadas
- **Aluno Consistente**: Média ≥ 7.0 e frequência ≥ 80%

**Retorno**:
```javascript
[
  {
    id: 'academic_excellence',
    title: 'Excelência Acadêmica',
    description: 'Média acima de 9.0',
    icon: 'Award',
    color: 'text-yellow-600 bg-yellow-50'
  }
]
```

### Sistema de Metas

#### `getStudentGoals(activityStats, attendanceStats)`
Gera metas personalizadas baseadas no desempenho.

**Tipos de Meta**:
- **Completar Atividades**: Quando há atividades pendentes
- **Melhorar Frequência**: Quando frequência < 90%
- **Elevar Média**: Quando média < 8.0
- **Manter Desempenho**: Quando já tem bom desempenho

**Retorno**:
```javascript
[
  {
    id: 'complete_activities',
    title: 'Completar 3 atividades pendentes',
    type: 'urgent',
    color: 'border-yellow-200 bg-yellow-50'
  }
]
```

### Comparação de Performance

#### `comparePerformance(currentStats, previousStats)`
Compara desempenho entre períodos.

**Retorno**:
```javascript
{
  grade: {
    current: 7.5,
    previous: 6.8,
    change: 0.7,
    trend: 'up'        // 'up' | 'down' | 'stable'
  },
  attendance: {
    current: 85.2,
    previous: 82.1,
    change: 3.1,
    trend: 'up'
  }
}
```

### Filtros e Ordenações

#### `filterActivitiesByStatus(activities, submissions, status)`
Filtra atividades por status.

**Status Disponíveis**:
- `pending` - Pendentes (não enviadas, dentro do prazo)
- `overdue` - Atrasadas (não enviadas, fora do prazo)
- `submitted` - Enviadas (aguardando avaliação)
- `graded` - Avaliadas (com nota)

#### `sortActivitiesByPriority(activities, submissions)`
Ordena atividades por prioridade:
1. Atrasadas sem submissão
2. Pendentes (por prazo)
3. Por data de criação

---

## Autenticação

**Arquivo**: `src/utils/jwt.js`

### Utilitários JWT

#### `decodeJWT(token)`
Decodifica token JWT e retorna o payload.

**Exemplo**:
```javascript
const tokenInfo = decodeJWT(token);
console.log(tokenInfo.sub);    // username
console.log(tokenInfo.role);   // ROLE_ADMIN
console.log(tokenInfo.exp);    // timestamp de expiração
```

#### `isTokenExpired(token)`
Verifica se o token JWT está expirado.

**Exemplo**:
```javascript
if (isTokenExpired(token)) {
  // Redirecionar para login
  logout();
}
```

#### `getTokenExpirationTime(token)`
Obtém tempo de expiração do token em milissegundos.

#### `getTimeUntilExpiration(token)`
Obtém tempo restante até expiração em milissegundos.

---

## Validadores

### Validação de Dados

#### `validateEmail(email)`
Valida formato de email.

**Exemplo**:
```javascript
validateEmail('user@example.com');  // true
validateEmail('email-inválido');    // false
```

#### `validateCPF(cpf)`
Valida CPF brasileiro (algoritmo oficial).

**Exemplo**:
```javascript
validateCPF('12345678901');  // true/false
validateCPF('000.000.000-00'); // false (CPF inválido)
```

#### `validatePhone(phone)`
Valida telefone brasileiro.

**Exemplo**:
```javascript
validatePhone('11999887766');   // true
validatePhone('11 99988-7766'); // true
validatePhone('123');           // false
```

#### `validatePassword(password)`
Valida senha (mínimo 6 caracteres).

**Exemplo**:
```javascript
validatePassword('123456');     // { valid: true, errors: [] }
validatePassword('123');        // { valid: false, errors: ['Muito curta'] }
```

---

## Helpers Gerais

### Utilitários de URL

#### `buildUrl(base, params)`
Constrói URL com parâmetros.

**Exemplo**:
```javascript
buildUrl('/api/users', { page: 1, limit: 10 });
// "/api/users?page=1&limit=10"
```

#### `getQueryParams()`
Obtém parâmetros da URL atual.

**Exemplo**:
```javascript
// URL: /page?name=João&age=25
getQueryParams(); // { name: 'João', age: '25' }
```

### Utilitários de Storage

#### `setStorageItem(key, value)`
Salva item no localStorage com tratamento de erro.

#### `getStorageItem(key, defaultValue)`
Obtém item do localStorage com valor padrão.

#### `removeStorageItem(key)`
Remove item do localStorage.

**Exemplo**:
```javascript
setStorageItem('userData', { name: 'João' });
const user = getStorageItem('userData', {});
removeStorageItem('userData');
```

### Utilitários de Performance

#### `debounce(func, delay)`
Implementa debounce para funções.

**Exemplo**:
```javascript
const debouncedSearch = debounce((query) => {
  searchAPI(query);
}, 300);
```

#### `throttle(func, interval)`
Implementa throttle para funções.

### Utilitários de Objeto

#### `deepClone(obj)`
Clona objeto profundamente.

#### `isEmpty(value)`
Verifica se valor está vazio.

#### `pick(object, keys)`
Extrai propriedades específicas do objeto.

**Exemplo**:
```javascript
const user = { id: 1, name: 'João', email: 'joao@email.com', password: '123' };
const publicUser = pick(user, ['id', 'name', 'email']);
// { id: 1, name: 'João', email: 'joao@email.com' }
```

---

## Exemplos de Uso Combinado

### Dashboard Completo
```javascript
import {
  calculateActivityStats,
  calculateAttendanceStats,
  getStudentAlerts,
  getStudentAchievements,
  getStudentGoals
} from '../utils/dashboardUtils';

import { formatPercentage, formatGrade } from '../utils/formatters';

const StudentDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const stats = calculateActivityStats(activities, submissions);
  const attendanceStats = calculateAttendanceStats(attendance);
  const alerts = getStudentAlerts(stats, attendanceStats);
  const achievements = getStudentAchievements(stats, attendanceStats);
  const goals = getStudentGoals(stats, attendanceStats);

  return (
    <div>
      <h1>Dashboard do Aluno</h1>

      <div className="stats">
        <div>Média: {formatGrade(stats.averageGrade)}</div>
        <div>Frequência: {formatPercentage(attendanceStats.attendanceRate)}</div>
      </div>

      <div className="alerts">
        {alerts.map(alert => (
          <div key={alert.type} className={`alert-${alert.type}`}>
            {alert.message}
          </div>
        ))}
      </div>

      <div className="achievements">
        {achievements.map(achievement => (
          <div key={achievement.id}>{achievement.title}</div>
        ))}
      </div>
    </div>
  );
};
```

### Formulário com Validação
```javascript
import { validateEmail, validateCPF, formatCPF } from '../utils/formatters';

const UserForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form>
      <input
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        value={formatCPF(formData.cpf)}
        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
      />
      {errors.cpf && <span className="error">{errors.cpf}</span>}
    </form>
  );
};
```

---

## Referências

### Padrões de Código
- Todas as funções incluem tratamento de erro
- Valores padrão para parâmetros opcionais
- Documentação JSDoc para TypeScript
- Testes unitários recomendados

### Performance
- Funções puras quando possível
- Evitar mutação de parâmetros
- Memoização para cálculos complexos
- Lazy loading quando apropriado

### Manutenibilidade
- Nomes descritivos
- Funções pequenas e focadas
- Separação de responsabilidades
- Reutilização máxima

---

*Documentação dos utilitários atualizada em: Outubro 2025*
