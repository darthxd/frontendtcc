# Exemplo de Refatoração - Antes e Depois

Este documento mostra exemplos práticos de como o código foi refatorado para eliminar repetições e torná-lo mais limpo e reutilizável.

## 1. Formatação de Datas

### ❌ ANTES (Repetido em múltiplos arquivos)
```javascript
// Em ActivityGrading.jsx
const formatDate = (dateString) => {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR");
};

// Em AttendanceHistory.jsx
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Em StudentActivities.jsx
const formatDate = (dateString) => {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR");
};

// Em TeacherStats.jsx
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
};
```

### ✅ DEPOIS (Centralizado em utils/formatters.js)

```javascript
// utils/formatters.js
export const formatDate = (dateString, options = {}) => {
  try {
    if (!dateString) return 'Data não informada';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';

    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    };

    return date.toLocaleDateString('pt-BR', { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

export const formatLongDate = (dateString) => {
  return formatDate(dateString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (dateString) => {
  return formatDate(dateString, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  });
};

// Uso nos componentes
import { formatDate, formatLongDate, formatShortDate } from '../utils/formatters';

// Agora é só usar:
const formattedDate = formatDate(dateString);
const longDate = formatLongDate(dateString);
const shortDate = formatShortDate(dateString);
```

## 2. Formatação de CPF e Telefone

### ❌ ANTES (Repetido em 6 arquivos diferentes)

```javascript
// Em StudentDashboard.jsx
{studentData?.cpf
  ? studentData.cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4",
    )
  : "Não informado"}

// Em Students.jsx
{student.cpf
  ? student.cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4",
    )
  : "-"}

// Repetido em Teachers.jsx, TeacherDashboard.jsx...
```

### ✅ DEPOIS (Centralizado)

```javascript
// utils/formatters.js
export const formatCPF = (cpf) => {
  if (!cpf) return 'Não informado';

  try {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return cpf;
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } catch (error) {
    console.error('Erro ao formatar CPF:', error);
    return cpf;
  }
};

export const formatPhone = (phone) => {
  if (!phone) return 'Não informado';

  try {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  } catch (error) {
    console.error('Erro ao formatar telefone:', error);
    return phone;
  }
};

// Uso nos componentes
import { formatCPF, formatPhone } from '../utils/formatters';

// Agora é só usar:
<span>{formatCPF(student.cpf)}</span>
<span>{formatPhone(student.phone)}</span>
```

## 3. Componentes de Loading

### ❌ ANTES (Repetido em 15+ arquivos)

```javascript
// Em cada arquivo...
{loading && (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
)}

// Ou...
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>

// Ou...
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
```

### ✅ DEPOIS (Componentes reutilizáveis)

```javascript
// components/ui/index.jsx
export const Spinner = ({ size = 'md', color = 'border-primary-600', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 ${color} ${sizeClasses[size]} ${className}`} />
  );
};

export const Loading = ({ text = 'Carregando...', size = 'md', className = '' }) => {
  return (
    <div className={`flex flex-col justify-center items-center py-8 ${className}`}>
      <Spinner size={size} />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export const InlineLoading = ({ text, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Spinner size="sm" />
      {text && <span className="ml-2 text-sm text-gray-500">{text}</span>}
    </div>
  );
};

// Uso nos componentes
import { Loading, InlineLoading, Spinner } from '../components/ui';

// Agora é só usar:
{loading && <Loading text="Carregando dados..." />}
{loadingSubmit && <InlineLoading text="Salvando..." />}
<Spinner size="lg" />
```

## 4. Cálculos de Estatísticas

### ❌ ANTES (Repetido e complexo)

```javascript
// Em StudentDashboard.jsx
const calculateStats = () => {
  const total = activities.length;
  const submitted = submissions.length;
  const graded = submissions.filter((s) => s.grade !== null).length;
  const pending = total - submitted;
  const averageGrade =
    graded > 0
      ? submissions
          .filter((s) => s.grade !== null)
          .reduce((acc, s) => acc + s.grade, 0) / graded
      : 0;

  return { total, submitted, graded, pending, averageGrade };
};

const calculateAttendanceStats = () => {
  if (attendance.length === 0) {
    return { totalClasses: 0, attendedClasses: 0, attendanceRate: 0 };
  }
  const totalClasses = attendance.length;
  const attendedClasses = attendance.filter((record) => record.present).length;
  const attendanceRate = (attendedClasses / totalClasses) * 100;

  return { totalClasses, attendedClasses, attendanceRate };
};

// Similar em outros dashboards...
```

### ✅ DEPOIS (Funções utilitárias reutilizáveis)

```javascript
// utils/dashboardUtils.js
export const calculateActivityStats = (activities = [], submissions = []) => {
  const total = activities.length;
  const submitted = submissions.length;
  const graded = submissions.filter((s) => s.grade !== null).length;
  const pending = total - submitted;
  const averageGrade =
    graded > 0
      ? submissions
          .filter((s) => s.grade !== null)
          .reduce((acc, s) => acc + s.grade, 0) / graded
      : 0;

  const completionRate = total > 0 ? (submitted / total) * 100 : 0;

  return {
    total,
    submitted,
    graded,
    pending,
    averageGrade,
    completionRate,
    performanceLevel: getPerformanceLevel(averageGrade)
  };
};

export const calculateAttendanceStats = (attendance = []) => {
  if (attendance.length === 0) {
    return {
      totalClasses: 0,
      attendedClasses: 0,
      attendanceRate: 0,
      attendanceLevel: getAttendanceLevel(0)
    };
  }

  const totalClasses = attendance.length;
  const attendedClasses = attendance.filter((record) => record.present).length;
  const attendanceRate = (attendedClasses / totalClasses) * 100;

  return {
    totalClasses,
    attendedClasses,
    attendanceRate,
    attendanceLevel: getAttendanceLevel(attendanceRate)
  };
};

// Uso nos componentes
import { calculateActivityStats, calculateAttendanceStats } from '../utils/dashboardUtils';

const stats = calculateActivityStats(activities, submissions);
const attendanceStats = calculateAttendanceStats(attendance);
```

## 5. Cards de Estatística

### ❌ ANTES (Componente definido em cada arquivo)

```javascript
// Em StudentDashboard.jsx
const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
  <div className={`card ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`} onClick={onClick}>
    <div className="flex items-center">
      <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  </div>
);

// Repetido em outras páginas...
```

### ✅ DEPOIS (Componente reutilizável)

```javascript
// components/ui/index.jsx
export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'bg-blue-500',
  subtitle,
  onClick,
  className = ''
}) => (
  <Card onClick={onClick} className={className}>
    <div className="flex items-center">
      <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  </Card>
);

// Uso em qualquer componente
import { StatCard } from '../components/ui';

<StatCard
  title="Total de Atividades"
  value={stats.total}
  icon={BookOpen}
  color="bg-blue-500"
/>
```

## 6. Gerenciamento de Estados Vazios

### ❌ ANTES (HTML repetido)

```javascript
// Em múltiplos arquivos...
{data.length === 0 ? (
  <div className="text-center py-8">
    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      Nenhum item encontrado
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Não há dados para exibir.
    </p>
  </div>
) : (
  // renderizar dados
)}
```

### ✅ DEPOIS (Componente reutilizável)

```javascript
// components/ui/index.jsx
export const EmptyState = ({
  icon: Icon,
  title,
  message,
  action,
  className = ''
}) => (
  <div className={`text-center py-8 ${className}`}>
    {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400" />}
    <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// Uso simplificado
import { EmptyState } from '../components/ui';

{data.length === 0 ? (
  <EmptyState
    icon={Calendar}
    title="Nenhuma aula encontrada"
    message="Não há registros de aulas para a data selecionada."
  />
) : (
  // renderizar dados
)}
```

## 7. Serviços Refatorados

### ❌ ANTES (Lógica repetida)

```javascript
// Em AttendanceService.js
formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

formatDateTime(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return 'Data inválida';
  }
}
```

### ✅ DEPOIS (Reutilização de utilitários)

```javascript
// services/attendanceService.js
import api from './api';
import { formatDate, formatDateTime, getCurrentDate } from '../utils/formatters';

export const attendanceService = {
  async getStudentAttendance(studentId) {
    // lógica da API...
  },

  // Reutiliza formatadores do utils
  formatDate,
  formatDateTime,
  getCurrentDate,
};
```

## Resultados da Refatoração

### 📊 Estatísticas de Melhoria

- **Linhas de código eliminadas**: ~500+ linhas duplicadas
- **Arquivos impactados**: 15+ arquivos
- **Funções centralizadas**: 20+ funções utilitárias
- **Componentes reutilizáveis**: 10+ componentes UI

### 🎯 Benefícios Alcançados

1. **DRY (Don't Repeat Yourself)**: Eliminou duplicação de código
2. **Manutenibilidade**: Mudanças em um local se propagam para todos os usos
3. **Consistência**: Formatação e comportamento uniformes
4. **Testabilidade**: Funções isoladas são mais fáceis de testar
5. **Reutilização**: Componentes podem ser usados em novos recursos
6. **Legibilidade**: Código mais limpo e fácil de entender

### 🔄 Padrão de Uso Recomendado

```javascript
// 1. Sempre import dos utilitários
import { formatDate, formatCPF, formatPhone } from '../utils/formatters';
import { Loading, StatCard, EmptyState } from '../components/ui';
import { calculateActivityStats } from '../utils/dashboardUtils';

// 2. Use os componentes reutilizáveis
const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  if (loading) return <Loading text="Carregando..." />;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={FileX}
        title="Nenhum dado encontrado"
        message="Tente novamente mais tarde."
      />
    );
  }

  return (
    <div>
      <StatCard title="Total" value={data.length} icon={BarChart} />
      {data.map(item => (
        <div key={item.id}>
          <span>{formatDate(item.date)}</span>
          <span>{formatCPF(item.cpf)}</span>
        </div>
      ))}
    </div>
  );
};
```

### 📝 Próximos Passos Recomendados

1. **Migrar arquivos restantes** para usar os utilitários
2. **Criar testes unitários** para as funções utilitárias
3. **Documentar padrões** para novos desenvolvedores
4. **Configurar ESLint rules** para evitar duplicação futura
5. **Criar mais componentes** conforme necessidade
