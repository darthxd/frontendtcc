import { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, Users, Search, RefreshCw, AlertCircle } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const CoordinatorSchedules = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [searchTerm, selectedDay, schedules]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      // Buscar horários
      const schedulesResponse = await api.get("/classschedule");
      const schedulesData = schedulesResponse.data || [];

      // Buscar turmas
      const classesResponse = await api.get("/schoolclass");
      const classesData = classesResponse.data || [];

      // Buscar disciplinas
      const subjectsResponse = await api.get("/schoolsubject");
      const subjectsData = subjectsResponse.data || [];

      // Buscar professores
      const teachersResponse = await api.get("/teacher");
      const teachersData = teachersResponse.data || [];

      // Enriquecer horários com informações completas
      const enrichedSchedules = schedulesData.map((schedule) => {
        const schoolClass = classesData.find((c) => c.id === schedule.schoolClassId);
        const subject = subjectsData.find((s) => s.id === schedule.subjectId);
        const teacher = teachersData.find((t) => t.id === schedule.teacherId);

        return {
          ...schedule,
          className: schoolClass?.name || "N/A",
          subjectName: subject?.name || "N/A",
          teacherName: teacher?.name || "N/A",
        };
      });

      setSchedules(enrichedSchedules);
      setFilteredSchedules(enrichedSchedules);
      setClasses(classesData);
    } catch (error) {
      toast.error("Erro ao carregar horários");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSchedules = () => {
    let filtered = [...schedules];

    // Filtrar por dia da semana
    if (selectedDay !== "all") {
      filtered = filtered.filter((s) => s.dayOfWeek === selectedDay);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time.substring(0, 5); // Remove seconds from HH:MM:SS
  };

  const groupSchedulesByDay = () => {
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const grouped = {};

    days.forEach((day) => {
      grouped[day] = filteredSchedules
        .filter((s) => s.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  };

  const getSchedulesByClass = () => {
    const grouped = {};

    classes.forEach((cls) => {
      grouped[cls.id] = {
        className: cls.name,
        schedules: filteredSchedules.filter((s) => s.schoolClassId === cls.id),
      };
    });

    return Object.values(grouped).filter((g) => g.schedules.length > 0);
  };

  const getTimeSlotColor = (index) => {
    const colors = [
      "bg-blue-50 border-blue-200",
      "bg-green-50 border-green-200",
      "bg-purple-50 border-purple-200",
      "bg-orange-50 border-orange-200",
      "bg-pink-50 border-pink-200",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const groupedByDay = groupSchedulesByDay();
  const groupedByClass = getSchedulesByClass();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Horários</h1>
          <p className="text-gray-600">
            Visualize e gerencie os horários de aulas das turmas
          </p>
        </div>
        <button
          onClick={fetchSchedules}
          className="btn btn-secondary flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Horários</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {schedules.length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Turmas Ativas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {classes.length}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Horários Hoje</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {schedules.filter((s) => {
                  const today = new Date().getDay();
                  const dayMap = { 0: "SUNDAY", 1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 4: "THURSDAY", 5: "FRIDAY", 6: "SATURDAY" };
                  return s.dayOfWeek === dayMap[today];
                }).length}
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por turma, disciplina ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Day Filter */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="input w-full bg-white"
          >
            <option value="all">Todos os dias</option>
            <option value="MONDAY">Segunda-feira</option>
            <option value="TUESDAY">Terça-feira</option>
            <option value="WEDNESDAY">Quarta-feira</option>
            <option value="THURSDAY">Quinta-feira</option>
            <option value="FRIDAY">Sexta-feira</option>
            <option value="SATURDAY">Sábado</option>
          </select>
        </div>
      </div>

      {/* Alert Info */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Informação sobre Horários
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Os horários são organizados por turma e dia da semana. Utilize os filtros para
              facilitar a visualização. Em caso de conflitos de horário, entre em contato com a
              administração.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule View by Day */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Grade Semanal de Horários
        </h2>

        {filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum horário encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedDay !== "all"
                ? "Tente ajustar os filtros de busca."
                : "Não há horários cadastrados no momento."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDay).map(([day, daySchedules]) => {
              if (daySchedules.length === 0) return null;

              return (
                <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="text-md font-semibold text-gray-900">
                        {getDayName(day)}
                      </h3>
                      <span className="ml-auto text-sm text-gray-500">
                        {daySchedules.length} {daySchedules.length === 1 ? "horário" : "horários"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {daySchedules.map((schedule, index) => (
                        <div
                          key={schedule.id}
                          className={`card ${getTimeSlotColor(index)} border`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-600 mr-2" />
                              <span className="text-sm font-semibold text-gray-900">
                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-500">Turma</p>
                              <p className="text-sm font-medium text-gray-900">
                                {schedule.className}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Disciplina</p>
                              <p className="text-sm font-medium text-gray-900">
                                {schedule.subjectName}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Professor</p>
                              <p className="text-sm text-gray-700">{schedule.teacherName}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule View by Class */}
      {groupedByClass.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Horários por Turma
          </h2>

          <div className="space-y-6">
            {groupedByClass.map((classGroup) => (
              <div
                key={classGroup.className}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="text-md font-semibold text-gray-900">
                      {classGroup.className}
                    </h3>
                    <span className="ml-auto text-sm text-gray-500">
                      {classGroup.schedules.length}{" "}
                      {classGroup.schedules.length === 1 ? "aula" : "aulas"} por semana
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disciplina
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Professor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classGroup.schedules
                        .sort((a, b) => {
                          const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
                          const dayCompare = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
                          if (dayCompare !== 0) return dayCompare;
                          return a.startTime.localeCompare(b.startTime);
                        })
                        .map((schedule) => (
                          <tr key={schedule.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {getDayShort(schedule.dayOfWeek)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {schedule.subjectName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">
                                {schedule.teacherName}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorSchedules;
