import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  RefreshCw,
  AlertCircle,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { activityService } from "../services/activityService";

const StudentSchedules = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedDay, setSelectedDay] = useState("all");
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [selectedDay, schedules]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      // Buscar dados do aluno
      const student = await activityService.getStudentByUsername(user.username);
      setStudentData(student);

      if (student.schoolClass) {
        await fetchSchedules(student.schoolClass.id);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do estudante");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (classId) => {
    try {
      // Buscar todos os horários
      const schedulesResponse = await api.get("/classschedule");
      const allSchedules = schedulesResponse.data || [];

      // Filtrar apenas os horários da turma do aluno
      const classSchedules = allSchedules.filter(
        (schedule) => schedule.schoolClassId === classId,
      );

      // Buscar disciplinas
      const subjectsResponse = await api.get("/schoolsubject");
      const subjectsData = subjectsResponse.data || [];

      // Buscar professores
      const teachersResponse = await api.get("/teacher");
      const teachersData = teachersResponse.data || [];

      // Enriquecer horários com informações completas
      const enrichedSchedules = classSchedules.map((schedule) => {
        const subject = subjectsData.find((s) => s.id === schedule.subjectId);
        const teacher = teachersData.find((t) => t.id === schedule.teacherId);

        return {
          ...schedule,
          subjectName: subject?.name || "N/A",
          teacherName: teacher?.name || "N/A",
        };
      });

      // Ordenar por dia da semana e horário
      const sortedSchedules = enrichedSchedules.sort((a, b) => {
        const dayOrder = {
          MONDAY: 1,
          TUESDAY: 2,
          WEDNESDAY: 3,
          THURSDAY: 4,
          FRIDAY: 5,
          SATURDAY: 6,
          SUNDAY: 7,
        };

        if (dayOrder[a.dayOfWeek] !== dayOrder[b.dayOfWeek]) {
          return dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek];
        }

        return a.startTime.localeCompare(b.startTime);
      });

      setSchedules(sortedSchedules);
      setFilteredSchedules(sortedSchedules);
    } catch (error) {
      toast.error("Erro ao carregar horários");
      console.error("Erro:", error);
    }
  };

  const filterSchedules = () => {
    let filtered = [...schedules];

    // Filtrar por dia da semana
    if (selectedDay !== "all") {
      filtered = filtered.filter((s) => s.dayOfWeek === selectedDay);
    }

    setFilteredSchedules(filtered);
  };

  const getDayName = (day) => {
    const days = {
      MONDAY: "Segunda-feira",
      TUESDAY: "Terça-feira",
      WEDNESDAY: "Quarta-feira",
      THURSDAY: "Quinta-feira",
      FRIDAY: "Sexta-feira",
      SATURDAY: "Sábado",
      SUNDAY: "Domingo",
    };
    return days[day] || day;
  };

  const getDayShort = (day) => {
    const days = {
      MONDAY: "Seg",
      TUESDAY: "Ter",
      WEDNESDAY: "Qua",
      THURSDAY: "Qui",
      FRIDAY: "Sex",
      SATURDAY: "Sáb",
      SUNDAY: "Dom",
    };
    return days[day] || day;
  };

  const getDayColor = (day) => {
    const colors = {
      MONDAY: "bg-blue-100 text-blue-800 border-blue-200",
      TUESDAY: "bg-green-100 text-green-800 border-green-200",
      WEDNESDAY: "bg-yellow-100 text-yellow-800 border-yellow-200",
      THURSDAY: "bg-purple-100 text-purple-800 border-purple-200",
      FRIDAY: "bg-pink-100 text-pink-800 border-pink-200",
      SATURDAY: "bg-indigo-100 text-indigo-800 border-indigo-200",
      SUNDAY: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[day] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const groupSchedulesByDay = () => {
    const grouped = {};
    const daysOrder = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    daysOrder.forEach((day) => {
      grouped[day] = filteredSchedules.filter((s) => s.dayOfWeek === day);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!studentData || !studentData.schoolClass) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Turma não encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Você precisa estar matriculado em uma turma para visualizar os
            horários.
          </p>
        </div>
      </div>
    );
  }

  const groupedSchedules = groupSchedulesByDay();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary-600" />
            Meus Horários
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Grade de horários da sua turma: {studentData.schoolClass.name}
          </p>
        </div>
        <button
          onClick={loadStudentData}
          className="btn btn-secondary flex items-center"
          title="Atualizar horários"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Filtrar por dia da semana
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDay("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDay === "all"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos os dias
          </button>
          {[
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
          ].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === day
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {getDayShort(day)}
            </button>
          ))}
        </div>
      </div>

      {/* Horários */}
      {filteredSchedules.length === 0 ? (
        <div className="card">
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum horário encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedDay === "all"
                ? "Não há horários cadastrados para sua turma."
                : `Não há aulas cadastradas para ${getDayName(selectedDay)}.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedules).map(([day, daySchedules]) => {
            if (daySchedules.length === 0) return null;

            return (
              <div key={day} className="card">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                  <div
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 ${getDayColor(
                      day,
                    )}`}
                  >
                    {getDayName(day)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {daySchedules.length}{" "}
                    {daySchedules.length === 1 ? "aula" : "aulas"}
                  </span>
                </div>

                <div className="space-y-3">
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary-100 rounded-lg p-2">
                              <BookOpen className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {schedule.subjectName}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <User className="h-4 w-4" />
                                <span>{schedule.teacherName}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Clock className="h-4 w-4" />
                          <span>
                            {schedule.startTime?.substring(0, 5)} -{" "}
                            {schedule.endTime?.substring(0, 5)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resumo */}
      {filteredSchedules.length > 0 && (
        <div className="card bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Aulas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSchedules.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Dias com Aula</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  Object.values(groupedSchedules).filter(
                    (schedules) => schedules.length > 0,
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSchedules;
