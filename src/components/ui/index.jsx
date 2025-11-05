/**
 * Componentes UI reutilizáveis para elementos comuns
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

// ==================== LOADING COMPONENTS ====================

/**
 * Spinner de carregamento reutilizável
 * @param {Object} props - Propriedades do componente
 * @param {string} props.size - Tamanho do spinner (sm, md, lg, xl)
 * @param {string} props.color - Cor do spinner
 * @param {string} props.className - Classes CSS adicionais
 */
export const Spinner = ({
  size = 'md',
  color = 'border-primary-600',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${color} ${sizeClasses[size]} ${className}`}
    />
  );
};

/**
 * Loading completo com texto e centralização
 * @param {Object} props - Propriedades do componente
 * @param {string} props.text - Texto de carregamento
 * @param {string} props.size - Tamanho do loading
 * @param {string} props.className - Classes CSS adicionais
 */
export const Loading = ({
  text = 'Carregando...',
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`flex flex-col justify-center items-center py-8 ${className}`}>
      <Spinner size={size} />
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};

/**
 * Loading para páginas inteiras
 * @param {Object} props - Propriedades do componente
 * @param {string} props.text - Texto de carregamento
 */
export const PageLoading = ({ text = 'Carregando...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );
};

/**
 * Loading inline com spinner pequeno
 * @param {Object} props - Propriedades do componente
 * @param {string} props.text - Texto de carregamento
 * @param {string} props.className - Classes CSS adicionais
 */
export const InlineLoading = ({ text, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Spinner size="sm" />
      {text && <span className="ml-2 text-sm text-gray-500">{text}</span>}
    </div>
  );
};

// ==================== CARD COMPONENTS ====================

/**
 * Card básico reutilizável
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do card
 * @param {string} props.className - Classes CSS adicionais
 * @param {Function} props.onClick - Função de clique
 */
export const Card = ({ children, className = '', onClick }) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/**
 * Card de estatística
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título da estatística
 * @param {string|number} props.value - Valor da estatística
 * @param {React.Component} props.icon - Ícone
 * @param {string} props.color - Cor de fundo do ícone
 * @param {string} props.subtitle - Subtítulo opcional
 * @param {Function} props.onClick - Função de clique
 */
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

// ==================== EMPTY STATE COMPONENTS ====================

/**
 * Estado vazio reutilizável
 * @param {Object} props - Propriedades do componente
 * @param {React.Component} props.icon - Ícone do estado vazio
 * @param {string} props.title - Título
 * @param {string} props.message - Mensagem
 * @param {React.ReactNode} props.action - Ação opcional (botão, etc.)
 */
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

// ==================== BADGE COMPONENTS ====================

/**
 * Badge de status reutilizável
 * @param {Object} props - Propriedades do componente
 * @param {string} props.status - Status a ser exibido
 * @param {string} props.text - Texto personalizado
 * @param {string} props.color - Cor personalizada
 * @param {string} props.size - Tamanho do badge
 */
export const StatusBadge = ({
  status,
  text,
  color,
  size = 'md',
  className = ''
}) => {
  const statusColors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const finalColor = color || statusColors[status] || statusColors.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${finalColor} ${sizes[size]} ${className}`}
    >
      {text || status}
    </span>
  );
};

// ==================== BUTTON COMPONENTS ====================

/**
 * Botão com loading
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do botão
 * @param {boolean} props.loading - Se está carregando
 * @param {string} props.loadingText - Texto durante carregamento
 * @param {string} props.variant - Variante do botão
 * @param {string} props.size - Tamanho do botão
 * @param {boolean} props.disabled - Se está desabilitado
 */
export const Button = ({
  children,
  loading = false,
  loadingText = 'Carregando...',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" color="border-current" className="mr-2" />}
      {loading ? loadingText : children}
    </button>
  );
};

// ==================== FORM COMPONENTS ====================

/**
 * Input com label
 * @param {Object} props - Propriedades do componente
 * @param {string} props.label - Label do input
 * @param {string} props.error - Mensagem de erro
 * @param {boolean} props.required - Se é obrigatório
 * @param {string} props.className - Classes CSS adicionais
 */
export const FormInput = ({
  label,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// ==================== MODAL COMPONENTS ====================

/**
 * Modal básico
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar
 * @param {string} props.title - Título do modal
 * @param {React.ReactNode} props.children - Conteúdo do modal
 * @param {React.ReactNode} props.footer - Rodapé do modal
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]}`}>
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          )}
          <div className="px-6 py-4">
            {children}
          </div>
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== TABLE COMPONENTS ====================

/**
 * Tabela responsiva básica
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.headers - Cabeçalhos da tabela
 * @param {React.ReactNode} props.children - Conteúdo da tabela
 * @param {boolean} props.loading - Se está carregando
 */
export const Table = ({ headers, children, loading, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {headers && (
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={headers?.length || 1} className="px-6 py-4">
                <Loading text="Carregando dados..." />
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};
