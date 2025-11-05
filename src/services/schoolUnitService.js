import api from "./api";

export const schoolUnitService = {
  /**
   * Busca todas as unidades escolares disponíveis
   * @returns {Promise<Array>} Lista de unidades escolares
   */
  async getAllSchoolUnits() {
    try {
      const response = await api.get("/schoolunit");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar unidades escolares:", error);
      throw new Error("Não foi possível buscar as unidades escolares");
    }
  },

  /**
   * Busca uma unidade escolar específica por ID
   * @param {number} id - ID da unidade escolar
   * @returns {Promise<Object>} Dados da unidade escolar
   */
  async getSchoolUnitById(id) {
    try {
      const response = await api.get(`/schoolunit/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar unidade escolar ${id}:`, error);
      throw new Error("Não foi possível buscar a unidade escolar");
    }
  },

  /**
   * Cria uma nova unidade escolar
   * @param {Object} data - Dados da unidade escolar
   * @returns {Promise<Object>} Unidade escolar criada
   */
  async createSchoolUnit(data) {
    try {
      const response = await api.post("/schoolunit", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar unidade escolar:", error);
      throw new Error("Não foi possível criar a unidade escolar");
    }
  },

  /**
   * Atualiza uma unidade escolar existente
   * @param {number} id - ID da unidade escolar
   * @param {Object} data - Dados atualizados da unidade escolar
   * @returns {Promise<Object>} Unidade escolar atualizada
   */
  async updateSchoolUnit(id, data) {
    try {
      const response = await api.put(`/schoolunit/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar unidade escolar ${id}:`, error);
      throw new Error("Não foi possível atualizar a unidade escolar");
    }
  },

  /**
   * Exclui uma unidade escolar
   * @param {number} id - ID da unidade escolar
   * @returns {Promise<void>}
   */
  async deleteSchoolUnit(id) {
    try {
      await api.delete(`/schoolunit/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir unidade escolar ${id}:`, error);
      throw new Error("Não foi possível excluir a unidade escolar");
    }
  },
};
