import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  Award,
  RefreshCw,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    averagePerformance: 0,
    recentClasses: [],
    upcomingSchedules: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar turmas
      const classesResponse = await api.get("/schoolclass");
      const classes = classesResponse.data || [];

      // Buscar estudantes
      const studentsResponse = await api.get("/student");
      const students = studentsResponse.data || [];

      // Buscar professores
      const teachersResponse = await api.get("/teacher");
      const teachers = teachersResponse.data || [];

      // Buscar horários
      const schedulesResponse = await api.get("/classschedule");
      const schedules = schedulesResponse.data || [];

      // Calcular performance média (simulado)
      const averagePerformance = 75;

      // Adicionar contagem de alunos por turma
      const classesWithStudents = classes.map((cls) => ({
        ...cls,
        studentCount:
          students.filter((s) => s.schoolClass?.id === cls.id).length || 0,
        performance: Math.floor(Math.random() * 30) + 70,
      }));

      // Pegar as 3 primeiras turmas para exibir
      const recentClasses = classesWithStudents.slice(0, 3);

      // Pegar os próximos horários (simulado)
      const upcomingSchedules = schedules.slice(0, 5);

      setStats({
        totalClasses: classes.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        averagePerformance,
        recentClasses,
        upcomingSchedules,
      });
    } catch (error) {
      toast.error("Erro ao carregar dados do dashboard");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseLabel = (course) => {
    const courses = {
      ENSINO_MEDIO: "Ensino Médio",
      TECNICO_INFORMATICA: "Técnico em Informática",
      TECNICO_ADMINISTRACAO: "Técnico em Administração",
      TECNICO_ELETRONICA: "Técnico em Eletrônica",
    };
    return courses[course] || course;
  };

  const getYearLabel = (year) => {
    const years = {
      FIRST: "1º Ano",
      SECOND: "2º Ano",
      THIRD: "3º Ano",
    };
    return years[year] || year;
  };

  const getShiftLabel = (shift) => {
    const shifts = {
      MORNING: "Manhã",
      AFTERNOON: "Tarde",
      EVENING: "Noite",
    };
    return shifts[shift] || shift;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard da Coordenação
          </h1>
          <p className="text-gray-600">
            Visão geral e acesso rápido às funcionalidades
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn btn-secondary flex items-center"
          title="Atualizar dados"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/coordinator/classes")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de Turmas
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalClasses}
              </p>
              <p className="text-xs text-gray-500 mt-1">Turmas ativas</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de Alunos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalStudents}
              </p>
              <p className="text-xs text-gray-500 mt-1">Matriculados</p>
            </div>
            <div className="bg-green-500 rounded-lg p-3">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Professores</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalTeachers}
              </p>
              <p className="text-xs text-gray-500 mt-1">Corpo docente</p>
            </div>
            <div className="bg-purple-500 rounded-lg p-3">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/coordinator/performance")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Performance Média
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.averagePerformance}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Todas as turmas</p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/coordinator/classes")}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Gerenciar Turmas</h4>
                <p className="text-xs text-gray-500">
                  Visualizar e gerenciar turmas
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={() => navigate("/coordinator/performance")}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2 group-hover:bg-green-200 transition-colors">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Ver Desempenho</h4>
                <p className="text-xs text-gray-500">Análise de performance</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600" />
          </button>

          <button
            onClick={() => navigate("/coordinator/schedules")}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-lg p-2 group-hover:bg-purple-200 transition-colors">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Ver Horários</h4>
                <p className="text-xs text-gray-500">Consultar grade horária</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600" />
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Turmas Recentes
            </h3>
            <button
              onClick={() => navigate("/coordinator/classes")}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Ver todas
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {stats.recentClasses.length > 0 ? (
            <div className="space-y-3">
              {stats.recentClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => navigate("/coordinator/classes")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {classItem.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {getCourseLabel(classItem.course)} -{" "}
                          {getYearLabel(classItem.year)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {classItem.studentCount} alunos
                      </p>
                      <p className="text-xs text-gray-500">
                        {getShiftLabel(classItem.shift)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Nenhuma turma disponível
              </p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Próximos Horários
            </h3>
            <button
              onClick={() => navigate("/coordinator/schedules")}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {stats.upcomingSchedules.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingSchedules.map((schedule, index) => (
                <div
                  key={schedule.id || index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {schedule.subject?.name || "Disciplina"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Nenhum horário agendado
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Bem-vindo ao Dashboard de Coordenação
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Utilize o menu lateral para acessar as diferentes funcionalidades:
              gerenciar turmas, acompanhar o desempenho acadêmico e visualizar
              horários. Os cards acima fornecem um resumo rápido das informações
              principais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
