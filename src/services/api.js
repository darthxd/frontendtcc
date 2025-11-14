import axios from "axios";
import { isTokenExpired } from "../utils/jwt";

console.log("=== api.js: Módulo carregado ===");
console.log("axios disponível?", typeof axios !== "undefined");
console.log("axios version:", axios.VERSION || "desconhecida");
console.log(
  "XMLHttpRequest disponível?",
  typeof XMLHttpRequest !== "undefined",
);
console.log("fetch disponível?", typeof fetch !== "undefined");

// Variável para armazenar a instância (será criada apenas quando solicitada)
let apiInstance = null;
let interceptorsConfigured = false;

/**
 * Determina a URL base da API de forma segura
 */
function getApiBaseUrl() {
  try {
    const envUrl = import.meta.env.VITE_API_URI;

    console.log("getApiBaseUrl: VITE_API_URI =", envUrl);
    console.log("getApiBaseUrl: MODE =", import.meta.env.MODE);
    console.log("getApiBaseUrl: PROD =", import.meta.env.PROD);

    // Se VITE_API_URI está definido e não é vazio, usa ele
    if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
      console.log("✅ Usando URL da variável de ambiente:", envUrl);
      return envUrl;
    }

    // Se estamos em produção e a URL está vazia, API está no mesmo domínio
    if (import.meta.env.PROD) {
      if (typeof window !== "undefined" && window.location) {
        const url = `${window.location.origin}/api`;
        console.log("✅ Produção: usando window.location.origin:", url);
        return url;
      }
      console.log("⚠️ Produção: window não disponível, usando path relativo");
      return "/api";
    }

    // Desenvolvimento
    console.log("✅ Desenvolvimento: usando localhost:8080");
    return "http://localhost:8080/api";
  } catch (error) {
    console.error("❌ Erro ao determinar API Base URL:", error);
    return "/api"; // Fallback seguro
  }
}

/**
 * Cria a instância do axios (chamada apenas quando necessário)
 */
function createApiInstance() {
  console.log("=== createApiInstance: INICIANDO ===");

  try {
    const baseURL = getApiBaseUrl();
    console.log("createApiInstance: baseURL determinada =", baseURL);

    // Configuração MÍNIMA e EXPLÍCITA
    // Não especificamos adapter - deixamos o axios escolher
    // mas adicionamos configurações para garantir compatibilidade
    const config = {
      baseURL: baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      // Força o axios a validar todos os status codes
      // para evitar problemas com o fetch adapter
      validateStatus: function (status) {
        return status >= 200 && status < 600;
      },
    };

    console.log("createApiInstance: config =", JSON.stringify(config));
    console.log("createApiInstance: chamando axios.create()...");

    // Tenta criar a instância
    const instance = axios.create(config);

    console.log("✅ createApiInstance: Instância criada com sucesso!");
    console.log("createApiInstance: typeof instance =", typeof instance);
    console.log(
      "createApiInstance: instance.get existe?",
      typeof instance.get === "function",
    );
    console.log(
      "createApiInstance: instance.post existe?",
      typeof instance.post === "function",
    );

    // Testa se a instância realmente funciona
    console.log("createApiInstance: testando instância...");
    if (typeof instance.get !== "function") {
      throw new Error("Instância criada mas método get não existe");
    }

    return instance;
  } catch (error) {
    console.error("❌ ERRO CRÍTICO ao criar instância do axios!");
    console.error("Erro:", error);
    console.error("Tipo:", error.constructor.name);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    // Verifica se é o erro de destructuring
    if (error.message && error.message.includes("undefined")) {
      console.error("🎯 ESTE É O ERRO DE DESTRUCTURING!");
      console.error("Tentando workaround com axios default...");
    }

    // Se falhar, retorna o axios default como último recurso
    console.warn("⚠️ Retornando axios default devido ao erro");

    // Configura o baseURL no axios default
    if (axios.defaults) {
      axios.defaults.baseURL = getApiBaseUrl();
      console.log("✅ baseURL configurada no axios.defaults");
    }

    return axios;
  }
}

/**
 * Configura os interceptors (chamada apenas uma vez, quando necessário)
 */
function setupInterceptors(instance) {
  if (interceptorsConfigured) {
    console.log("setupInterceptors: Já configurados, pulando...");
    return;
  }

  console.log("=== setupInterceptors: INICIANDO ===");

  try {
    // Request Interceptor
    instance.interceptors.request.use(
      (config) => {
        if (!config) {
          console.error("❌ Request interceptor: config é undefined");
          return Promise.reject(new Error("Request config is undefined"));
        }

        if (!config.headers) {
          config.headers = {};
        }

        try {
          const token = localStorage.getItem("token");

          if (token) {
            if (isTokenExpired(token)) {
              console.log("Token expirado detectado. Limpando dados...");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              return Promise.reject(new Error("Token expirado"));
            }

            config.headers.Authorization = `Bearer ${token}`;
          }

          return config;
        } catch (error) {
          console.error("❌ Erro no request interceptor:", error);
          return Promise.reject(error);
        }
      },
      (error) => {
        console.error("❌ Request interceptor error handler:", error);
        return Promise.reject(error);
      },
    );

    // Response Interceptor
    instance.interceptors.response.use(
      (response) => {
        if (!response) {
          console.error("❌ Response interceptor: response é undefined");
          return Promise.reject(new Error("Response is undefined"));
        }
        return response;
      },
      (error) => {
        try {
          if (error.response?.status === 401) {
            console.log("Erro 401: Token inválido ou expirado");
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (
              typeof window !== "undefined" &&
              window.location.pathname !== "/login"
            ) {
              window.location.href = "/login";
            }
          }

          if (error.response?.status === 403) {
            console.log("Erro 403: Acesso negado");
            if (typeof window !== "undefined") {
              window.location.href = "/unauthorized";
            }
          }

          return Promise.reject(error);
        } catch (interceptorError) {
          console.error("❌ Erro no response interceptor:", interceptorError);
          return Promise.reject(error);
        }
      },
    );

    interceptorsConfigured = true;
    console.log("✅ setupInterceptors: Interceptors configurados com sucesso");
  } catch (error) {
    console.error("❌ Erro ao configurar interceptors:", error);
  }
}

/**
 * Obtém a instância do axios (lazy initialization)
 */
function getApiInstance() {
  console.log("getApiInstance: Chamada");

  if (!apiInstance) {
    console.log("getApiInstance: Instância não existe, criando...");
    apiInstance = createApiInstance();

    if (apiInstance) {
      console.log("getApiInstance: Configurando interceptors...");
      setupInterceptors(apiInstance);
    }
  } else {
    console.log("getApiInstance: Usando instância existente");
  }

  return apiInstance;
}

/**
 * API object com lazy initialization
 * Todas as chamadas passam por aqui e garantem que a instância existe
 */
const api = {
  get(url, config) {
    console.log(`api.get: ${url}`);
    const instance = getApiInstance();
    return instance.get(url, config);
  },

  post(url, data, config) {
    console.log(`api.post: ${url}`);
    const instance = getApiInstance();
    return instance.post(url, data, config);
  },

  put(url, data, config) {
    console.log(`api.put: ${url}`);
    const instance = getApiInstance();
    return instance.put(url, data, config);
  },

  delete(url, config) {
    console.log(`api.delete: ${url}`);
    const instance = getApiInstance();
    return instance.delete(url, config);
  },

  patch(url, data, config) {
    console.log(`api.patch: ${url}`);
    const instance = getApiInstance();
    return instance.patch(url, data, config);
  },

  // Permite acessar a instância diretamente se necessário
  getInstance() {
    return getApiInstance();
  },
};

console.log(
  "=== api.js: Módulo exportado (nenhuma inicialização automática) ===",
);

export default api;
