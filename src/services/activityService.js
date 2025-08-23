import api from "./api";

export const activityService = {
  // Buscar atividade por ID
  getActivityById: async (id) => {
    try {
      const response = await api.get(`/activity/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar atividade:", error);
      throw error;
    }
  },

  // Listar atividades por turma
  listActivitiesBySchoolClass: async (schoolClassId) => {
    try {
      const response = await api.get(`/activity/schoolclass/${schoolClassId}`);
      return response.data || [];
    } catch (error) {
      console.error("Erro ao listar atividades da turma:", error);
      // Retorna array vazio em caso de erro para evitar crashes
      return [];
    }
  },

  // Criar nova atividade
  createActivity: async (activityData) => {
    try {
      const response = await api.post("/activity", activityData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
      throw error;
    }
  },

  // Atualizar atividade
  updateActivity: async (id, activityData) => {
    try {
      const response = await api.put(`/activity/${id}`, activityData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
      throw error;
    }
  },

  // Deletar atividade
  deleteActivity: async (id) => {
    try {
      await api.delete(`/activity/${id}`);
    } catch (error) {
      console.error("Erro ao deletar atividade:", error);
      throw error;
    }
  },

  // Buscar submissão por ID
  getSubmissionById: async (submissionId) => {
    try {
      const response = await api.get(`/activity/submission/${submissionId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar submissão:", error);
      throw error;
    }
  },

  // Listar submissões por estudante
  listSubmissionsByStudent: async (studentId) => {
    try {
      const response = await api.get(
        `/activity/submission/student/${studentId}`,
      );
      return response.data || [];
    } catch (error) {
      console.error("Erro ao listar submissões do estudante:", error);
      // Retorna array vazio em caso de erro
      return [];
    }
  },

  // Listar submissões por atividade
  listSubmissionsByActivity: async (activityId) => {
    try {
      const response = await api.get(`/activity/${activityId}/submission`);
      return response.data || [];
    } catch (error) {
      console.error("Erro ao listar submissões da atividade:", error);
      return [];
    }
  },

  // Submeter atividade
  submitActivity: async (activityId, submissionData) => {
    try {
      const response = await api.post(
        `/activity/submission/${activityId}`,
        submissionData,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao submeter atividade:", error);
      throw error;
    }
  },

  // Submeter nota
  submitGrade: async (submissionId, gradeData) => {
    try {
      const response = await api.post(
        `/activity/submission/${submissionId}/grade`,
        gradeData,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao submeter nota:", error);
      throw error;
    }
  },

  // Buscar dados do estudante por username
  getStudentByUsername: async (username) => {
    try {
      const response = await api.get(`/student/username/${username}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do estudante:", error);
      throw error;
    }
  },

  // Buscar dados do estudante por ID
  getStudentById: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do estudante por ID:", error);
      throw error;
    }
  },

  // Buscar dados do professor por username
  getTeacherByUsername: async (username) => {
    try {
      const response = await api.get(`/teacher/username/${username}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do professor:", error);
      throw error;
    }
  },

  // Buscar turmas do professor
  getSchoolClasses: async () => {
    try {
      const response = await api.get("/schoolclass");
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      return [];
    }
  },

  // Validar dados de atividade
  validateActivityData: (data) => {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push("Título é obrigatório");
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push("Descrição é obrigatória");
    }

    if (!data.deadline) {
      errors.push("Prazo é obrigatório");
    } else {
      const deadline = new Date(data.deadline);
      const now = new Date();
      if (deadline <= now) {
        errors.push("Prazo deve ser no futuro");
      }
    }

    if (!data.maxScore || data.maxScore <= 0 || data.maxScore > 10) {
      errors.push("Nota máxima deve estar entre 0 e 10");
    }

    if (!data.schoolClassId) {
      errors.push("Turma é obrigatória");
    }

    return errors;
  },

  // Validar dados de submissão
  validateSubmissionData: (data) => {
    const errors = [];

    if (!data.answerText || data.answerText.trim().length === 0) {
      errors.push("Resposta é obrigatória");
    }

    if (data.fileUrl && !isValidUrl(data.fileUrl)) {
      errors.push("URL do arquivo inválida");
    }

    return errors;
  },
};

// Função auxiliar para validar URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
