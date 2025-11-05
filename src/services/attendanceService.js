import api from "./api";
import {
  formatDate,
  formatDateTime,
  getCurrentDate,
} from "../utils/formatters";

export const attendanceService = {
  /**
   * Busca as presenças de um aluno por ID
   * @param {number} studentId - ID do aluno
   * @returns {Promise<Array>} Lista de presenças do aluno
   */
  async getStudentAttendance(studentId) {
    try {
      const response = await api.get(`/attendance/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar presenças do aluno:", error);
      throw error;
    }
  },

  /**
   * Busca as presenças de um aluno filtradas por data
   * @param {number} studentId - ID do aluno
   * @param {string} date - Data no formato YYYY-MM-DD
   * @returns {Promise<Array>} Lista de presenças do aluno na data especificada
   */
  async getStudentAttendanceByDate(studentId, date) {
    try {
      const response = await api.get(`/attendance/student/${studentId}`);
      const allAttendance = response.data;

      // Filtra as presenças pela data selecionada
      return allAttendance.filter((attendance) => {
        const attendanceDate = new Date(attendance.date)
          .toISOString()
          .split("T")[0];
        return attendanceDate === date;
      });
    } catch (error) {
      console.error("Erro ao buscar presenças do aluno por data:", error);
      throw error;
    }
  },

  /**
   * Busca os dados de um professor por ID
   * @param {number} teacherId - ID do professor
   * @returns {Promise<Object>} Dados do professor
   */
  async getTeacherById(teacherId) {
    try {
      const response = await api.get(`/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do professor:", error);
      throw error;
    }
  },

  /**
   * Busca múltiplos professores por seus IDs
   * @param {Array<number>} teacherIds - Array de IDs dos professores
   * @returns {Promise<Array>} Array de dados dos professores
   */
  async getMultipleTeachers(teacherIds) {
    try {
      const uniqueIds = [...new Set(teacherIds)]; // Remove duplicatas
      const promises = uniqueIds.map((id) => this.getTeacherById(id));
      const teachers = await Promise.all(promises);

      // Retorna um objeto com os professores indexados por ID para facilitar o acesso
      return teachers.reduce((acc, teacher) => {
        acc[teacher.id] = teacher;
        return acc;
      }, {});
    } catch (error) {
      console.error("Erro ao buscar múltiplos professores:", error);
      throw error;
    }
  },

  // Reutiliza formatadores do utils
  formatDate,
  formatDateTime,
  getCurrentDate,
};
