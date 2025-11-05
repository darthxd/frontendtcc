import api from "./api";
import { getUnitIdFromToken } from "../utils/jwt";

export const teacherService = {
  /**
   * Busca todos os professores
   * @returns {Promise<Array>} Lista de professores
   */
  async getAllTeachers() {
    try {
      const response = await api.get("/teacher");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      throw new Error("Não foi possível buscar os professores");
    }
  },

  /**
   * Busca um professor por ID
   * @param {number} id - ID do professor
   * @returns {Promise<Object>} Dados do professor
   */
  async getTeacherById(id) {
    try {
      const response = await api.get(`/teacher/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar professor ${id}:`, error);
      throw new Error("Não foi possível buscar o professor");
    }
  },

  /**
   * Busca um professor por username
   * @param {string} username - Username do professor
   * @returns {Promise<Object>} Dados do professor
   */
  async getTeacherByUsername(username) {
    try {
      const response = await api.get(`/teacher/username/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar professor ${username}:`, error);
      throw new Error("Não foi possível buscar o professor");
    }
  },

  /**
   * Cria um novo professor
   * @param {Object} data - Dados do professor
   * @param {string} data.username - Nome de usuário
   * @param {string} data.password - Senha
   * @param {string} data.name - Nome completo
   * @param {string} data.cpf - CPF
   * @param {string} data.email - Email
   * @param {string} data.phone - Telefone
   * @param {Array<number>} data.subjectIds - IDs das disciplinas
   * @param {Array<number>} data.schoolClassIds - IDs das turmas
   * @param {number} data.unitId - ID da unidade escolar
   * @returns {Promise<Object>} Professor criado
   */
  async createTeacher(data) {
    try {
      // Se unitId não foi fornecido, obter do token JWT
      const unitId = data.unitId || getUnitIdFromToken();

      if (!unitId) {
        throw new Error(
          "Unidade escolar não encontrada. Faça login novamente.",
        );
      }

      const response = await api.post("/teacher", {
        username: data.username,
        password: data.password,
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        subjectIds: data.subjectIds || [],
        schoolClassIds: data.schoolClassIds || [],
        unitId: unitId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar professor:", error);
      throw new Error(
        error.response?.data?.message || "Não foi possível criar o professor",
      );
    }
  },

  /**
   * Atualiza um professor existente
   * @param {number} id - ID do professor
   * @param {Object} data - Dados atualizados
   * @returns {Promise<Object>} Professor atualizado
   */
  async updateTeacher(id, data) {
    try {
      const response = await api.put(`/teacher/${id}`, {
        username: data.username,
        password: data.password,
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        subjectIds: data.subjectIds,
        schoolClassIds: data.schoolClassIds,
        unitId: data.unitId,
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar professor ${id}:`, error);
      throw new Error("Não foi possível atualizar o professor");
    }
  },

  /**
   * Deleta um professor
   * @param {number} id - ID do professor
   * @returns {Promise<void>}
   */
  async deleteTeacher(id) {
    try {
      await api.delete(`/teacher/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar professor ${id}:`, error);
      throw new Error("Não foi possível deletar o professor");
    }
  },

  /**
   * Busca as turmas de um professor
   * @param {number} teacherId - ID do professor
   * @returns {Promise<Array>} Lista de turmas
   */
  async getTeacherClasses(teacherId) {
    try {
      const teacher = await this.getTeacherById(teacherId);
      if (!teacher.schoolClassIds || teacher.schoolClassIds.length === 0) {
        return [];
      }

      // Buscar detalhes de cada turma
      const classPromises = teacher.schoolClassIds.map((classId) =>
        api.get(`/schoolclass/${classId}`),
      );

      const classResponses = await Promise.all(classPromises);
      return classResponses.map((response) => response.data);
    } catch (error) {
      console.error("Erro ao buscar turmas do professor:", error);
      return [];
    }
  },

  /**
   * Busca as disciplinas de um professor
   * @param {number} teacherId - ID do professor
   * @returns {Promise<Array>} Lista de disciplinas
   */
  async getTeacherSubjects(teacherId) {
    try {
      const teacher = await this.getTeacherById(teacherId);
      if (!teacher.subjectIds || teacher.subjectIds.length === 0) {
        return [];
      }

      // Buscar detalhes de cada disciplina
      const subjectPromises = teacher.subjectIds.map((subjectId) =>
        api.get(`/schoolsubject/${subjectId}`),
      );

      const subjectResponses = await Promise.all(subjectPromises);
      return subjectResponses.map((response) => response.data);
    } catch (error) {
      console.error("Erro ao buscar disciplinas do professor:", error);
      return [];
    }
  },

  /**
   * Busca o horário de aulas de um professor
   * @param {number} teacherId - ID do professor
   * @returns {Promise<Array>} Lista de horários
   */
  async getTeacherSchedule(teacherId) {
    try {
      const response = await api.get(`/classschedule/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar horário do professor:", error);
      return [];
    }
  },

  /**
   * Valida os dados de um professor
   * @param {Object} data - Dados a validar
   * @returns {Array<string>} Array de erros (vazio se válido)
   */
  validateTeacherData(data) {
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

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push("Email inválido");
    }

    if (!data.cpf || !this.isValidCPF(data.cpf)) {
      errors.push("CPF inválido");
    }

    if (!data.phone) {
      errors.push("Telefone é obrigatório");
    }

    if (!data.unitId) {
      errors.push("Unidade escolar é obrigatória");
    }

    return errors;
  },

  /**
   * Valida se um email é válido
   * @param {string} email - Email a validar
   * @returns {boolean} True se válido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida se um CPF é válido
   * @param {string} cpf - CPF a validar
   * @returns {boolean} True se válido
   */
  isValidCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, "");

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  },

  /**
   * Formata um CPF para exibição (xxx.xxx.xxx-xx)
   * @param {string} cpf - CPF a formatar
   * @returns {string} CPF formatado
   */
  formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  },

  /**
   * Formata um telefone para exibição
   * @param {string} phone - Telefone a formatar
   * @returns {string} Telefone formatado
   */
  formatPhone(phone) {
    phone = phone.replace(/[^\d]/g, "");
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  },
};
