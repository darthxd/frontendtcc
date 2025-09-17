import api from "./api";

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
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
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
};
