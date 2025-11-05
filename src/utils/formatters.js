/**
 * Utilitários para formatação de dados e componentes reutilizáveis
 */

// ==================== FORMATADORES DE DATA ====================

/**
 * Formata uma data para exibição em português brasileiro
 * @param {string|Date} dateString - Data a ser formatada
 * @param {Object} options - Opções de formatação
 * @returns {string} Data formatada
 */
export const formatDate = (dateString, options = {}) => {
  try {
    if (!dateString) return 'Data não informada';

    const date = new Date(dateString);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

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

/**
 * Formata uma data com hora para exibição
 * @param {string|Date} dateString - Data a ser formatada
 * @param {Object} options - Opções de formatação
 * @returns {string} Data e hora formatadas
 */
export const formatDateTime = (dateString, options = {}) => {
  try {
    if (!dateString) return 'Data não informada';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    };

    return date.toLocaleString('pt-BR', { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return 'Data inválida';
  }
};

/**
 * Formata data longa com dia da semana
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} Data formatada com dia da semana
 */
export const formatLongDate = (dateString) => {
  return formatDate(dateString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formata data curta com dia da semana
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} Data formatada curta
 */
export const formatShortDate = (dateString) => {
  return formatDate(dateString, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  });
};

/**
 * Formata apenas mês e ano
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} Mês e ano formatados
 */
export const formatMonthYear = (dateString) => {
  return formatDate(dateString, {
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns {string} Data atual formatada
 */
export const getCurrentDate = () => {
  const today = new Date();
  return today.toLocaleDateString('sv-SE'); // formato YYYY-MM-DD
};

/**
 * Formata data para input HTML (YYYY-MM-DD)
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} Data no formato para input
 */
export const formatDateForInput = (dateString) => {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('sv-SE');
  } catch (error) {
    console.error('Erro ao formatar data para input:', error);
    return '';
  }
};

// ==================== FORMATADORES DE DOCUMENTOS ====================

/**
 * Formata CPF para exibição
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} CPF formatado
 */
export const formatCPF = (cpf) => {
  if (!cpf) return 'Não informado';

  try {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return cpf; // Retorna original se não tiver 11 dígitos

    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } catch (error) {
    console.error('Erro ao formatar CPF:', error);
    return cpf;
  }
};

/**
 * Formata telefone para exibição
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return 'Não informado';

  try {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone; // Retorna original se não conseguir formatar
  } catch (error) {
    console.error('Erro ao formatar telefone:', error);
    return phone;
  }
};

// ==================== FORMATADORES DE NÚMEROS ====================

/**
 * Formata número para percentual
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais
 * @returns {string} Percentual formatado
 */
export const formatPercentage = (value, decimals = 1) => {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata nota com uma casa decimal
 * @param {number} grade - Nota a ser formatada
 * @returns {string} Nota formatada
 */
export const formatGrade = (grade) => {
  if (grade === null || grade === undefined || isNaN(grade)) {
    return 'N/A';
  }
  return grade.toFixed(1);
};

// ==================== FORMATADORES DE TEXTO ====================

/**
 * Capitaliza primeira letra
 * @param {string} str - String a ser capitalizada
 * @returns {string} String com primeira letra maiúscula
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca texto com reticências
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ==================== VALIDADORES ====================

/**
 * Valida se uma data é válida
 * @param {string|Date} dateString - Data a ser validada
 * @returns {boolean} Se a data é válida
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Verifica se uma data é hoje
 * @param {string|Date} dateString - Data a ser verificada
 * @returns {boolean} Se a data é hoje
 */
export const isToday = (dateString) => {
  if (!isValidDate(dateString)) return false;

  const date = new Date(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
};

/**
 * Verifica se uma data é no passado
 * @param {string|Date} dateString - Data a ser verificada
 * @returns {boolean} Se a data é no passado
 */
export const isPastDate = (dateString) => {
  if (!isValidDate(dateString)) return false;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove horas para comparar apenas a data

  return date < today;
};

// ==================== UTILITÁRIOS DE STATUS ====================

/**
 * Obtém configuração de status com cor e texto
 * @param {string} status - Status a ser formatado
 * @returns {Object} Objeto com cor e texto do status
 */
export const getStatusConfig = (status) => {
  const statusMap = {
    'PENDING': {
      color: 'bg-yellow-100 text-yellow-800',
      text: 'Pendente',
      icon: 'Clock'
    },
    'SUBMITTED': {
      color: 'bg-blue-100 text-blue-800',
      text: 'Enviado',
      icon: 'Upload'
    },
    'GRADED': {
      color: 'bg-green-100 text-green-800',
      text: 'Avaliado',
      icon: 'CheckCircle'
    },
    'OVERDUE': {
      color: 'bg-red-100 text-red-800',
      text: 'Atrasado',
      icon: 'AlertTriangle'
    },
    'PRESENT': {
      color: 'text-green-700 bg-green-50',
      text: 'Presente',
      icon: 'CheckCircle'
    },
    'ABSENT': {
      color: 'text-red-700 bg-red-50',
      text: 'Ausente',
      icon: 'XCircle'
    },
    'PARTIAL': {
      color: 'text-yellow-700 bg-yellow-50',
      text: 'Na escola, mas ausente da aula',
      icon: 'AlertCircle'
    }
  };

  return statusMap[status] || {
    color: 'bg-gray-100 text-gray-800',
    text: status || 'Desconhecido',
    icon: 'Help'
  };
};

// ==================== UTILITÁRIOS DE PERFORMANCE ====================

/**
 * Obtém nível de performance baseado na média
 * @param {number} average - Média a ser avaliada
 * @returns {Object} Objeto com nível e cor
 */
export const getPerformanceLevel = (average) => {
  if (isNaN(average)) return { level: 'N/A', color: 'text-gray-600' };

  if (average >= 9) return { level: 'Excelente', color: 'text-green-600' };
  if (average >= 7) return { level: 'Bom', color: 'text-blue-600' };
  if (average >= 5) return { level: 'Regular', color: 'text-yellow-600' };
  return { level: 'Precisa Melhorar', color: 'text-red-600' };
};

/**
 * Obtém nível de frequência
 * @param {number} rate - Taxa de frequência
 * @returns {Object} Objeto com nível e cor
 */
export const getAttendanceLevel = (rate) => {
  if (isNaN(rate)) return { level: 'N/A', color: 'text-gray-600' };

  if (rate >= 90) return { level: 'Excelente', color: 'text-green-600' };
  if (rate >= 80) return { level: 'Boa', color: 'text-blue-600' };
  if (rate >= 70) return { level: 'Regular', color: 'text-yellow-600' };
  return { level: 'Crítica', color: 'text-red-600' };
};

// ==================== UTILITÁRIOS DE ARRAY ====================

/**
 * Remove duplicatas de um array baseado em uma propriedade
 * @param {Array} array - Array a ser processado
 * @param {string} key - Chave para identificar duplicatas
 * @returns {Array} Array sem duplicatas
 */
export const removeDuplicates = (array, key) => {
  if (!Array.isArray(array)) return [];

  const seen = new Set();
  return array.filter(item => {
    const identifier = key ? item[key] : item;
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
};

/**
 * Agrupa array por propriedade
 * @param {Array} array - Array a ser agrupado
 * @param {string} key - Chave para agrupar
 * @returns {Object} Objeto com itens agrupados
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};

  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// ==================== UTILITÁRIOS DE ORDENAÇÃO ====================

/**
 * Ordena array por data
 * @param {Array} array - Array a ser ordenado
 * @param {string} dateKey - Chave da propriedade de data
 * @param {string} order - Ordem (asc ou desc)
 * @returns {Array} Array ordenado
 */
export const sortByDate = (array, dateKey, order = 'desc') => {
  if (!Array.isArray(array)) return [];

  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);

    if (order === 'asc') {
      return dateA - dateB;
    }
    return dateB - dateA;
  });
};

// ==================== UTILITÁRIOS DE BUSCA ====================

/**
 * Filtra array por termo de busca
 * @param {Array} array - Array a ser filtrado
 * @param {string} searchTerm - Termo de busca
 * @param {Array} searchKeys - Chaves onde buscar
 * @returns {Array} Array filtrado
 */
export const filterBySearch = (array, searchTerm, searchKeys = []) => {
  if (!Array.isArray(array) || !searchTerm) return array;

  const term = searchTerm.toLowerCase();

  return array.filter(item => {
    if (searchKeys.length === 0) {
      // Busca em todas as propriedades string
      return Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(term)
      );
    }

    // Busca nas chaves especificadas
    return searchKeys.some(key => {
      const value = item[key];
      return typeof value === 'string' && value.toLowerCase().includes(term);
    });
  });
};
