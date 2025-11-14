import { useMemo } from "react";

/**
 * Hook personalizado que garante que um valor é sempre um array
 * Previne erros "x.map is not a function"
 *
 * @param {any} value - Valor que deve ser um array
 * @param {Array} fallback - Array de fallback se o valor não for válido
 * @returns {Array} Array válido
 *
 * @example
 * const items = useSafeArray(data?.items, []);
 * const users = useSafeArray(response?.users);
 */
export function useSafeArray(value, fallback = []) {
  return useMemo(() => {
    // Se o valor já é um array válido, retorna ele
    if (Array.isArray(value)) {
      console.log("useSafeArray: Valor é array válido, length =", value.length);
      return value;
    }

    // Se o valor é null ou undefined, retorna o fallback
    if (value === null || value === undefined) {
      console.warn("useSafeArray: Valor é null/undefined, usando fallback");
      return Array.isArray(fallback) ? fallback : [];
    }

    // Se o valor é um objeto iterável (como NodeList, Set, Map.values(), etc)
    if (value && typeof value[Symbol.iterator] === "function") {
      console.log("useSafeArray: Valor é iterável, convertendo para array");
      try {
        return Array.from(value);
      } catch (error) {
        console.error("useSafeArray: Erro ao converter iterável:", error);
        return Array.isArray(fallback) ? fallback : [];
      }
    }

    // Se o valor é um objeto comum, tenta converter suas values em array
    if (typeof value === "object") {
      console.warn("useSafeArray: Valor é objeto, tentando Object.values()");
      try {
        return Object.values(value);
      } catch (error) {
        console.error("useSafeArray: Erro ao converter objeto:", error);
        return Array.isArray(fallback) ? fallback : [];
      }
    }

    // Se nada funcionar, retorna o fallback
    console.error(
      "useSafeArray: Valor não é conversível para array, tipo:",
      typeof value,
      "valor:",
      value,
    );
    return Array.isArray(fallback) ? fallback : [];
  }, [value, fallback]);
}

/**
 * Função helper para garantir que um valor é um array (sem usar hook)
 * Útil para usar fora de componentes React
 *
 * @param {any} value - Valor que deve ser um array
 * @param {Array} fallback - Array de fallback se o valor não for válido
 * @returns {Array} Array válido
 *
 * @example
 * const items = ensureArray(data?.items, []);
 * const filtered = ensureArray(response).filter(x => x.active);
 */
export function ensureArray(value, fallback = []) {
  // Se o valor já é um array válido, retorna ele
  if (Array.isArray(value)) {
    return value;
  }

  // Se o valor é null ou undefined, retorna o fallback
  if (value === null || value === undefined) {
    return Array.isArray(fallback) ? fallback : [];
  }

  // Se o valor é um objeto iterável
  if (value && typeof value[Symbol.iterator] === "function") {
    try {
      return Array.from(value);
    } catch (error) {
      console.error("ensureArray: Erro ao converter iterável:", error);
      return Array.isArray(fallback) ? fallback : [];
    }
  }

  // Se o valor é um objeto comum, tenta converter suas values em array
  if (typeof value === "object") {
    try {
      return Object.values(value);
    } catch (error) {
      console.error("ensureArray: Erro ao converter objeto:", error);
      return Array.isArray(fallback) ? fallback : [];
    }
  }

  // Se é um valor primitivo único, coloca em array
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [value];
  }

  // Se nada funcionar, retorna o fallback
  return Array.isArray(fallback) ? fallback : [];
}

/**
 * Hook para arrays que vêm de APIs e podem estar carregando
 *
 * @param {any} value - Valor que deve ser um array
 * @param {boolean} isLoading - Se os dados ainda estão carregando
 * @param {Array} fallback - Array de fallback
 * @returns {Array} Array válido
 *
 * @example
 * const [data, setData] = useState(null);
 * const [loading, setLoading] = useState(true);
 * const items = useSafeArrayLoading(data?.items, loading, []);
 */
export function useSafeArrayLoading(value, isLoading = false, fallback = []) {
  return useMemo(() => {
    // Se ainda está carregando, retorna array vazio
    if (isLoading) {
      console.log("useSafeArrayLoading: Carregando, retornando []");
      return [];
    }

    // Usa a função ensureArray para o resto
    return ensureArray(value, fallback);
  }, [value, isLoading, fallback]);
}

/**
 * Hook para validar array e seus elementos
 *
 * @param {any} value - Valor que deve ser um array
 * @param {Function} validator - Função para validar cada elemento (opcional)
 * @param {Array} fallback - Array de fallback
 * @returns {Array} Array válido com elementos validados
 *
 * @example
 * const validUsers = useSafeArrayWithValidation(
 *   users,
 *   (user) => user && user.id && user.name,
 *   []
 * );
 */
export function useSafeArrayWithValidation(
  value,
  validator = null,
  fallback = [],
) {
  return useMemo(() => {
    const arr = ensureArray(value, fallback);

    // Se não há validador, retorna o array
    if (typeof validator !== "function") {
      return arr;
    }

    // Filtra elementos que passam na validação
    try {
      return arr.filter((item, index) => {
        try {
          return validator(item, index);
        } catch (error) {
          console.error(
            "useSafeArrayWithValidation: Erro ao validar item",
            index,
            error,
          );
          return false;
        }
      });
    } catch (error) {
      console.error(
        "useSafeArrayWithValidation: Erro ao filtrar array:",
        error,
      );
      return Array.isArray(fallback) ? fallback : [];
    }
  }, [value, validator, fallback]);
}

/**
 * Função helper para debugar problemas com arrays
 *
 * @param {any} value - Valor para debugar
 * @param {string} label - Label para identificar no log
 */
export function debugArrayValue(value, label = "Array") {
  console.group(`🔍 Debug Array: ${label}`);
  console.log("Valor:", value);
  console.log("Tipo:", typeof value);
  console.log("É array?", Array.isArray(value));
  console.log("É null?", value === null);
  console.log("É undefined?", value === undefined);
  console.log("É iterável?", value && typeof value[Symbol.iterator] === "function");

  if (value && typeof value === "object") {
    console.log("Keys:", Object.keys(value));
    console.log("Constructor:", value.constructor?.name);
  }

  if (Array.isArray(value)) {
    console.log("Length:", value.length);
    console.log("Primeiro elemento:", value[0]);
    console.log("Último elemento:", value[value.length - 1]);
  }

  console.groupEnd();
}

export default useSafeArray;
