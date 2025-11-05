# Documentação dos Componentes

Esta documentação detalha todos os componentes reutilizáveis do sistema, suas propriedades e exemplos de uso.

## Índice

- [Componentes UI](#componentes-ui)
- [Componentes Específicos](#componentes-específicos)
- [Layout Components](#layout-components)
- [Form Components](#form-components)
- [Padrões de Uso](#padrões-de-uso)

---

## Componentes UI

**Arquivo**: `src/components/ui/index.jsx`

### Loading Components

#### `<Spinner />`
Spinner de carregamento básico com tamanhos variáveis.

**Props**:
- `size` (string): `'sm' | 'md' | 'lg' | 'xl'` - Default: `'md'`
- `color` (string): Classe CSS da cor - Default: `'border-primary-600'`
- `className` (string): Classes CSS adicionais

**Exemplo**:
```jsx
<Spinner size="lg" color="border-blue-500" />
```

#### `<Loading />`
Loading completo com texto e centralização.

**Props**:
- `text` (string): Texto de carregamento - Default: `'Carregando...'`
- `size` (string): Tamanho do spinner
- `className` (string): Classes CSS adicionais

**Exemplo**:
```jsx
<Loading text="Carregando dados..." size="lg" />
```

#### `<PageLoading />`
Loading para páginas inteiras com fundo.

**Props**:
- `text` (string): Texto de carregamento

**Exemplo**:
```jsx
<PageLoading text="Inicializando aplicação..." />
```

#### `<InlineLoading />`
Loading inline pequeno para uso em botões ou elementos menores.

**Props**:
- `text` (string): Texto opcional
- `className` (string): Classes CSS adicionais

**Exemplo**:
```jsx
<InlineLoading text="Salvando..." />
```

### Card Components

#### `<Card />`
Card básico reutilizável com estilo padrão.

**Props**:
- `children` (ReactNode): Conteúdo do card
- `className` (string): Classes CSS adicionais
- `onClick` (Function): Função de clique (torna o card clicável)

**Exemplo**:
```jsx
<Card className="mb-4" onClick={() => console.log('Clicado')}>
  <h3>Título do Card</h3>
  <p>Conteúdo do card</p>
</Card>
```

#### `<StatCard />`
Card específico para exibir estatísticas com ícone.

**Props**:
- `title` (string): Título da estatística
- `value` (string|number): Valor da estatística
- `icon` (Component): Componente de ícone (Lucide React)
- `color` (string): Cor de fundo do ícone - Default: `'bg-blue-500'`
- `subtitle` (string): Subtítulo opcional
- `onClick` (Function): Função de clique
- `className` (string): Classes CSS adicionais

**Exemplo**:
```jsx
<StatCard
  title="Total de Alunos"
  value={150}
  icon={Users}
  color="bg-green-500"
  subtitle="Cadastrados no sistema"
  onClick={() => navigate('/students')}
/>
```

### Empty State Components

#### `<EmptyState />`
Estado vazio com ícone, título e mensagem.

**Props**:
- `icon` (Component): Ícone a ser exibido
- `title` (string): Título do estado vazio
- `message` (string): Mensagem explicativa
- `action` (ReactNode): Ação opcional (botão, link, etc.)
- `className` (string): Classes CSS adicionais

**Exemplo**:
```jsx
<EmptyState
  icon={FileX}
  title="Nenhuma atividade encontrada"
  message="Não há atividades para exibir no momento."
  action={
    <button className="btn btn-primary">
      Criar Nova Atividade
    </button>
  }
/>
```

### Badge Components

#### `<StatusBadge />`
Badge colorido para exibir status.

**Props**:
- `status` (string): Status pré-definido (`'success' | 'warning' | 'error' | 'info' | 'neutral'`)
- `text` (string): Texto personalizado
- `color` (string): Cor personalizada (sobrescreve status)
- `size` (string): `'sm' | 'md' | 'lg'` - Default: `'md'`
- `className` (string): Classes CSS adicionais

**Exemplo**:
```jsx
<StatusBadge status="success" text="Concluído" />
<StatusBadge color="bg-purple-100 text-purple-800" text="Personalizado" />
```

### Button Components

#### `<Button />`
Botão com loading integrado e variantes.

**Props**:
- `children` (ReactNode): Conteúdo do botão
- `loading` (boolean): Estado de loading - Default: `false`
- `loadingText` (string): Texto durante loading - Default: `'Carregando...'`
- `variant` (string): `'primary' | 'secondary' | 'danger' | 'success'` - Default: `'primary'`
- `size` (string): `'sm' | 'md' | 'lg'` - Default: `'md'`
- `disabled` (boolean): Se está desabilitado
- `className` (string): Classes CSS adicionais
- `...props`: Outras props do botão HTML

**Exemplo**:
```jsx
<Button
  variant="primary"
  loading={isSubmitting}
  loadingText="Salvando..."
  onClick={handleSubmit}
>
  Salvar Alterações
</Button>
```

### Form Components

#### `<FormInput />`
Input com label e validação integrada.

**Props**:
- `label` (string): Label do input
- `error` (string): Mensagem de erro
- `required` (boolean): Se é obrigatório - Default: `false`
- `className` (string): Classes CSS adicionais
- `...props`: Props do input HTML

**Exemplo**:
```jsx
<FormInput
  label="Nome Completo"
  required
  error={errors.name}
  value={formData.name}
  onChange={handleChange}
  placeholder="Digite seu nome"
/>
```

### Modal Components

#### `<Modal />`
Modal responsivo com overlay.

**Props**:
- `isOpen` (boolean): Se o modal está aberto
- `onClose` (Function): Função para fechar o modal
- `title` (string): Título do modal
- `children` (ReactNode): Conteúdo do modal
- `footer` (ReactNode): Rodapé do modal
- `size` (string): `'sm' | 'md' | 'lg' | 'xl'` - Default: `'md'`

**Exemplo**:
```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Editar Usuário"
  footer={
    <div className="flex justify-end space-x-2">
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancelar
      </Button>
      <Button onClick={handleSave}>
        Salvar
      </Button>
    </div>
  }
>
  <form>
    {/* Formulário aqui */}
  </form>
</Modal>
```

### Table Components

#### `<Table />`
Tabela responsiva com loading integrado.

**Props**:
- `headers` (Array): Array de strings com cabeçalhos
- `children` (ReactNode): Linhas da tabela
- `loading` (boolean): Estado de loading
- `className` (string): Classes CSS adicionais

**Exemplo**:
```jsx
<Table
  headers={['Nome', 'Email', 'Turma', 'Ações']}
  loading={loadingStudents}
>
  {students.map(student => (
    <tr key={student.id}>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td>{student.class}</td>
      <td>
        <button>Editar</button>
      </td>
    </tr>
  ))}
</Table>
```

---

## Componentes Específicos

### Layout Components

#### `<Layout />`
**Arquivo**: `src/components/Layout.jsx`

Layout principal da aplicação com sidebar e navegação.

**Props**:
- `children` (ReactNode): Conteúdo da página

**Funcionalidades**:
- Sidebar responsiva com navegação baseada em role
- Header mobile com menu hamburger
- Informações do usuário logado
- Botão de logout
- Menu adaptável por perfil

**Exemplo**:
```jsx
<Layout>
  <Dashboard />
</Layout>
```

#### `<ProtectedRoute />`
**Arquivo**: `src/components/ProtectedRoute.jsx`

Componente para proteção de rotas baseada em autenticação e roles.

**Props**:
- `children` (ReactNode): Componente a ser protegido
- `requiredRole` (string): Role necessária para acessar a rota

**Exemplo**:
```jsx
<ProtectedRoute requiredRole="ROLE_ADMIN">
  <AdminPanel />
</ProtectedRoute>
```

### Specific Components

#### `<ActivityGrading />`
**Arquivo**: `src/components/ActivityGrading.jsx`

Componente para avaliação de atividades pelos professores.

**Funcionalidades**:
- Lista de submissões por atividade
- Sistema de notas (0-10)
- Campo de feedback
- Histórico de avaliações
- Filtros por status

#### `<AttendanceHistory />`
**Arquivo**: `src/components/AttendanceHistory.jsx`

Componente para visualização de histórico de presenças.

**Funcionalidades**:
- Calendário mensal
- Navegação entre meses
- Status visual de presenças
- Estatísticas de frequência
- Filtros por turma

#### `<CompletedCallsStatus />`
**Arquivo**: `src/components/CompletedCallsStatus.jsx`

Componente que exibe status das chamadas realizadas.

**Funcionalidades**:
- Lista de chamadas do mês
- Status visual (feita/não feita)
- Estatísticas de presença
- Navegação temporal
- Indicadores de progresso

#### `<TeacherStats />`
**Arquivo**: `src/components/TeacherStats.jsx`

Componente com estatísticas do professor.

**Funcionalidades**:
- Gráfico de frequência semanal
- Estatísticas de atividades
- Desempenho das turmas
- Comparativos mensais
- Métricas de avaliação

#### `<TokenWarning />`
**Arquivo**: `src/components/TokenWarning.jsx`

Componente de aviso sobre expiração de token.

**Funcionalidades**:
- Detecção automática de expiração
- Aviso visual ao usuário
- Contagem regressiva
- Opção de renovação

#### `<StatusIcon />`
**Arquivo**: `src/components/StatusIcon.jsx`

Ícones padronizados para diferentes status.

**Props**:
- `status` (string): Status a ser representado
- `size` (string): Tamanho do ícone

---

## Form Components

### Patterns de Formulário

#### Validação Padrão
```jsx
const [errors, setErrors] = useState({});

const validateForm = (data) => {
  const newErrors = {};

  if (!data.name) newErrors.name = 'Nome é obrigatório';
  if (!data.email) newErrors.email = 'Email é obrigatório';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm(formData)) return;

  try {
    await submitData(formData);
    toast.success('Dados salvos com sucesso!');
  } catch (error) {
    toast.error('Erro ao salvar dados');
  }
};
```

#### Exemplo de Formulário Completo
```jsx
const UserForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState(user || {});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nome Completo"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={loading}
          loadingText="Salvando..."
        >
          Salvar
        </Button>
      </div>
    </form>
  );
};
```

---

## Padrões de Uso

### Importações Padrão
```jsx
// UI Components
import { Loading, Card, StatCard, EmptyState, Button } from '../components/ui';

// Específicos
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
```

### Estrutura de Página Típica
```jsx
const MyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await api.get('/endpoint');
      setData(result.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Carregando dados..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Título da Página</h1>
        <p className="text-gray-600">Descrição da página</p>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon={FileX}
          title="Nenhum item encontrado"
          message="Não há dados para exibir."
        />
      ) : (
        <Card>
          {/* Conteúdo da página */}
        </Card>
      )}
    </div>
  );
};
```

### Estados de Loading
```jsx
// Loading da página inteira
if (loading) return <Loading text="Carregando..." />;

// Loading inline
{loadingSubmit && <InlineLoading text="Salvando..." />}

// Loading em botão
<Button loading={isSubmitting} loadingText="Processando...">
  Enviar
</Button>
```

### Tratamento de Erros
```jsx
// Toast de erro
toast.error('Mensagem de erro');

// Estado de erro em formulário
<FormInput error={fieldError} />

// Página de erro
<EmptyState
  icon={AlertTriangle}
  title="Erro ao carregar"
  message="Tente novamente em alguns instantes."
  action={<Button onClick={retry}>Tentar Novamente</Button>}
/>
```

### Responsividade
```jsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</div>

// Texto responsivo
<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
  Título Responsivo
</h1>

// Espaçamento responsivo
<div className="p-4 md:p-6 lg:p-8">
  Conteúdo com padding responsivo
</div>
```

---

## Customização

### Tema de Cores
As cores padrão podem ser customizadas através do Tailwind CSS:

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### Componentes Personalizados
```jsx
// Extensão de componente existente
const CustomCard = ({ variant = 'default', ...props }) => {
  const variantClasses = {
    default: 'bg-white',
    highlighted: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <Card
      className={`${variantClasses[variant]} ${props.className}`}
      {...props}
    />
  );
};
```

### Novos Componentes
```jsx
// Template para novo componente
const NewComponent = ({
  // Props obrigatórias
  requiredProp,

  // Props opcionais com default
  optionalProp = 'default value',

  // Props de estilo
  className = '',

  // Event handlers
  onClick,

  // Children
  children,

  // Spread props
  ...props
}) => {
  // Lógica do componente
  const [state, setState] = useState();

  // Classes CSS
  const baseClasses = 'base-styles';
  const finalClasses = `${baseClasses} ${className}`;

  return (
    <div className={finalClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

// PropTypes (opcional mas recomendado)
NewComponent.propTypes = {
  requiredProp: PropTypes.string.isRequired,
  optionalProp: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node
};
```

---

*Documentação dos componentes atualizada em: Outubro 2025*
