import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Users } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const TeacherStats = ({ teacherData, teacherClasses }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    weeklyAttendance: 0,
    monthlyAttendance: 0,
    attendanceData: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week"); // week, month, year

  useEffect(() => {
    if (teacherClasses.length > 0) {
      fetchStats();
    }
  }, [teacherClasses, selectedPeriod]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Buscar todos os alunos das turmas do professor
      const studentsResponse = await api.get("/student");
      const allStudents = studentsResponse.data;

      const teacherClassIds = teacherClasses.map((cls) => cls.id);
      const teacherStudents = allStudents.filter((student) =>
        student.schoolClassIds?.some((classId) =>
          teacherClassIds.includes(classId),
        ),
      );

      // Buscar todas as presenças
      const attendancesResponse = await api.get("/attendance");
      const allAttendances = attendancesResponse.data;

      // Filtrar presenças das turmas do professor
      const teacherAttendances = allAttendances.filter((attendance) =>
        teacherClassIds.includes(attendance.schoolClassId),
      );

      // Calcular período baseado na seleção
      const now = new Date();
      let startDate;

      switch (selectedPeriod) {
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
      }

      // Filtrar presenças do período selecionado
      const periodAttendances = teacherAttendances.filter((attendance) => {
        const attendanceDate = new Date(attendance.date);
        return attendanceDate >= startDate && attendanceDate <= now;
      });

      // Calcular estatísticas
      const totalPresent = periodAttendances.filter(
        (att) => att.present,
      ).length;
      const totalAttendances = periodAttendances.length;
      const attendancePercentage =
        totalAttendances > 0
          ? Math.round((totalPresent / totalAttendances) * 100)
          : 0;

      // Agrupar por data para gráfico
      const attendanceByDate = periodAttendances.reduce((acc, attendance) => {
        const date = attendance.date;
        if (!acc[date]) {
          acc[date] = { date, present: 0, absent: 0, total: 0 };
        }
        acc[date].total++;
        if (attendance.present) {
          acc[date].present++;
        } else {
          acc[date].absent++;
        }
        return acc;
      }, {});

      const attendanceData = Object.values(attendanceByDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7); // Últimos 7 dias

      setStats({
        totalStudents: teacherStudents.length,
        totalClasses: teacherClasses.length,
        weeklyAttendance: selectedPeriod === "week" ? attendancePercentage : 0,
        monthlyAttendance:
          selectedPeriod === "month" ? attendancePercentage : 0,
        yearlyAttendance: selectedPeriod === "year" ? attendancePercentage : 0,
        currentAttendance: attendancePercentage,
        attendanceData,
      });
    } catch (error) {
      toast.error("Erro ao carregar estatísticas");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="card">
      <div className="flex items-center justify-between">
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
        {trend && (
          <div
            className={`flex items-center ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            <TrendingUp
              className={`h-4 w-4 mr-1 ${trend < 0 ? "transform rotate-180" : ""}`}
            />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (teacherClasses.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Você não possui turmas atribuídas para visualizar estatísticas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de período */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Estatísticas de Desempenho
          </h3>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === "week"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === "month"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setSelectedPeriod("year")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === "year"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ano
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total de Turmas"
              value={stats.totalClasses}
              icon={Calendar}
              color="bg-blue-500"
            />
            <StatCard
              title="Total de Alunos"
              value={stats.totalStudents}
              icon={Users}
              color="bg-green-500"
            />
            <StatCard
              title={`Taxa de Presença (${selectedPeriod === "week" ? "Semana" : selectedPeriod === "month" ? "Mês" : "Ano"})`}
              value={`${stats.currentAttendance}%`}
              icon={TrendingUp}
              color="bg-purple-500"
              subtitle={`Período selecionado`}
            />
            <StatCard
              title="Chamadas Realizadas"
              value={stats.attendanceData.length}
              icon={BarChart3}
              color="bg-orange-500"
              subtitle="Últimos 7 dias"
            />
          </div>
        )}
      </div>

      {/* Gráfico de presença dos últimos dias */}
      {stats.attendanceData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Presença dos Últimos 7 Dias
          </h3>
          <div className="space-y-3">
            {stats.attendanceData.map((day, index) => {
              const percentage =
                day.total > 0 ? Math.round((day.present / day.total) * 100) : 0;
              return (
                <div key={day.date} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">
                    {formatDate(day.date)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">
                        {day.present}/{day.total} presentes
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage >= 80
                            ? "bg-green-500"
                            : percentage >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumo por turma */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Resumo por Turma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherClasses.map((schoolClass) => (
            <div key={schoolClass.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {schoolClass.name}
                </h4>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-2">ID: {schoolClass.id}</p>
              <div className="text-xs text-gray-500">Turma ativa</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherStats;
