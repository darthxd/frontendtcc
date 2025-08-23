import { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Users,
  BarChart3,
  Award,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { activityService } from "../services/activityService";
import toast from "react-hot-toast";
import api from "../services/api";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const student = await activityService.getStudentByUsername(user.username);
      setStudentData(student);

      // Carregar atividades da turma do aluno
      if (student.schoolClass) {
        const activitiesData =
          await activityService.listActivitiesBySchoolClass(
            student.schoolClass.id,
          );
        setActivities(activitiesData);
      }

      // Carregar submissões do aluno
      const submissionsData = await activityService.listSubmissionsByStudent(
        student.id,
      );
      setSubmissions(submissionsData);

      // Carregar dados de frequência
      await loadAttendanceData(student.id);
    } catch (error) {
      toast.error("Erro ao carregar dados do estudante");
      console.error("Erro:", error);
      // Set empty arrays to prevent crashes
      setActivities([]);
      setSubmissions([]);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async (studentId) => {
    try {
      // Fazer chamada para GET /attendance/student/{id}
      const response = await api.get(`/attendance/student/${studentId}`);
      const attendanceData = response.data;
      setAttendance(attendanceData);
    } catch (error) {
      console.error("Erro ao carregar frequência:", error);
      setAttendance([]);
    }
  };

  const calculateStats = () => {
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

    return { total, submitted, graded, pending, averageGrade };
  };

  const calculateAttendanceStats = () => {
    if (attendance.length === 0) {
      return { totalClasses: 0, attendedClasses: 0, attendanceRate: 0 };
    }
    console.log(attendance);
    const totalClasses = attendance.length;
    const attendedClasses = attendance.filter(
      (record) => record.present,
    ).length;
    const attendanceRate = (attendedClasses / totalClasses) * 100;

    return { totalClasses, attendedClasses, attendanceRate };
  };

  const getPerformanceLevel = (average) => {
    if (average >= 9) return { level: "Excelente", color: "text-green-600" };
    if (average >= 7) return { level: "Bom", color: "text-blue-600" };
    if (average >= 5) return { level: "Regular", color: "text-yellow-600" };
    return { level: "Precisa Melhorar", color: "text-red-600" };
  };

  const getAttendanceLevel = (rate) => {
    if (rate >= 90) return { level: "Excelente", color: "text-green-600" };
    if (rate >= 80) return { level: "Boa", color: "text-blue-600" };
    if (rate >= 70) return { level: "Regular", color: "text-yellow-600" };
    return { level: "Crítica", color: "text-red-600" };
  };

  const stats = calculateStats();
  const attendanceStats = calculateAttendanceStats();
  const performanceLevel = getPerformanceLevel(stats.averageGrade);
  const attendanceLevel = getAttendanceLevel(attendanceStats.attendanceRate);

  const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
    <div
      className={`card ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Aluno</h1>
        <p className="text-gray-600">
          Bem-vindo, {studentData?.name || user?.username}! Acompanhe seu
          desempenho e frequência.
        </p>
      </div>

      {/* Stats Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Atividades"
          value={stats.total}
          icon={BookOpen}
          color="bg-blue-500"
          onClick={() => (window.location.href = "/student-activities")}
        />
        <StatCard
          title="Atividades Enviadas"
          value={stats.submitted}
          icon={CheckCircle}
          color="bg-green-500"
          subtitle={`${stats.graded} avaliadas`}
        />
        <StatCard
          title="Média das Notas"
          value={stats.averageGrade.toFixed(1)}
          icon={TrendingUp}
          color="bg-purple-500"
          subtitle={performanceLevel.level}
        />
        <StatCard
          title="Frequência"
          value={`${attendanceStats.attendanceRate.toFixed(1)}%`}
          icon={Calendar}
          color="bg-indigo-500"
          subtitle={`${attendanceStats.attendedClasses}/${attendanceStats.totalClasses} presenças`}
        />
      </div>

      {/* Cards de Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Aluno */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Minhas Informações
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">
                {studentData?.name || "Não informado"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">
                {studentData?.email || "Não informado"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CPF:</span>
              <span className="font-medium">
                {studentData?.cpf
                  ? studentData.cpf.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      "$1.$2.$3-$4",
                    )
                  : "Não informado"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium">
                {studentData?.phone
                  ? studentData.phone.replace(
                      /(\d{2})(\d{5})(\d{4})/,
                      "($1) $2-$3",
                    )
                  : "Não informado"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Turma:</span>
              <span className="font-medium">
                {studentData?.schoolClass
                  ? studentData.schoolClass.name
                  : "Não atribuída"}
              </span>
            </div>
          </div>
        </div>

        {/* Desempenho Acadêmico */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Desempenho Acadêmico
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Atividades Concluídas:</span>
              <span className="font-medium">
                {stats.submitted}/{stats.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de Conclusão:</span>
              <span className="font-medium">
                {stats.total > 0
                  ? ((stats.submitted / stats.total) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Atividades Avaliadas:</span>
              <span className="font-medium">{stats.graded}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Média Geral:</span>
              <span className={`font-medium ${performanceLevel.color}`}>
                {stats.averageGrade.toFixed(1)} - {performanceLevel.level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pendentes:</span>
              <span
                className={`font-medium ${stats.pending > 0 ? "text-yellow-600" : "text-green-600"}`}
              >
                {stats.pending}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Análise de Frequência */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Análise de Frequência
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {attendanceStats.totalClasses}
            </p>
            <p className="text-sm text-gray-500">Total de Aulas</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {attendanceStats.attendedClasses}
            </p>
            <p className="text-sm text-gray-500">Presenças</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <p className={`text-2xl font-semibold ${attendanceLevel.color}`}>
              {attendanceStats.attendanceRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">
              Taxa - {attendanceLevel.level}
            </p>
          </div>
        </div>

        {attendanceStats.attendanceRate < 75 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Sua frequência está abaixo de 75%. É
                importante manter uma boa frequência para o aproveitamento
                acadêmico.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Conquistas e Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Conquistas
          </h3>
          <div className="space-y-3">
            {stats.averageGrade >= 9 && (
              <div className="flex items-center p-2 bg-green-50 rounded-md">
                <Award className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  Excelência Acadêmica - Média acima de 9.0
                </span>
              </div>
            )}
            {attendanceStats.attendanceRate >= 95 && (
              <div className="flex items-center p-2 bg-blue-50 rounded-md">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  Frequência Exemplar - Mais de 95% de presença
                </span>
              </div>
            )}
            {stats.submitted === stats.total && stats.total > 0 && (
              <div className="flex items-center p-2 bg-purple-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm text-purple-800">
                  100% das Atividades Enviadas
                </span>
              </div>
            )}
            {stats.averageGrade < 7 && attendanceStats.attendanceRate < 75 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Continue se dedicando para conquistar suas primeiras medalhas!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Próximas Metas
          </h3>
          <div className="space-y-3">
            {stats.pending > 0 && (
              <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-sm font-medium text-yellow-800">
                  Completar {stats.pending} atividade
                  {stats.pending > 1 ? "s" : ""} pendente
                  {stats.pending > 1 ? "s" : ""}
                </p>
              </div>
            )}
            {attendanceStats.attendanceRate < 90 && (
              <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  Melhorar frequência para{" "}
                  {(90 - attendanceStats.attendanceRate).toFixed(1)}% a mais
                </p>
              </div>
            )}
            {stats.averageGrade < 8 && stats.graded > 0 && (
              <div className="p-3 border border-green-200 bg-green-50 rounded-md">
                <p className="text-sm font-medium text-green-800">
                  Elevar média para {(8 - stats.averageGrade).toFixed(1)} pontos
                  a mais
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
