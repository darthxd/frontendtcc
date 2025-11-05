import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    pendingEnrollments: 0,
    activeStudents: 0,
    totalStudents: 0,
    recentEnrollments: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar matrículas
      const enrollmentsResponse = await api.get("/student/enroll");
      const enrollments = enrollmentsResponse.data || [];

      // Buscar estudantes
      const studentsResponse = await api.get("/student");
      const students = studentsResponse.data || [];

      // Filtrar por status
      const activeStudents = students.filter((s) => s.status === "ACTIVE");
      const pendingEnrollments = enrollments.filter(
        (e) => e.status === "INACTIVE",
      );

      // Ordenar matrículas por data (mais recentes primeiro)
      const sortedEnrollments = [...enrollments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setStats({
        totalEnrollments: enrollments.length,
        pendingEnrollments: pendingEnrollments.length,
        activeStudents: activeStudents.length,
        totalStudents: students.length,
        recentEnrollments: sortedEnrollments.slice(0, 3),
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
      ADM: "Administração",
      BIO: "Biologia",
      CV: "CV",
      DG: "Design Gráfico",
      DDI: "DDI",
      DS: "Desenvolvimento de Sistemas",
      EDF: "EDF",
      LOG: "Logística",
      MAT: "Matemática",
      MEC: "Mecânica",
      MED: "Medicina",
    };
    return courses[course] || course;
  };

  const getYearLabel = (year) => {
    const years = {
      FIRST_YEAR: "1º Ano",
      SECOND_YEAR: "2º Ano",
      THIRD_YEAR: "3º Ano",
    };
    return years[year] || year;
  };

  const getShiftLabel = (shift) => {
    const shifts = {
      MORNING: "Manhã",
      AFTERNOON: "Tarde",
      NIGHT: "Noite",
    };
    return shifts[shift] || shift;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
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
            Dashboard da Secretaria
          </h1>
          <p className="text-gray-600">
            Gerencie matrículas e acompanhe o status dos alunos
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
          onClick={() => navigate("/secretary/enrollments")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de Matrículas
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalEnrollments}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Todas as solicitações
              </p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/secretary/enrollments")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Matrículas Pendentes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.pendingEnrollments}
              </p>
              <p className="text-xs text-gray-500 mt-1">Aguardando aprovação</p>
            </div>
            <div className="bg-yellow-500 rounded-lg p-3">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Alunos Ativos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.activeStudents}
              </p>
              <p className="text-xs text-gray-500 mt-1">Matriculados</p>
            </div>
            <div className="bg-green-500 rounded-lg p-3">
              <CheckCircle className="h-8 w-8 text-white" />
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
              <p className="text-xs text-gray-500 mt-1">No sistema</p>
            </div>
            <div className="bg-purple-500 rounded-lg p-3">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/secretary/enrollments")}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2 group-hover:bg-blue-200 transition-colors">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">
                  Gerenciar Matrículas
                </h4>
                <p className="text-xs text-gray-500">Aprovar e visualizar</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={() => navigate("/secretary/new-enrollment")}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2 group-hover:bg-green-200 transition-colors">
                <UserPlus className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Nova Matrícula</h4>
                <p className="text-xs text-gray-500">Cadastrar novo aluno</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600" />
          </button>

          <button
            onClick={() => navigate("/teachers")}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-lg p-2 group-hover:bg-purple-200 transition-colors">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Professores</h4>
                <p className="text-xs text-gray-500">Gerenciar cadastros</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600" />
          </button>

          <button
            onClick={() => navigate("/secretary/logs")}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 rounded-lg p-2 group-hover:bg-orange-200 transition-colors">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Logs de Acesso</h4>
                <p className="text-xs text-gray-500">Biometria e presença</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600" />
          </button>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Matrículas Recentes
          </h3>
          <button
            onClick={() => navigate("/secretary/enrollments")}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            Ver todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {stats.recentEnrollments.length > 0 ? (
          <div className="space-y-3">
            {stats.recentEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => navigate("/secretary/enrollments")}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {enrollment.name}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          enrollment.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : enrollment.status === "INACTIVE"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {enrollment.status === "ACTIVE"
                          ? "Aprovada"
                          : enrollment.status === "INACTIVE"
                            ? "Pendente"
                            : "Rejeitada"}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">RM:</span> {enrollment.rm}
                      </p>
                      <p>
                        <span className="font-medium">CPF:</span>{" "}
                        {enrollment.cpf}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {enrollment.email}
                      </p>
                      <p>
                        <span className="font-medium">Data:</span>{" "}
                        {formatDate(enrollment.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Turma:</span>{" "}
                      {getYearLabel(enrollment.schoolClass.year)} -{" "}
                      {getCourseLabel(enrollment.schoolClass.course)} (
                      {getShiftLabel(enrollment.schoolClass.shift)}) -{" "}
                      {enrollment.schoolClass.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Nenhuma matrícula recente
            </p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Bem-vindo ao Dashboard de Secretaria
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Utilize o menu lateral para acessar todas as funcionalidades:
              gestão de matrículas, cadastro de professores e alunos, e
              visualização de logs de acesso. Matrículas pendentes requerem sua
              aprovação. Os logs de presença são registrados automaticamente via
              biometria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
