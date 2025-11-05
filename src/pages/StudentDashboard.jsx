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
import { Loading, StatCard, Card } from "../components/ui";
import {
  formatCPF,
  formatPhone,
  formatPercentage,
  formatGrade,
} from "../utils/formatters";
import {
  calculateActivityStats,
  calculateAttendanceStats,
  getStudentAlerts,
  getStudentAchievements,
  getStudentGoals,
} from "../utils/dashboardUtils";
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

  const stats = calculateActivityStats(activities, submissions);
  const attendanceStats = calculateAttendanceStats(attendance);
  const alerts = getStudentAlerts(stats, attendanceStats);
  const achievements = getStudentAchievements(stats, attendanceStats);
  const goals = getStudentGoals(stats, attendanceStats);

  if (loading) {
    return <Loading text="Carregando dados do estudante..." size="lg" />;
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
          value={formatGrade(stats.averageGrade)}
          icon={TrendingUp}
          color="bg-purple-500"
          subtitle={stats.performanceLevel.level}
        />
        <StatCard
          title="Frequência"
          value={formatPercentage(attendanceStats.attendanceRate)}
          icon={Calendar}
          color="bg-indigo-500"
          subtitle={`${attendanceStats.attendedClasses}/${attendanceStats.totalClasses} presenças`}
        />
      </div>

      {/* Cards de Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Aluno */}
        <Card>
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
              <span className="font-medium">{formatCPF(studentData?.cpf)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium">
                {formatPhone(studentData?.phone)}
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
        </Card>

        {/* Desempenho Acadêmico */}
        <Card>
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
                {formatPercentage(stats.completionRate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Atividades Avaliadas:</span>
              <span className="font-medium">{stats.graded}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Média Geral:</span>
              <span className={`font-medium ${stats.performanceLevel.color}`}>
                {formatGrade(stats.averageGrade)} -{" "}
                {stats.performanceLevel.level}
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
        </Card>
      </div>

      {/* Análise de Frequência */}
      <Card>
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
            <p
              className={`text-2xl font-semibold ${attendanceStats.attendanceLevel.color}`}
            >
              {formatPercentage(attendanceStats.attendanceRate)}
            </p>
            <p className="text-sm text-gray-500">
              Taxa - {attendanceStats.attendanceLevel.level}
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
      </Card>

      {/* Conquistas e Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Conquistas
          </h3>
          <div className="space-y-3">
            {achievements.length > 0 ? (
              achievements.map((achievement) => {
                const IconComponent =
                  achievement.icon === "Award"
                    ? Award
                    : achievement.icon === "Calendar"
                      ? Calendar
                      : achievement.icon === "CheckCircle"
                        ? CheckCircle
                        : achievement.icon === "TrendingUp"
                          ? TrendingUp
                          : Award;

                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-2 rounded-md ${achievement.color}`}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    <div>
                      <span className="text-sm font-medium">
                        {achievement.title}
                      </span>
                      <p className="text-xs opacity-75">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Continue se dedicando para conquistar suas primeiras medalhas!
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Próximas Metas
          </h3>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`p-3 border rounded-md ${goal.color}`}
              >
                <p className="text-sm font-medium">{goal.title}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
