import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  User,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { attendanceService } from "../services/attendanceService";
import { activityService } from "../services/activityService";
import {
  Loading,
  StatCard,
  EmptyState,
  InlineLoading,
  Card,
} from "../components/ui";
import {
  formatDate,
  formatDateTime,
  getCurrentDate,
  getPerformanceLevel,
  getAttendanceLevel,
} from "../utils/formatters";
import toast from "react-hot-toast";

const StudentAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [attendanceData, setAttendanceData] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadStudentData();
  }, []);

  useEffect(() => {
    if (studentData) {
      loadAttendanceData();
    }
  }, [selectedDate, studentData]);

  const loadStudentData = async () => {
    try {
      const student = await activityService.getStudentByUsername(user.username);
      setStudentData(student);
    } catch (error) {
      toast.error("Erro ao carregar dados do estudante");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async () => {
    if (!studentData) return;

    setLoadingAttendance(true);
    try {
      const attendance = await attendanceService.getStudentAttendanceByDate(
        studentData.id,
        selectedDate,
      );

      setAttendanceData(attendance);

      // Buscar dados dos professores se houver presenças
      if (attendance.length > 0) {
        const teacherIds = attendance.map((item) => item.teacherId);
        const teachersData =
          await attendanceService.getMultipleTeachers(teacherIds);
        setTeachers(teachersData);
      } else {
        setTeachers({});
      }
    } catch (error) {
      toast.error("Erro ao carregar presenças");
      console.error("Erro:", error);
      setAttendanceData([]);
      setTeachers({});
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  const getAttendanceStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter((item) => item.present).length;
    const absent = total - present;
    const inSchool = attendanceData.filter((item) => item.isInSchool).length;

    return { total, present, absent, inSchool };
  };

  const getStatusIcon = (present, isInSchool) => {
    if (present) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (isInSchool) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (present, isInSchool) => {
    if (present) {
      return { text: "Presente", color: "text-green-700 bg-green-50" };
    } else if (isInSchool) {
      return {
        text: "Na escola, mas ausente da aula",
        color: "text-yellow-700 bg-yellow-50",
      };
    } else {
      return {
        text: "Ausente da escola",
        color: "text-red-700 bg-red-50",
      };
    }
  };

  const stats = getAttendanceStats();

  if (loading) {
    return <Loading text="Carregando dados do estudante..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minhas Presenças</h1>
        <p className="text-gray-600">
          Acompanhe sua frequência escolar por data
        </p>
      </div>

      {/* Seletor de Data */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Selecionar Data
          </h3>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate("prev")}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="Dia anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex-1 max-w-xs">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            onClick={() => navigateDate("next")}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="Próximo dia"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => setSelectedDate(getCurrentDate())}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
          >
            Hoje
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Data selecionada:{" "}
          <span className="font-medium">{formatDate(selectedDate)}</span>
        </div>
      </div>

      {/* Estatísticas do Dia */}
      {attendanceData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total de Aulas"
            value={stats.total}
            icon={Clock}
            color="bg-blue-500"
          />

          <StatCard
            title="Presenças"
            value={stats.present}
            icon={CheckCircle}
            color="bg-green-500"
          />

          <StatCard
            title="Faltas"
            value={stats.absent}
            icon={XCircle}
            color="bg-red-500"
          />

          <StatCard
            title="Estava na Escola"
            value={stats.inSchool}
            icon={User}
            color="bg-purple-500"
          />
        </div>
      )}

      {/* Lista de Presenças */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Presenças do Dia
          </h3>
          {loadingAttendance && <InlineLoading />}
        </div>

        {loadingAttendance ? (
          <Loading text="Carregando presenças..." />
        ) : attendanceData.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhuma aula encontrada"
            message="Não há registros de aulas para a data selecionada."
          />
        ) : (
          <div className="space-y-3">
            {attendanceData.map((attendance, index) => {
              const teacher = teachers[attendance.teacherId];
              const status = getStatusText(
                attendance.present,
                attendance.isInSchool,
              );

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(attendance.present, attendance.isInSchool)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {teacher
                            ? teacher.name
                            : `Professor ID: ${attendance.teacherId}`}
                        </h4>
                        {teacher && teacher.subject && (
                          <span className="text-xs text-gray-500">
                            • {teacher.subject.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-500">
                          Data: {formatDateTime(attendance.date)}
                        </p>
                        {teacher && teacher.email && (
                          <p className="text-xs text-gray-500">
                            {teacher.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Informações Adicionais */}
      {attendanceData.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Legenda dos Status
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Presente:</strong> Você estava presente na aula
                  </li>
                  <li>
                    <strong>Na escola, mas ausente da aula:</strong> Você estava
                    na escola mas não compareceu a esta aula específica
                  </li>
                  <li>
                    <strong>Ausente da escola:</strong> Você não estava na
                    escola neste dia
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentAttendance;
