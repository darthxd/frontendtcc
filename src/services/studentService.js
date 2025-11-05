import api from "./api";
import { getUnitIdFromToken } from "../utils/jwt";

export const studentService = {
  /**
   * Busca todos os estudantes
   * @returns {Promise<Array>} Lista de estudantes
   */
  async getAllStudents() {
    try {
      const response = await api.get("/student");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estudantes:", error);
      throw new Error("Não foi possível buscar os estudantes");
    }
  },

  /**
   * Busca um estudante por ID
   * @param {number} id - ID do estudante
   * @returns {Promise<Object>} Dados do estudante
   */
  async getStudentById(id) {
    try {
      const response = await api.get(`/student/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar estudante ${id}:`, error);
      throw new Error("Não foi possível buscar o estudante");
    }
  },

  /**
   * Busca um estudante por username
   * @param {string} username - Username do estudante
   * @returns {Promise<Object>} Dados do estudante
   */
  async getStudentByUsername(username) {
    try {
      const response = await api.get(`/student/username/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar estudante ${username}:`, error);
      throw new Error("Não foi possível buscar o estudante");
    }
  },

  /**
   * Cria um novo estudante
   * @param {Object} data - Dados do estudante
   * @returns {Promise<Object>} Estudante criado
   */
  async createStudent(data) {
    try {
      // Se unitId não foi fornecido, obter do token JWT
      const unitId = data.unitId || getUnitIdFromToken();

      if (!unitId) {
        throw new Error(
          "Unidade escolar não encontrada. Faça login novamente.",
        );
      }

      const response = await api.post("/student", {
        username: data.username,
        password: data.password,
        name: data.name,
        ra: data.ra,
        rm: data.rm,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        schoolClassId: data.schoolClassId,
        birthdate: data.birthdate,
        photo: data.photo,
        sendNotification: data.sendNotification || false,
        unitId: unitId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar estudante:", error);
      throw new Error(
        error.response?.data?.message || "Não foi possível criar o estudante",
      );
    }
  },

  /**
   * Atualiza um estudante existente
   * @param {number} id - ID do estudante
   * @param {Object} data - Dados atualizados
   * @returns {Promise<Object>} Estudante atualizado
   */
  async updateStudent(id, data) {
    try {
      const response = await api.put(`/student/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar estudante ${id}:`, error);
      throw new Error("Não foi possível atualizar o estudante");
    }
  },

  /**
   * Deleta um estudante (marca como deleted)
   * @param {number} id - ID do estudante
   * @returns {Promise<void>}
   */
  async deleteStudent(id) {
    try {
      await api.delete(`/student/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar estudante ${id}:`, error);
      throw new Error("Não foi possível deletar o estudante");
    }
  },

  /**
   * Busca o log completo de presença do estudante
   * @param {number} id - ID do estudante
   * @returns {Promise<Object>} Log de presença
   */
  async getFullPresenceLog(id) {
    try {
      const response = await api.get(`/student/${id}/presencelog`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar log de presença do estudante ${id}:`,
        error,
      );
      throw new Error("Não foi possível buscar o log de presença");
    }
  },

  /**
   * Busca estudantes por turma
   * @param {number} schoolClassId - ID da turma
   * @returns {Promise<Array>} Lista de estudantes da turma
   */
  async getStudentsBySchoolClass(schoolClassId) {
    try {
      const response = await api.get(`/schoolclass/${schoolClassId}/students`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar estudantes da turma ${schoolClassId}:`,
        error,
      );
      return [];
    }
  },

  // === BIOMETRIA ===

  /**
   * Registra a biometria de um estudante
   * @param {number} studentId - ID do estudante
   * @returns {Promise<string>} Mensagem de sucesso
   */
  async enrollBiometry(studentId) {
    try {
      const response = await api.post("/student/biometry/enroll", {
        studentId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar biometria:", error);
      throw new Error("Não foi possível registrar a biometria");
    }
  },

  /**
   * Lê a presença através da biometria
   * @returns {Promise<Object>} Dados do estudante identificado
   */
  async readPresence() {
    try {
      const response = await api.post("/student/biometry/read");
      return response.data;
    } catch (error) {
      console.error("Erro ao ler presença:", error);
      throw new Error("Não foi possível ler a presença");
    }
  },

  /**
   * Deleta a biometria de um estudante
   * @param {number} studentId - ID do estudante
   * @returns {Promise<string>} Mensagem de sucesso
   */
  async deleteBiometry(studentId) {
    try {
      const response = await api.post("/student/biometry/delete", {
        studentId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar biometria:", error);
      throw new Error("Não foi possível deletar a biometria");
    }
  },

  // === MATRÍCULA (ENROLL) ===

  /**
   * Busca todas as matrículas
   * @returns {Promise<Array>} Lista de matrículas
   */
  async getAllEnrollments() {
    try {
      const response = await api.get("/student/enroll");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar matrículas:", error);
      return [];
    }
  },

  /**
   * Busca uma matrícula por ID
   * @param {number} id - ID da matrícula
   * @returns {Promise<Object>} Dados da matrícula
   */
  async getEnrollmentById(id) {
    try {
      const response = await api.get(`/student/enroll/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar matrícula ${id}:`, error);
      throw new Error("Não foi possível buscar a matrícula");
    }
  },

  /**
   * Cria uma nova matrícula (com upload de foto)
   * @param {FormData} formData - Dados da matrícula incluindo foto
   * @returns {Promise<Object>} Matrícula e estudante criados
   */
  async createEnrollment(formData) {
    try {
      // Se unitId não está no FormData, adicionar do token JWT
      if (!formData.get("unitId")) {
        const unitId = getUnitIdFromToken();
        if (!unitId) {
          throw new Error(
            "Unidade escolar não encontrada. Faça login novamente.",
          );
        }
        formData.append("unitId", unitId);
      }

      const response = await api.post("/student/enroll", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar matrícula:", error);
      throw new Error(
        error.response?.data?.message || "Não foi possível criar a matrícula",
      );
    }
  },

  /**
   * Atualiza uma matrícula existente
   * @param {number} id - ID da matrícula
   * @param {Object} data - Dados atualizados
   * @returns {Promise<Object>} Matrícula atualizada
   */
  async updateEnrollment(id, data) {
    try {
      const response = await api.put(`/student/enroll/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar matrícula ${id}:`, error);
      throw new Error("Não foi possível atualizar a matrícula");
    }
  },

  /**
   * Ativa uma matrícula (status = ACTIVE)
   * @param {number} id - ID do estudante
   * @returns {Promise<Object>} Matrícula e estudante atualizados
   */
  async setEnrollmentActive(id) {
    try {
      const response = await api.post(`/student/${id}/setactive`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao ativar matrícula ${id}:`, error);
      throw new Error("Não foi possível ativar a matrícula");
    }
  },

  /**
   * Inativa uma matrícula (status = INACTIVE)
   * @param {number} id - ID do estudante
   * @returns {Promise<Object>} Matrícula e estudante atualizados
   */
  async setEnrollmentInactive(id) {
    try {
      const response = await api.post(`/student/${id}/setinactive`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao inativar matrícula ${id}:`, error);
      throw new Error("Não foi possível inativar a matrícula");
    }
  },

  // === VALIDAÇÕES ===

  /**
   * Valida os dados de um estudante
   * @param {Object} data - Dados a validar
   * @returns {Array<string>} Array de erros (vazio se válido)
   */
  validateStudentData(data) {
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

    if (!data.birthdate) {
      errors.push("Data de nascimento é obrigatória");
    }

    if (!data.schoolClassId) {
      errors.push("Turma é obrigatória");
    }

    if (!data.unitId) {
      errors.push("Unidade escolar é obrigatória");
    }

    return errors;
  },

  /**
   * Valida os dados de uma matrícula
   * @param {Object} data - Dados a validar
   * @returns {Array<string>} Array de erros (vazio se válido)
   */
  validateEnrollmentData(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push("Nome é obrigatório");
    }

    if (!data.cpf || !this.isValidCPF(data.cpf)) {
      errors.push("CPF inválido");
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push("Email inválido");
    }

    if (!data.phone) {
      errors.push("Telefone é obrigatório");
    }

    if (!data.birthdate) {
      errors.push("Data de nascimento é obrigatória");
    }

    if (!data.address || data.address.trim().length === 0) {
      errors.push("Endereço é obrigatório");
    }

    if (!data.gradeYear) {
      errors.push("Ano/série é obrigatório");
    }

    if (!data.course) {
      errors.push("Curso é obrigatório");
    }

    if (!data.shift) {
      errors.push("Turno é obrigatório");
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
