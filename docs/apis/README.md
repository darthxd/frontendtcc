# Documentação das APIs

Esta documentação detalha todos os serviços e endpoints utilizados pelo frontend para comunicação com o backend.

## Índice

- [Configuração Base](#configuração-base)
- [Autenticação](#autenticação)
- [Interceptors](#interceptors)
- [Serviços](#serviços)
  - [Auth Service](#auth-service)
  - [Activity Service](#activity-service)
  - [Attendance Service](#attendance-service)
- [Endpoints por Módulo](#endpoints-por-módulo)
- [Tratamento de Erros](#tratamento-de-erros)

---

## Configuração Base

**Arquivo**: `src/services/api.js`

### Cliente Axios
```javascript
const api = axios.create({
  baseURL: process.env.VITE_API_URI, // Ex: http://localhost:8080/api
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Variáveis de Ambiente
```bash
# .env
VITE_API_URI=http://localhost:8080/api
```

---

## Autenticação

### Sistema JWT
- **Token**: Armazenado no `localStorage`
- **Header**: `Authorization: Bearer {token}`
- **Expiração**: Verificação automática
- **Refresh**: Redirecionamento para login

### Fluxo de Autenticação
1. **Login** → `POST /auth/login`
2. **Token** → Armazenado localmente
3. **Requests** → Header automático
4. **Expiração** → Limpeza e redirecionamento

---

## Interceptors

### Request Interceptor
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token) {
    // Token expirado - limpar e redirecionar
    localStorage.clear();
    window.location.href = "/login";
  }

  return config;
});
```

### Response Interceptor
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido
      localStorage.clear();
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      // Acesso negado
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  }
);
```

---

## Auth Service

**Arquivo**: `src/services/authService.js`

### Métodos Disponíveis

#### `login(username, password)`
**Endpoint**: `POST /auth/login`
```javascript
const { token, user } = await authService.login("usuario", "senha");
```
**Response**:
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### `getCurrentUser()`
Retorna usuário do localStorage com validação de token.

#### `isAuthenticated()`
Verifica se usuário está autenticado e token válido.

#### `hasRole(role)`
Verifica se usuário possui role específica.
```javascript
authService.hasRole("ROLE_ADMIN")  // boolean
authService.isAdmin()              // boolean
authService.isTeacher()            // boolean
authService.isStudent()            // boolean
```

#### `logout()`
Remove dados de autenticação e notifica listeners.

### Sistema de Listeners
```javascript
// Adicionar listener para mudanças de auth
authService.addAuthListener(callback);

// Remover listener
authService.removeAuthListener(callback);
```

---

## Activity Service

**Arquivo**: `src/services/activityService.js`

### Métodos de Atividades

#### `getActivityById(id)`
**Endpoint**: `GET /activity/{id}`
```javascript
const activity = await activityService.getActivityById(123);
```

#### `listActivitiesBySchoolClass(schoolClassId)`
**Endpoint**: `GET /activity/schoolclass/{schoolClassId}`
```javascript
const activities = await activityService.listActivitiesBySchoolClass(456);
```

#### `createActivity(activityData)`
**Endpoint**: `POST /activity`
```javascript
const newActivity = await activityService.createActivity({
  title: "Título da Atividade",
  description: "Descrição detalhada",
  deadline: "2024-12-31T23:59:59",
  maxScore: 10,
  schoolClassId: 456
});
```

#### `updateActivity(id, activityData)`
**Endpoint**: `PUT /activity/{id}`

#### `deleteActivity(id)`
**Endpoint**: `DELETE /activity/{id}`

### Métodos de Submissões

#### `listSubmissionsByStudent(studentId)`
**Endpoint**: `GET /activity/submission/student/{studentId}`
```javascript
const submissions = await activityService.listSubmissionsByStudent(789);
```

#### `listSubmissionsByActivity(activityId)`
**Endpoint**: `GET /activity/{activityId}/submission`

#### `submitActivity(activityId, submissionData)`
**Endpoint**: `POST /activity/submission/{activityId}`
```javascript
await activityService.submitActivity(123, {
  answerText: "Minha resposta",
  fileUrl: "https://exemplo.com/arquivo.pdf"
});
```

#### `submitGrade(submissionId, gradeData)`
**Endpoint**: `POST /activity/submission/{submissionId}/grade`
```javascript
await activityService.submitGrade(456, {
  grade: 8.5,
  feedback: "Bom trabalho!"
});
```

### Métodos de Usuários

#### `getStudentByUsername(username)`
**Endpoint**: `GET /student/username/{username}`

#### `getTeacherByUsername(username)`
**Endpoint**: `GET /teacher/username/{username}`

#### `getSchoolClasses()`
**Endpoint**: `GET /schoolclass`

### Validações

#### `validateActivityData(data)`
Valida dados de atividade antes do envio:
- Título obrigatório
- Descrição obrigatória
- Prazo futuro
- Nota máxima entre 0-10
- Turma obrigatória

#### `validateSubmissionData(data)`
Valida dados de submissão:
- Resposta obrigatória
- URL válida (se fornecida)

---

## Attendance Service

**Arquivo**: `src/services/attendanceService.js`

### Métodos Disponíveis

#### `getStudentAttendance(studentId)`
**Endpoint**: `GET /attendance/student/{studentId}`
```javascript
const attendance = await attendanceService.getStudentAttendance(123);
```
**Response**:
```json
[
  {
    "date": "2024-12-15T08:00:00Z",
    "teacherId": 456,
    "isInSchool": true,
    "present": true
  }
]
```

#### `getStudentAttendanceByDate(studentId, date)`
Filtra presenças por data específica (formato YYYY-MM-DD).

#### `getTeacherById(teacherId)`
**Endpoint**: `GET /teacher/{teacherId}`
```javascript
const teacher = await attendanceService.getTeacherById(456);
```

#### `getMultipleTeachers(teacherIds)`
Busca múltiplos professores em paralelo e retorna mapa indexado por ID.

#### Formatadores (Reutilizados dos utils)
- `formatDate(dateString)` - Data brasileira
- `formatDateTime(dateString)` - Data e hora
- `getCurrentDate()` - Data atual YYYY-MM-DD

---

## Endpoints por Módulo

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login do usuário |

### Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/username/{username}` | Dados do admin |
| GET | `/teacher/username/{username}` | Dados do professor |
| GET | `/student/username/{username}` | Dados do aluno |
| GET | `/teacher/{id}` | Professor por ID |
| GET | `/student/{id}` | Aluno por ID |
| GET | `/student` | Listar alunos |
| GET | `/teacher` | Listar professores |
| POST | `/student` | Criar aluno |
| POST | `/teacher` | Criar professor |
| PUT | `/student/{id}` | Atualizar aluno |
| PUT | `/teacher/{id}` | Atualizar professor |
| DELETE | `/student/{id}` | Deletar aluno |
| DELETE | `/teacher/{id}` | Deletar professor |

### Gestão Escolar
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/schoolclass` | Listar turmas |
| GET | `/schoolclass/{id}/students` | Alunos da turma |
| POST | `/schoolclass` | Criar turma |
| PUT | `/schoolclass/{id}` | Atualizar turma |
| DELETE | `/schoolclass/{id}` | Deletar turma |
| GET | `/subject` | Listar disciplinas |
| POST | `/subject` | Criar disciplina |
| PUT | `/subject/{id}` | Atualizar disciplina |
| DELETE | `/subject/{id}` | Deletar disciplina |

### Atividades
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/activity/{id}` | Atividade por ID |
| GET | `/activity/schoolclass/{id}` | Atividades da turma |
| GET | `/activity/teacher/{id}` | Atividades do professor |
| POST | `/activity` | Criar atividade |
| PUT | `/activity/{id}` | Atualizar atividade |
| DELETE | `/activity/{id}` | Deletar atividade |

### Submissões
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/activity/submission/{id}` | Submissão por ID |
| GET | `/activity/submission/student/{id}` | Submissões do aluno |
| GET | `/activity/{id}/submission` | Submissões da atividade |
| GET | `/submission/teacher/{id}` | Submissões para o professor |
| POST | `/activity/submission/{activityId}` | Enviar submissão |
| POST | `/activity/submission/{id}/grade` | Avaliar submissão |

### Presença
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/attendance/student/{id}` | Presenças do aluno |
| GET | `/attendance/class/{classId}/date/{date}` | Chamada da turma |
| GET | `/teacher/classes/{id}` | Turmas do professor |
| POST | `/attendance/batch` | Salvar presenças em lote |

---

## Tratamento de Erros

### Códigos de Status
- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Sem permissão
- **404**: Não encontrado
- **500**: Erro interno do servidor

### Padrão de Erro
```json
{
  "error": "Mensagem de erro",
  "details": "Detalhes específicos",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Tratamento no Frontend
```javascript
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  // Log do erro
  console.error('Erro na API:', error);

  // Notificação ao usuário
  toast.error(error.response?.data?.message || 'Erro inesperado');

  // Re-throw se necessário
  throw error;
}
```

### Interceptação Global
- **401**: Redirecionamento automático para `/login`
- **403**: Redirecionamento para `/unauthorized`
- **500**: Exibição de toast de erro

---

## Padrões de Requisição

### GET Request
```javascript
const data = await api.get('/endpoint');
return data.data; // Response data
```

### POST Request
```javascript
const result = await api.post('/endpoint', {
  field1: 'value1',
  field2: 'value2'
});
return result.data;
```

### PUT Request
```javascript
const updated = await api.put('/endpoint/123', updateData);
return updated.data;
```

### DELETE Request
```javascript
await api.delete('/endpoint/123');
// Geralmente sem retorno
```

---

## Boas Práticas

### Tratamento de Dados
```javascript
// Sempre tratar arrays vazios
return response.data || [];

// Validar dados antes do envio
const errors = validateData(data);
if (errors.length > 0) {
  throw new Error(errors.join(', '));
}

// Usar try/catch consistente
try {
  return await api.get('/endpoint');
} catch (error) {
  console.error('Erro:', error);
  return fallbackValue;
}
```

### Performance
```javascript
// Requests paralelos quando possível
const [activities, submissions] = await Promise.all([
  api.get('/activities'),
  api.get('/submissions')
]);

// Cache de dados frequentes
const teacherCache = {};
const getTeacher = async (id) => {
  if (!teacherCache[id]) {
    teacherCache[id] = await api.get(`/teacher/${id}`);
  }
  return teacherCache[id];
};
```

### Segurança
```javascript
// Sempre validar dados recebidos
const safeData = {
  id: data.id || null,
  name: data.name?.trim() || '',
  email: data.email?.toLowerCase() || ''
};

// Sanitizar inputs
const cleanInput = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
```

---

## Exemplos de Uso

### Login Completo
```javascript
const handleLogin = async (username, password) => {
  try {
    const { token, user } = await authService.login(username, password);

    // Token e user já estão salvos no localStorage
    toast.success(`Bem-vindo, ${user.username}!`);

    // Redirecionamento baseado em role
    navigate('/dashboard');
  } catch (error) {
    toast.error('Credenciais inválidas');
  }
};
```

### Busca com Loading
```javascript
const [activities, setActivities] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.listActivitiesBySchoolClass(classId);
      setActivities(data);
    } catch (error) {
      toast.error('Erro ao carregar atividades');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  loadActivities();
}, [classId]);
```

### CRUD Completo
```javascript
// Create
const createActivity = async (data) => {
  const errors = activityService.validateActivityData(data);
  if (errors.length > 0) {
    toast.error(errors.join(', '));
    return;
  }

  const activity = await activityService.createActivity(data);
  toast.success('Atividade criada!');
  return activity;
};

// Update
const updateActivity = async (id, data) => {
  const activity = await activityService.updateActivity(id, data);
  toast.success('Atividade atualizada!');
  return activity;
};

// Delete
const deleteActivity = async (id) => {
  if (!confirm('Tem certeza?')) return;

  await activityService.deleteActivity(id);
  toast.success('Atividade deletada!');

  // Recarregar lista
  loadActivities();
};
```

---

*Documentação das APIs atualizada em: Outubro 2025*
