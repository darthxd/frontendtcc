import axios from "axios";
import { isTokenExpired } from "../utils/jwt";

const API_BASE_URL = import.meta.env.VITE_API_URI;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Verifica se o token existe e se não está expirado
    if (token) {
      if (isTokenExpired(token)) {
        // Token expirado - limpa localStorage e redireciona
        console.log(
          "Token expirado detectado no interceptor. Limpando dados...",
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(new Error("Token expirado"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Trata erros de autenticação e autorização
    if (error.response?.status === 401) {
      console.log("Erro 401 recebido. Token inválido ou expirado.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Só redireciona se não estivermos já na página de login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Trata erro de acesso negado (403)
    if (error.response?.status === 403) {
      console.log("Erro 403 recebido. Acesso negado.");
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

export default api;
