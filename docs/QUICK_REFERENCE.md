# 🚀 Referência Rápida - Frontend TCC

## 📋 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Verificar erros de lint
npm run lint
```

### Git
```bash
# Commit das mudanças
git add .
git commit -m "feat: implementar login com unidade escolar"
git push origin main
```

---

## 🔧 Snippets de Código

### 1. Fazer Login
```javascript
import { useAuth } from "../contexts/AuthContext";

const { login } = useAuth();

// Login com unidade escolar
try {
  await login(username, password, unitId);
  toast.success("Login realizado com sucesso!");
  navigate("/dashboard");
} catch (error) {
  toast.error(error.message || "Erro ao fazer login");
}
```

### 2. Buscar Unidades Escolares
```javascript
import { schoolUnitService } from "../services/schoolUnitService";

// Buscar todas as unidades
const units = await schoolUnitService.getAllSchoolUnits();

// Buscar uma específica
const unit = await schoolUnitService.getSchoolUnitById(1);
```

### 3. Submeter Atividade com Arquivo
```javascript
import { activityService } from "../services/activityService";

// Com arquivo
const formData = new FormData();
formData.append('studentId', studentId);
formData.append('answerText', 'Minha resposta');
formData.append('file', selectedFile);

await activityService.submitActivity(activityId, formData);
```

### 4. Corrigir Atividade
```javascript
import { activityService } from "../services/activityService";

// Corrigir com nota e comentário
await activityService.submitCorrection(submissionId, {
  grade: 8.5,
  comment: "Ótimo trabalho! Continue assim.",
  teacherId: teacherId
});
```

### 5. Criar Administrador
```javascript
import { adminService } from "../services/adminService";

const newAdmin = await adminService.createAdmin({
  name: "João Silva",
  username: "joao.admin",
  password: "senha123",
  unitId: 1
});
```

### 6. Criar Estudante
```javascript
import { studentService } from "../services/studentService";

const newStudent = await studentService.createStudent({
  name: "Maria Santos",
  username: "maria.santos",
  password: "senha123",
  email: "maria@email.com",
  cpf: "123.456.789-00",
  phone: "11999999999",
  address: "Rua Exemplo, 123",
  schoolClassId: 1,
  birthdate: "2005-05-15",
  unitId: 1,
  rm: 12345,
  ra: "123456789"
});
```

### 7. Validar CPF
```javascript
import { studentService } from "../services/studentService";

// Validar
const isValid = studentService.isValidCPF("123.456.789-09");

// Formatar
const formatted = studentService.formatCPF("12345678909");
// Resultado: "123.456.789-09"
```

### 8. Validar Email
```javascript
import { studentService } from "../services/studentService";

const isValid = studentService.isValidEmail("teste@email.com");
```

### 9. Ativar/Inativar Matrícula
```javascript
import { studentService } from "../services/studentService";

// Ativar
await studentService.setEnrollmentActive(studentId);

// Inativar
await studentService.setEnrollmentInactive(studentId);
```

### 10. Buscar Professor por Username
```javascript
import { teacherService } from "../services/teacherService";

const teacher = await teacherService.getTeacherByUsername("professor.nome");
```

---

## 🎯 Estrutura de Dados

### LoginRequestDTO
```javascript
{
  username: "string",
  password: "string",
  unitId: number
}
```

### ActivitySubmissionRequestDTO
```javascript
{
  studentId: number,
  answerText: "string",
  file: File // opcional
}
```

### ActivityCorrectionRequestDTO
```javascript
{
  grade: number,
  comment: "string", // opcional
  teacherId: number
}
```

### AdminRequestDTO
```javascript
{
  name: "string",
  username: "string",
  password: "string",
  unitId: number
}
```

### StudentRequestDTO
```javascript
{
  name: "string",
  username: "string",
  password: "string",
  email: "string",
  cpf: "string",
  phone: "string",
  address: "string",
  schoolClassId: number,
  birthdate: "YYYY-MM-DD",
  unitId: number,
  rm: number,
  ra: "string",
  photo: "string", // URL
  sendNotification: boolean
}
```

### TeacherRequestDTO
```javascript
{
  name: "string",
  username: "string",
  password: "string",
  cpf: "string",
  email: "string",
  phone: "string",
  subjectIds: [number],
  schoolClassIds: [number],
  unitId: number
}
```

---

## 🔍 Debug no Console

### Verificar Token
```javascript
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token:', payload);
console.log('Role:', payload.role);
console.log('Unit ID:', payload.unitId);
```

### Verificar Usuário
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
```

### Verificar Requisições
```javascript
// No DevTools > Network
// Filtrar por XHR/Fetch
// Verificar:
// - Endpoint correto
// - Headers (Authorization)
// - Body da requisição
// - Response
```

---

## 📊 Endpoints da API

### Autenticação
```
POST /auth/login
Body: { username, password, unitId }
Response: { token: "jwt_token" }
```

### Unidades Escolares
```
GET  /schoolunit
GET  /schoolunit/{id}
POST /schoolunit
```

### Administradores
```
GET    /admin
GET    /admin/{id}
GET    /admin/username/{username}
POST   /admin
PUT    /admin/{id}
DELETE /admin/{id}
POST   /admin/biometry/reset
```

### Estudantes
```
GET    /student
GET    /student/{id}
GET    /student/username/{username}
POST   /student
PUT    /student/{id}
DELETE /student/{id}
GET    /student/{id}/presencelog
POST   /student/biometry/enroll
POST   /student/biometry/read
POST   /student/biometry/delete
GET    /student/enroll
GET    /student/enroll/{id}
POST   /student/enroll (multipart/form-data)
PUT    /student/enroll/{id}
POST   /student/{id}/setactive
POST   /student/{id}/setinactive
```

### Professores
```
GET    /teacher
GET    /teacher/{id}
GET    /teacher/username/{username}
POST   /teacher
PUT    /teacher/{id}
DELETE /teacher/{id}
```

### Atividades
```
GET    /activity/{id}
GET    /activity/schoolclass/{id}
POST   /activity
PUT    /activity/{id}
DELETE /activity/{id}
GET    /activity/submission/{id}
GET    /activity/submission/student/{id}
POST   /activity/submission/{id} (multipart/form-data)
POST   /activity/submission/{id}/grade
GET    /activity/{id}/submission
```

### Turmas
```
GET    /schoolclass
GET    /schoolclass/{id}
POST   /schoolclass
PUT    /schoolclass/{id}
DELETE /schoolclass/{id}
GET    /schoolclass/{id}/students
```

### Horários
```
GET    /classschedule
GET    /classschedule/class/{id}
GET    /classschedule/class/{id}/day/{day}
GET    /classschedule/teacher/{id}
POST   /classschedule
PUT    /classschedule/{id}
DELETE /classschedule/{id}
```

**Nota:** Estes endpoints são relativos. A URL base (`VITE_API_URI`) já contém o prefixo `/api/`, portanto as URLs completas serão `{BASE_URL}/auth/login`, `{BASE_URL}/student`, etc.

---

## 🎨 Componentes React Úteis

### Loading Spinner
```jsx
{isLoading && (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
)}
```

### Toast Notification
```jsx
import toast from "react-hot-toast";

toast.success("Sucesso!");
toast.error("Erro!");
toast.loading("Carregando...");
```

### Select com Loading
```jsx
<select disabled={loading}>
  <option value="">
    {loading ? "Carregando..." : "Selecione"}
  </option>
  {items.map(item => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
```

### File Input
```jsx
<input
  type="file"
  accept=".pdf,.doc,.docx,.jpg,.png"
  onChange={(e) => setFile(e.target.files[0])}
/>
```

---

## 🔐 Autorização

### Verificar Role
```javascript
import { useAuth } from "../contexts/AuthContext";

const { user, isAdmin, isTeacher, isStudent } = useAuth();

if (isAdmin()) {
  // Código para admin
}

if (isTeacher()) {
  // Código para professor
}

if (isStudent()) {
  // Código para aluno
}
```

### Proteger Rota
```jsx
import ProtectedRoute from "./components/ProtectedRoute";

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🐛 Troubleshooting

### Login não funciona
```javascript
// 1. Verificar se API está rodando
// 2. Verificar console por erros
// 3. Verificar Network tab
// 4. Verificar se unitId está sendo enviado
console.log('Dados de login:', { username, password, unitId });
```

### Upload falha
```javascript
// 1. Verificar tipo de arquivo
console.log('Arquivo:', file);
console.log('Tipo:', file.type);
console.log('Tamanho:', file.size);

// 2. Verificar se FormData está correto
const formData = new FormData();
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
```

### Token inválido
```javascript
// Limpar e fazer login novamente
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

---

## 📚 Links Úteis

- [Documentação API](./API_UPDATES.md)
- [Checklist](./IMPLEMENTATION_CHECKLIST.md)
- [Guia de Testes](./TESTING_GUIDE.md)
- [Resumo](./API_MIGRATION_SUMMARY.md)

---

## 💡 Dicas Rápidas

1. **Sempre use try-catch** em chamadas assíncronas
2. **Valide dados** antes de enviar para API
3. **Use loading states** para melhor UX
4. **Trate erros** com mensagens amigáveis
5. **Documente** mudanças importantes
6. **Teste** antes de fazer commit
7. **Não adicione** `/api/` aos endpoints (já está na URL base)
8. **Verifique** console regularmente

---

**Última atualização:** 04/11/2025