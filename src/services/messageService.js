import api from "./api";

/**
 * Serviço para gerenciar mensagens no sistema
 */
export const messageService = {
  /**
   * Criar uma nova mensagem
   * @param {Object} messageData - Dados da mensagem
   * @param {string} messageData.title - Título da mensagem
   * @param {string} messageData.body - Corpo da mensagem
   * @param {string} messageData.target - Tipo de mensagem (GLOBAL, CLASS, PRIVATE)
   * @param {number} messageData.authorId - ID do autor
   * @param {number} messageData.schoolClassId - ID da turma (para mensagens CLASS)
   * @param {number} messageData.targetId - ID do destinatário (para mensagens PRIVATE)
   * @returns {Promise<Object>} Mensagem criada
   */
  async createMessage(messageData) {
    try {
      const response = await api.post("/message", messageData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar mensagem:", error);
      throw error;
    }
  },

  /**
   * Buscar todas as mensagens
   * @returns {Promise<Array>} Lista de todas as mensagens
   */
  async getAllMessages() {
    try {
      const response = await api.get("/message");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      throw error;
    }
  },

  /**
   * Buscar mensagens visíveis para um usuário específico
   * @param {number} userId - ID do usuário
   * @returns {Promise<Array>} Lista de mensagens visíveis
   */
  async getVisibleMessages(userId) {
    try {
      const response = await api.get(`/message/visible/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar mensagens visíveis:", error);
      throw error;
    }
  },

  /**
   * Atualizar uma mensagem existente
   * @param {number} messageId - ID da mensagem
   * @param {Object} messageData - Dados atualizados da mensagem
   * @returns {Promise<Object>} Mensagem atualizada
   */
  async updateMessage(messageId, messageData) {
    try {
      const response = await api.put(`/message/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar mensagem:", error);
      throw error;
    }
  },

  /**
   * Deletar uma mensagem
   * @param {number} messageId - ID da mensagem
   * @returns {Promise<void>}
   */
  async deleteMessage(messageId) {
    try {
      await api.delete(`/message/${messageId}`);
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      throw error;
    }
  },

  /**
   * Buscar todas as turmas (para seleção ao enviar mensagens)
   * @returns {Promise<Array>} Lista de turmas
   */
  async getAllClasses() {
    try {
      const response = await api.get("/schoolclass");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      throw error;
    }
  },

  /**
   * Buscar todos os professores (para mensagens privadas de alunos)
   * @returns {Promise<Array>} Lista de professores
   */
  async getAllTeachers() {
    try {
      const response = await api.get("/teacher");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      throw error;
    }
  },

  /**
   * Buscar todos os usuários (para admins)
   * @returns {Promise<Array>} Lista de todos os usuários
   */
  async getAllUsers() {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  /**
   * Buscar usuários excluindo admins
   * (para secretaria, coordenador e professor)
   * @returns {Promise<Array>} Lista de usuários não-admin
   */
  async getUsersExcludingAdmins() {
    try {
      const response = await api.get("/user");
      const users = response.data;
      // Filtrar para remover admins
      return users.filter((user) => user.role !== "ROLE_ADMIN");
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  /**
   * Buscar usuários excluindo admins e alunos
   * (para alunos enviarem mensagens)
   * @returns {Promise<Array>} Lista de usuários não-admin e não-aluno
   */
  async getUsersExcludingAdminsAndStudents() {
    try {
      const response = await api.get("/user");
      const users = response.data;
      // Filtrar para remover admins e alunos
      return users.filter(
        (user) => user.role !== "ROLE_ADMIN" && user.role !== "ROLE_STUDENT",
      );
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  /**
   * Buscar usuário por ID
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Dados do usuário
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  },
};

export default messageService;
