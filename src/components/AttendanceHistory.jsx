import { useState, useEffect } from "react";
import { Calendar, Users, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const AttendanceHistory = ({ teacherData = null, selectedClass = null }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    if (selectedClass && selectedClass.id) {
      fetchAttendanceHistory();
    }
  }, [selectedClass, currentMonth]);

  const fetchAttendanceHistory = async () => {
    if (!selectedClass) return;

    setLoading(true);
    try {
      const response = await api.get("/attendance");
      const allAttendances = response.data;

      // Filtrar por turma e mês atual
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
      );

      const classAttendances = allAttendances.filter((attendance) => {
        const attendanceDate = new Date(attendance.date);
        return (
          attendance.schoolClassId === selectedClass.id &&
          attendanceDate >= startOfMonth &&
          attendanceDate <= endOfMonth
        );
      });

      // Agrupar por data
      const groupedByDate = classAttendances.reduce((acc, attendance) => {
        const date = attendance.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(attendance);
        return acc;
      }, {});

      // Converter para array e ordenar por data (mais recente primeiro)
      const historyArray = Object.entries(groupedByDate)
        .map(([date, attendances]) => ({
          date,
          attendances,
          present: attendances.filter((att) => att.present).length,
          absent: attendances.filter((att) => !att.present).length,
          total: attendances.length,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setAttendanceHistory(historyArray);
    } catch (error) {
      toast.error("Erro ao carregar histórico de presenças");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
    setExpandedDate(null);
  };

  const toggleExpandDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const getAttendancePercentage = (present, total) => {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  if (!selectedClass) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Selecione uma turma para visualizar o histórico de chamadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Histórico de Chamadas
          </h3>
          <p className="text-sm text-gray-500">
            {selectedClass.name} •{" "}
            {currentMonth.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm font-medium text-gray-700 px-3">
            {currentMonth.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Próximo mês"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : attendanceHistory.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma chamada registrada neste mês</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attendanceHistory.map((dayRecord) => (
            <div
              key={dayRecord.date}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleExpandDate(dayRecord.date)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatShortDate(dayRecord.date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(dayRecord.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">
                          {dayRecord.present} presentes
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm font-medium text-red-600">
                          {dayRecord.absent} ausentes
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getAttendancePercentage(
                          dayRecord.present,
                          dayRecord.total,
                        )}
                        % de presença
                      </div>
                    </div>

                    <Eye
                      className={`h-5 w-5 transition-transform ${
                        expandedDate === dayRecord.date ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getAttendancePercentage(dayRecord.present, dayRecord.total)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {expandedDate === dayRecord.date && (
                <div className="p-4 bg-white border-t">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Detalhes da Chamada
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Presentes */}
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-2">
                        Presentes ({dayRecord.present})
                      </h5>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {dayRecord.attendances
                          .filter((att) => att.present)
                          .map((att) => (
                            <div
                              key={att.id}
                              className="text-sm text-gray-600 flex items-center"
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Aluno ID: {att.studentId}
                            </div>
                          ))}
                        {dayRecord.present === 0 && (
                          <p className="text-sm text-gray-400">
                            Nenhum aluno presente
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ausentes */}
                    <div>
                      <h5 className="text-sm font-medium text-red-700 mb-2">
                        Ausentes ({dayRecord.absent})
                      </h5>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {dayRecord.attendances
                          .filter((att) => !att.present)
                          .map((att) => (
                            <div
                              key={att.id}
                              className="text-sm text-gray-600 flex items-center"
                            >
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              Aluno ID: {att.studentId}
                            </div>
                          ))}
                        {dayRecord.absent === 0 && (
                          <p className="text-sm text-gray-400">
                            Nenhum aluno ausente
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
