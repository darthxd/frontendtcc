/**
 * Utilitários para manipulação de JWT
 */

/**
 * Decodifica um token JWT sem verificar a assinatura
 * @param {string} token - O token JWT
 * @returns {object|null} - O payload decodificado ou null se inválido
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));

    return decodedPayload;
  } catch (error) {
    console.error("Erro ao decodificar JWT:", error);
    return null;
  }
};

/**
 * Verifica se um token JWT está expirado
 * @param {string} token - O token JWT
 * @returns {boolean} - true se expirado, false caso contrário
 */
export const isTokenExpired = (token) => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    // exp está em segundos, Date.now() em milissegundos
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch (error) {
    console.error("Erro ao verificar expiração do token:", error);
    return true;
  }
};

/**
 * Obtém o tempo restante para expiração do token em segundos
 * @param {string} token - O token JWT
 * @returns {number} - Tempo restante em segundos (0 se expirado)
 */
export const getTokenExpirationTime = (token) => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = payload.exp - currentTime;

    return Math.max(0, timeRemaining);
  } catch (error) {
    console.error("Erro ao obter tempo de expiração:", error);
    return 0;
  }
};

/**
 * Verifica se o token expira dentro de um determinado tempo
 * @param {string} token - O token JWT
 * @param {number} minutesThreshold - Minutos de antecedência para considerar "próximo do vencimento"
 * @returns {boolean} - true se o token expira dentro do tempo especificado
 */
export const isTokenExpiringSoon = (token, minutesThreshold = 5) => {
  try {
    const timeRemaining = getTokenExpirationTime(token);
    const thresholdInSeconds = minutesThreshold * 60;

    return timeRemaining > 0 && timeRemaining <= thresholdInSeconds;
  } catch (error) {
    console.error("Erro ao verificar proximidade da expiração:", error);
    return false;
  }
};

/**
 * Formata o tempo restante de expiração para exibição
 * @param {string} token - O token JWT
 * @returns {string} - Tempo formatado (ex: "5m 30s", "Expirado")
 */
export const formatTokenExpirationTime = (token) => {
  try {
    const timeRemaining = getTokenExpirationTime(token);

    if (timeRemaining <= 0) return "Expirado";

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  } catch (error) {
    console.error("Erro ao formatar tempo de expiração:", error);
    return "Erro";
  }
};

/**
 * Obtém o unitId do token JWT
 * @param {string} token - O token JWT (opcional, busca do localStorage se não fornecido)
 * @returns {number|null} - O unitId ou null se não encontrado
 */
export const getUnitIdFromToken = (token = null) => {
  try {
    // Se token não foi fornecido, buscar do localStorage
    if (!token) {
      token = localStorage.getItem("token");
    }

    if (!token) return null;

    const payload = decodeJWT(token);
    if (!payload || !payload.unitId) return null;

    return payload.unitId;
  } catch (error) {
    console.error("Erro ao obter unitId do token:", error);
    return null;
  }
};

/**
 * Obtém todas as informações do usuário do token JWT
 * @param {string} token - O token JWT (opcional, busca do localStorage se não fornecido)
 * @returns {object|null} - Objeto com as informações do usuário ou null
 */
export const getUserInfoFromToken = (token = null) => {
  try {
    // Se token não foi fornecido, buscar do localStorage
    if (!token) {
      token = localStorage.getItem("token");
    }

    if (!token) return null;

    const payload = decodeJWT(token);
    if (!payload) return null;

    return {
      username: payload.sub,
      role: payload.role,
      unitId: payload.unitId,
      exp: payload.exp,
      iss: payload.iss,
    };
  } catch (error) {
    console.error("Erro ao obter informações do usuário do token:", error);
    return null;
  }
};
