/**
 * Utilitários específicos para dashboards e cálculos estatísticos
 */

import { formatPercentage, getPerformanceLevel, getAttendanceLevel } from './formatters';

// ==================== CÁLCULOS DE ATIVIDADES ====================

/**
 * Calcula estatísticas de atividades do aluno
 * @param {Array} activities - Lista de atividades
 * @param {Array} submissions - Lista de submissões
 * @returns {Object} Estatísticas calculadas
 */
export const calculateActivityStats = (activities = [], submissions = []) => {
  const total = activities.length;
  const submitted = submissions.length;
  const graded = submissions.filter((s) => s.grade !== null).length;
  const pending = total - submitted;
  const averageGrade =
    graded > 0
      ? submissions
          .filter((s) => s.grade !== null)
          .reduce((acc, s) => acc + s.grade, 0) / graded
      : 0;

  const completionRate = total > 0 ? (submitted / total) * 100 : 0;

  return {
    total,
    submitted,
    graded,
    pending,
    averageGrade,
    completionRate,
    performanceLevel: getPerformanceLevel(averageGrade)
  };
};

/**
 * Calcula estatísticas de frequência
 * @param {Array} attendance - Lista de registros de presença
 * @returns {Object} Estatísticas de frequência
 */
export const calculateAttendanceStats = (attendance = []) => {
  if (attendance.length === 0) {
    return {
      totalClasses: 0,
      attendedClasses: 0,
      attendanceRate: 0,
      inSchoolClasses: 0,
      attendanceLevel: getAttendanceLevel(0)
    };
  }

  const totalClasses = attendance.length;
  const attendedClasses = attendance.filter((record) => record.present).length;
  const inSchoolClasses = attendance.filter((record) => record.isInSchool).length;
  const attendanceRate = (attendedClasses / totalClasses) * 100;

  return {
    totalClasses,
    attendedClasses,
    inSchoolClasses,
    attendanceRate,
    attendanceLevel: getAttendanceLevel(attendanceRate)
  };
};

/**
 * Calcula estatísticas para um dia específico de presença
 * @param {Array} dailyAttendance - Presenças do dia
 * @returns {Object} Estatísticas do dia
 */
export const calculateDailyAttendanceStats = (dailyAttendance = []) => {
  const total = dailyAttendance.length;
  const present = dailyAttendance.filter((item) => item.present).length;
  const absent = total - present;
  const inSchool = dailyAttendance.filter((item) => item.isInSchool).length;

  return { total, present, absent, inSchool };
};

// ==================== CÁLCULOS DE PROFESSOR ====================

/**
 * Calcula estatísticas do professor
 * @param {Array} classes - Turmas do professor
 * @param {Array} activities - Atividades criadas
 * @param {Array} submissions - Submissões recebidas
 * @returns {Object} Estatísticas do professor
 */
export const calculateTeacherStats = (classes = [], activities = [], submissions = []) => {
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((acc, cls) => acc + (cls.students?.length || 0), 0);
  const totalActivities = activities.length;
  const pendingGrading = submissions.filter(s => s.grade === null).length;
  const gradedSubmissions = submissions.filter(s => s.grade !== null).length;

  const averageGrade = gradedSubmissions.length > 0
    ? submissions
        .filter(s => s.grade !== null)
        .reduce((acc, s) => acc + s.grade, 0) / gradedSubmissions.length
    : 0;

  return {
    totalClasses,
    totalStudents,
    totalActivities,
    pendingGrading,
    gradedSubmissions,
    averageGrade,
    gradingProgress: submissions.length > 0 ? (gradedSubmissions / submissions.length) * 100 : 0
  };
};

// ==================== VALIDAÇÕES E ALERTAS ====================

/**
 * Verifica se o aluno precisa de atenção especial
 * @param {Object} activityStats - Estatísticas de atividades
 * @param {Object} attendanceStats - Estatísticas de frequência
 * @returns {Array} Lista de alertas
 */
export const getStudentAlerts = (activityStats, attendanceStats) => {
  const alerts = [];

  // Alerta de frequência baixa
  if (attendanceStats.attendanceRate < 75) {
    alerts.push({
      type: 'warning',
      title: 'Frequência Baixa',
      message: `Sua frequência está em ${formatPercentage(attendanceStats.attendanceRate)}. É importante manter pelo menos 75% de presença.`,
      priority: 'high'
    });
  }

  // Alerta de média baixa
  if (activityStats.averageGrade < 5 && activityStats.graded > 0) {
    alerts.push({
      type: 'error',
      title: 'Desempenho Crítico',
      message: `Sua média atual é ${activityStats.averageGrade.toFixed(1)}. Procure ajuda do professor.`,
      priority: 'high'
    });
  }

  // Alerta de atividades pendentes
  if (activityStats.pending > 3) {
    alerts.push({
      type: 'warning',
      title: 'Muitas Atividades Pendentes',
      message: `Você tem ${activityStats.pending} atividades para entregar.`,
      priority: 'medium'
    });
  }

  // Alerta de baixa taxa de entrega
  if (activityStats.completionRate < 50 && activityStats.total > 0) {
    alerts.push({
      type: 'info',
      title: 'Taxa de Entrega Baixa',
      message: `Você entregou apenas ${formatPercentage(activityStats.completionRate)} das atividades.`,
      priority: 'medium'
    });
  }

  return alerts.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

/**
 * Gera conquistas baseadas no desempenho do aluno
 * @param {Object} activityStats - Estatísticas de atividades
 * @param {Object} attendanceStats - Estatísticas de frequência
 * @returns {Array} Lista de conquistas
 */
export const getStudentAchievements = (activityStats, attendanceStats) => {
  const achievements = [];

  // Conquista de excelência acadêmica
  if (activityStats.averageGrade >= 9) {
    achievements.push({
      id: 'academic_excellence',
      title: 'Excelência Acadêmica',
      description: 'Média acima de 9.0',
      icon: 'Award',
      color: 'text-yellow-600 bg-yellow-50'
    });
  }

  // Conquista de frequência exemplar
  if (attendanceStats.attendanceRate >= 95) {
    achievements.push({
      id: 'perfect_attendance',
      title: 'Frequência Exemplar',
      description: 'Mais de 95% de presença',
      icon: 'Calendar',
      color: 'text-blue-600 bg-blue-50'
    });
  }

  // Conquista de 100% das atividades
  if (activityStats.submitted === activityStats.total && activityStats.total > 0) {
    achievements.push({
      id: 'full_completion',
      title: '100% das Atividades Enviadas',
      description: 'Todas as atividades foram entregues',
      icon: 'CheckCircle',
      color: 'text-green-600 bg-green-50'
    });
  }

  // Conquista de melhoria contínua
  if (activityStats.averageGrade >= 7 && attendanceStats.attendanceRate >= 80) {
    achievements.push({
      id: 'consistent_student',
      title: 'Aluno Consistente',
      description: 'Boa média e frequência regular',
      icon: 'TrendingUp',
      color: 'text-purple-600 bg-purple-50'
    });
  }

  return achievements;
};

/**
 * Gera metas para o aluno baseadas no desempenho atual
 * @param {Object} activityStats - Estatísticas de atividades
 * @param {Object} attendanceStats - Estatísticas de frequência
 * @returns {Array} Lista de metas
 */
export const getStudentGoals = (activityStats, attendanceStats) => {
  const goals = [];

  // Meta de completar atividades pendentes
  if (activityStats.pending > 0) {
    goals.push({
      id: 'complete_activities',
      title: `Completar ${activityStats.pending} atividade${activityStats.pending > 1 ? 's' : ''} pendente${activityStats.pending > 1 ? 's' : ''}`,
      type: 'urgent',
      color: 'border-yellow-200 bg-yellow-50'
    });
  }

  // Meta de melhorar frequência
  if (attendanceStats.attendanceRate < 90) {
    const improvement = (90 - attendanceStats.attendanceRate).toFixed(1);
    goals.push({
      id: 'improve_attendance',
      title: `Melhorar frequência para ${improvement}% a mais`,
      type: 'improvement',
      color: 'border-blue-200 bg-blue-50'
    });
  }

  // Meta de elevar média
  if (activityStats.averageGrade < 8 && activityStats.graded > 0) {
    const improvement = (8 - activityStats.averageGrade).toFixed(1);
    goals.push({
      id: 'improve_grades',
      title: `Elevar média para ${improvement} pontos a mais`,
      type: 'academic',
      color: 'border-green-200 bg-green-50'
    });
  }

  // Meta de manter desempenho
  if (activityStats.averageGrade >= 8 && attendanceStats.attendanceRate >= 90) {
    goals.push({
      id: 'maintain_performance',
      title: 'Manter o excelente desempenho',
      type: 'maintenance',
      color: 'border-purple-200 bg-purple-50'
    });
  }

  return goals;
};

// ==================== UTILITÁRIOS DE COMPARAÇÃO ====================

/**
 * Compara desempenho entre períodos
 * @param {Object} currentStats - Estatísticas atuais
 * @param {Object} previousStats - Estatísticas anteriores
 * @returns {Object} Comparação de desempenho
 */
export const comparePerformance = (currentStats, previousStats) => {
  const comparison = {
    grade: {
      current: currentStats.averageGrade,
      previous: previousStats.averageGrade,
      change: currentStats.averageGrade - previousStats.averageGrade,
      trend: 'stable'
    },
    attendance: {
      current: currentStats.attendanceRate,
      previous: previousStats.attendanceRate,
      change: currentStats.attendanceRate - previousStats.attendanceRate,
      trend: 'stable'
    }
  };

  // Determina tendências
  comparison.grade.trend = comparison.grade.change > 0.5 ? 'up' :
                          comparison.grade.change < -0.5 ? 'down' : 'stable';

  comparison.attendance.trend = comparison.attendance.change > 5 ? 'up' :
                               comparison.attendance.change < -5 ? 'down' : 'stable';

  return comparison;
};

// ==================== FILTROS E ORDENAÇÕES ====================

/**
 * Filtra atividades por status
 * @param {Array} activities - Lista de atividades
 * @param {Array} submissions - Lista de submissões
 * @param {string} status - Status a filtrar
 * @returns {Array} Atividades filtradas
 */
export const filterActivitiesByStatus = (activities, submissions, status) => {
  const submissionMap = submissions.reduce((map, sub) => {
    map[sub.activityId] = sub;
    return map;
  }, {});

  return activities.filter(activity => {
    const submission = submissionMap[activity.id];
    const now = new Date();
    const deadline = new Date(activity.deadline);

    switch (status) {
      case 'pending':
        return !submission && deadline >= now;
      case 'overdue':
        return !submission && deadline < now;
      case 'submitted':
        return submission && !submission.grade;
      case 'graded':
        return submission && submission.grade !== null;
      default:
        return true;
    }
  });
};

/**
 * Ordena atividades por prioridade
 * @param {Array} activities - Lista de atividades
 * @param {Array} submissions - Lista de submissões
 * @returns {Array} Atividades ordenadas por prioridade
 */
export const sortActivitiesByPriority = (activities, submissions) => {
  const submissionMap = submissions.reduce((map, sub) => {
    map[sub.activityId] = sub;
    return map;
  }, {});

  return [...activities].sort((a, b) => {
    const now = new Date();
    const deadlineA = new Date(a.deadline);
    const deadlineB = new Date(b.deadline);
    const submissionA = submissionMap[a.id];
    const submissionB = submissionMap[b.id];

    // Prioridade 1: Atividades atrasadas sem submissão
    const overdueA = !submissionA && deadlineA < now;
    const overdueB = !submissionB && deadlineB < now;
    if (overdueA !== overdueB) return overdueA ? -1 : 1;

    // Prioridade 2: Atividades pendentes (por prazo)
    const pendingA = !submissionA && deadlineA >= now;
    const pendingB = !submissionB && deadlineB >= now;
    if (pendingA && pendingB) return deadlineA - deadlineB;
    if (pendingA !== pendingB) return pendingA ? -1 : 1;

    // Prioridade 3: Por data de criação (mais recentes primeiro)
    return new Date(b.creationDate) - new Date(a.creationDate);
  });
};
