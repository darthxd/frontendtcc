import api from "./api";
import { getUnitIdFromToken } from "../utils/jwt";

export const adminService = {
  /**
   * Busca todos os administradores
   * @returns {Promise<Array>} Lista de administradores
   */
  async getAllAdmins() {
    try {
      const response = await api.get("/admin");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar administradores:", error);
      throw new Error("Não foi possível buscar os administradores");
    }
  },

  /**
   * Busca um administrador por ID
   * @param {number} id - ID do administrador
   * @returns {Promise<Object>} Dados do administrador
   */
  async getAdminById(id) {
    try {
      const response = await api.get(`/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar administrador ${id}:`, error);
      throw new Error("Não foi possível buscar o administrador");
    }
  },

  /**
   * Busca um administrador por username
   * @param {string} username - Username do administrador
   * @returns {Promise<Object>} Dados do administrador
   */
  async getAdminByUsername(username) {
    try {
      const response = await api.get(`/admin/username/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar administrador ${username}:`, error);
      throw new Error("Não foi possível buscar o administrador");
    }
  },

  /**
   * Cria um novo administrador
   * @param {Object} data - Dados do administrador
   * @param {string} data.name - Nome completo do administrador
   * @param {string} data.username - Nome de usuário
   * @param {string} data.password - Senha
   * @param {number} data.unitId - ID da unidade escolar
   * @returns {Promise<Object>} Administrador criado
   */
  async createAdmin(data) {
    try {
      // Se unitId não foi fornecido, obter do token JWT
      const unitId = data.unitId || getUnitIdFromToken();

      if (!unitId) {
        throw new Error(
          "Unidade escolar não encontrada. Faça login novamente.",
        );
      }

      const response = await api.post("/admin", {
        name: data.name,
        username: data.username,
        password: data.password,
        unitId: unitId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
      throw new Error(
        error.response?.data?.message ||
          "Não foi possível criar o administrador",
      );
    }
  },

  /**
   * Atualiza um administrador existente
   * @param {number} id - ID do administrador
   * @param {Object} data - Dados atualizados
   * @returns {Promise<Object>} Administrador atualizado
   */
  async updateAdmin(id, data) {
    try {
      const response = await api.put(`/admin/${id}`, {
        name: data.name,
        username: data.username,
        password: data.password,
        unitId: data.unitId,
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar administrador ${id}:`, error);
      throw new Error("Não foi possível atualizar o administrador");
    }
  },

  /**
   * Deleta um administrador
   * @param {number} id - ID do administrador
   * @returns {Promise<void>}
   */
  async deleteAdmin(id) {
    try {
      await api.delete(`/admin/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar administrador ${id}:`, error);
      throw new Error("Não foi possível deletar o administrador");
    }
  },

  /**
   * Reseta todas as biometrias cadastradas
   * @returns {Promise<string>} Mensagem de sucesso
   */
  async resetBiometry() {
    try {
      const response = await api.post("/admin/biometry/reset");
      return response.data;
    } catch (error) {
      console.error("Erro ao resetar biometrias:", error);
      throw new Error("Não foi possível resetar as biometrias");
    }
  },

  /**
   * Valida os dados de um administrador
   * @param {Object} data - Dados a validar
   * @returns {Array<string>} Array de erros (vazio se válido)
   */
  validateAdminData(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push("Nome é obrigatório");
    }

    if (!data.username || data.username.trim().length < 3) {
      errors.push("Nome de usuário deve ter pelo menos 3 caracteres");
    }

    if (!data.password || data.password.length < 6) {
      errors.push("Senha deve ter pelo menos 6 caracteres");
    }

    if (!data.unitId) {
      errors.push("Unidade escolar é obrigatória");
    }

    return errors;
  },
};
