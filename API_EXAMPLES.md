# API Examples - Sistema de Atividades

Este documento contém exemplos práticos de como usar as APIs implementadas no sistema.

## 📋 Autenticação

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "professor1",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "professor1",
    "role": "ROLE_TEACHER"
  }
}
```

## 🎯 Activities API

### 1. Buscar atividade por ID
```http
GET /api/activity/1
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "id": 1,
  "title": "Exercício de Matemática",
  "description": "Resolver os problemas da página 45",
  "deadline": "2024-02-15T23:59:00",
  "maxScore": 10.0,
  "teacherId": 2,
  "schoolClassId": 1
}
```

### 2. Listar atividades por turma
```http
GET /api/activity/schoolclass/1
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Exercício de Matemática",
    "description": "Resolver os problemas da página 45",
    "deadline": "2024-02-15T23:59:00",
    "maxScore": 10.0,
    "teacherId": 2,
    "schoolClassId": 1
  },
  {
    "id": 2,
    "title": "Redação sobre o Meio Ambiente",
    "description": "Escrever uma redação de 30 linhas",
    "deadline": "2024-02-20T18:00:00",
    "maxScore": 8.0,
    "teacherId": 2,
    "schoolClassId": 1
  }
]
```

### 3. Criar nova atividade
```http
POST /api/activity
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Prova de História",
  "description": "Avaliação sobre a Segunda Guerra Mundial",
  "deadline": "2024-02-25T14:00:00",
  "maxScore": 10.0,
  "teacherId": 2,
  "schoolClassId": 1
}
```

**Resposta:**
```json
{
  "id": 3,
  "title": "Prova de História",
  "description": "Avaliação sobre a Segunda Guerra Mundial",
  "deadline": "2024-02-25T14:00:00",
  "maxScore": 10.0,
  "teacherId": 2,
  "schoolClassId": 1
}
```

### 4. Atualizar atividade
```http
PUT /api/activity/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Exercício de Matemática - ATUALIZADO",
  "description": "Resolver os problemas das páginas 45 e 46",
  "deadline": "2024-02-16T23:59:00",
  "maxScore": 10.0,
  "teacherId": 2,
  "schoolClassId": 1
}
```

### 5. Deletar atividade
```http
DELETE /api/activity/1
Authorization: Bearer {token}
```

## 📝 Activity Submissions API

### 1. Buscar submissão por ID
```http
GET /api/activity/submission/1
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "id": 1,
  "activityId": 1,
  "studentId": 5,
  "answerText": "Resolvi todos os exercícios conforme solicitado...",
  "fileUrl": "https://drive.google.com/file/d/1234567890",
  "submissionDate": "2024-02-14T15:30:00",
  "grade": 8.5
}
```

### 2. Listar submissões por estudante
```http
GET /api/activity/submission/student/5
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "activityId": 1,
    "studentId": 5,
    "answerText": "Resolvi todos os exercícios...",
    "fileUrl": "https://drive.google.com/file/d/1234567890",
    "submissionDate": "2024-02-14T15:30:00",
    "grade": 8.5
  },
  {
    "id": 2,
    "activityId": 2,
    "studentId": 5,
    "answerText": "Minha redação sobre meio ambiente...",
    "fileUrl": null,
    "submissionDate": "2024-02-19T20:15:00",
    "grade": null
  }
]
```

### 3. Enviar atividade
```http
POST /api/activity/submission/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": 5,
  "answerText": "Minha resposta para esta atividade é...",
  "fileUrl": "https://drive.google.com/file/d/abcd1234"
}
```

**Resposta:**
```json
{
  "id": 3,
  "activityId": 1,
  "studentId": 5,
  "answerText": "Minha resposta para esta atividade é...",
  "fileUrl": "https://drive.google.com/file/d/abcd1234",
  "submissionDate": "2024-02-15T10:45:00",
  "grade": null
}
```

### 4. Avaliar submissão
```http
POST /api/activity/submission/1/grade
Authorization: Bearer {token}
Content-Type: application/json

{
  "grade": 9.0
}
```

**Resposta:**
```json
{
  "id": 1,
  "activityId": 1,
  "studentId": 5,
  "answerText": "Resolvi todos os exercícios...",
  "fileUrl": "https://drive.google.com/file/d/1234567890",
  "submissionDate": "2024-02-14T15:30:00",
  "grade": 9.0
}
```

## 👥 Users API

### 1. Buscar estudante por username
```http
GET /api/student/username/aluno1
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "id": 5,
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "cpf": "12345678901",
  "phone": "11987654321",
  "schoolClassId": 1
}
```

### 2. Buscar professor por username
```http
GET /api/teacher/username/professor1
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "id": 2,
  "name": "Maria Santos",
  "email": "maria.santos@escola.com",
  "cpf": "98765432100",
  "phone": "11123456789",
  "schoolClassIds": [1, 2, 3]
}
```

## 🏫 School Classes API

### Listar todas as turmas
```http
GET /api/schoolclass
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "3º Ano A",
    "description": "Turma do terceiro ano do ensino médio"
  },
  {
    "id": 2,
    "name": "2º Ano B",
    "description": "Turma do segundo ano do ensino médio"
  }
]
```

## 📊 Exemplos de Uso no Frontend

### JavaScript/Axios Examples

#### 1. Criar atividade
```javascript
import api from './services/api';

const createActivity = async (activityData) => {
  try {
    const response = await api.post('/activity', {
      title: "Nova Atividade",
      description: "Descrição da atividade",
      deadline: "2024-02-25T23:59:00",
      maxScore: 10.0,
      teacherId: 2,
      schoolClassId: 1
    });
    console.log('Atividade criada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    throw error;
  }
};
```

#### 2. Enviar atividade (estudante)
```javascript
const submitActivity = async (activityId, submission) => {
  try {
    const response = await api.post(`/activity/submission/${activityId}`, {
      studentId: 5,
      answerText: submission.answer,
      fileUrl: submission.fileUrl || null
    });
    console.log('Atividade enviada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar atividade:', error);
    throw error;
  }
};
```

#### 3. Buscar atividades do estudante
```javascript
const getStudentActivities = async (studentId) => {
  try {
    // Buscar dados do estudante
    const studentResponse = await api.get(`/student/${studentId}`);
    const student = studentResponse.data;
    
    // Buscar atividades da turma
    const activitiesResponse = await api.get(
      `/activity/schoolclass/${student.schoolClassId}`
    );
    
    // Buscar submissões do estudante
    const submissionsResponse = await api.get(
      `/activity/submission/student/${studentId}`
    );
    
    return {
      activities: activitiesResponse.data,
      submissions: submissionsResponse.data
    };
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    throw error;
  }
};
```

#### 4. Calcular estatísticas do estudante
```javascript
const calculateStudentStats = (activities, submissions) => {
  const total = activities.length;
  const submitted = submissions.length;
  const graded = submissions.filter(s => s.grade !== null).length;
  const pending = total - submitted;
  
  const averageGrade = graded > 0 
    ? submissions
        .filter(s => s.grade !== null)
        .reduce((acc, s) => acc + s.grade, 0) / graded
    : 0;
  
  return {
    total,
    submitted,
    graded,
    pending,
    averageGrade: Math.round(averageGrade * 10) / 10
  };
};
```

## ⚠️ Tratamento de Erros

### Exemplos de Respostas de Erro

#### 401 - Não Autorizado
```json
{
  "error": "Unauthorized",
  "message": "Token JWT inválido ou expirado"
}
```

#### 403 - Proibido
```json
{
  "error": "Forbidden",
  "message": "Usuário não tem permissão para acessar este recurso"
}
```

#### 404 - Não Encontrado
```json
{
  "error": "Not Found",
  "message": "Atividade não encontrada"
}
```

#### 400 - Bad Request
```json
{
  "error": "Bad Request",
  "message": "Dados inválidos",
  "details": [
    "O campo 'title' é obrigatório",
    "O campo 'maxScore' deve ser um número entre 0 e 10"
  ]
}
```

### Tratamento no Frontend
```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Erro da resposta do servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Redirecionar para login
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Você não tem permissão para esta ação');
        break;
      case 404:
        toast.error('Recurso não encontrado');
        break;
      case 400:
        toast.error(data.message || 'Dados inválidos');
        break;
      default:
        toast.error('Erro interno do servidor');
    }
  } else if (error.request) {
    // Erro de rede
    toast.error('Erro de conexão. Verifique sua internet.');
  } else {
    // Outros erros
    toast.error('Erro inesperado');
  }
};
```

## 🔐 Headers de Autenticação

Todas as requisições (exceto login) devem incluir o header de autorização:

```javascript
// Configuração automática no interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📅 Formato de Datas

O sistema utiliza o formato ISO 8601 para datas:
- **Formato**: `YYYY-MM-DDTHH:mm:ss`
- **Exemplo**: `2024-02-15T23:59:00`
- **Timezone**: Local (definido pelo servidor)

### Conversão JavaScript
```javascript
// Para enviar ao backend
const deadline = new Date('2024-02-15T23:59:00').toISOString();

// Para exibir ao usuário
const displayDate = new Date(deadline).toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});
```
