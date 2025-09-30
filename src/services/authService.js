import api from "./api";
import { isTokenExpired, decodeJWT } from "../utils/jwt";

// Sistema de notificação para mudanças de autenticação
const authListeners = [];

export const authService = {
  // Adicionar listener para mudanças de autenticação
  addAuthListener(callback) {
    authListeners.push(callback);
  },

  // Remover listener
  removeAuthListener(callback) {
    const index = authListeners.indexOf(callback);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  },

  // Notificar todos os listeners sobre mudanças
  notifyAuthChange() {
    authListeners.forEach((callback) => callback());
  },
  async login(username, password) {
    try {
      const response = await api.post("/auth/login", { username, password });
      const token = response.data;

      // Decodificar o JWT para obter informações do usuário
      const payload = JSON.parse(atob(token.split(".")[1]));

      const user = {
        username: payload.sub,
        role: payload.role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Notificar sobre mudança de autenticação
      this.notifyAuthChange();

      return { token, user };
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Notificar sobre mudança de autenticação
    this.notifyAuthChange();
  },

  getCurrentUser() {
    // Verifica se o token está expirado antes de retornar o usuário
    if (!this.isTokenValid()) {
      return null;
    }

    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    const token = localStorage.getItem("token");

    // Verifica se o token está expirado
    if (token && isTokenExpired(token)) {
      this.clearExpiredToken();
      return null;
    }

    return token;
  },

  isAuthenticated() {
    return !!this.getToken() && this.isTokenValid();
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  isAdmin() {
    return this.hasRole("ROLE_ADMIN");
  },

  isTeacher() {
    return this.hasRole("ROLE_TEACHER");
  },

  isStudent() {
    return this.hasRole("ROLE_STUDENT");
  },

  /**
   * Verifica se o token atual é válido (existe e não está expirado)
   * @returns {boolean}
   */
  isTokenValid() {
    const token = localStorage.getItem("token");

    if (!token) return false;

    if (isTokenExpired(token)) {
      this.clearExpiredToken();
      return false;
    }

    return true;
  },

  /**
   * Limpa o token expirado do localStorage e notifica os listeners
   */
  clearExpiredToken() {
    console.log("Token expirado detectado. Limpando dados de autenticação...");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Notificar sobre mudança de autenticação
    this.notifyAuthChange();

    // Redirecionar para login se não estivermos já lá
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  },

  /**
   * Verifica periodicamente se o token está expirado
   * Útil para limpar tokens que expiraram enquanto o usuário estava usando a aplicação
   */
  startTokenExpirationCheck() {
    // Verifica a cada 30 segundos
    this.tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        this.clearExpiredToken();
      }
    }, 30000);
  },

  /**
   * Para a verificação periódica de expiração do token
   */
  stopTokenExpirationCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  },

  /**
   * Obtém informações detalhadas do token JWT
   * @returns {object|null}
   */
  getTokenInfo() {
    const token = this.getToken();
    if (!token) return null;

    return decodeJWT(token);
  },
};
