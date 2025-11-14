import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Lock, Calendar, Users } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const CompletedCallsStatus = ({ teacherData = null, teacherClasses = [] }) => {
  const [completedCalls, setCompletedCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7), // YYYY-MM format
  );

  useEffect(() => {
    if (teacherClasses && teacherClasses.length > 0) {
      fetchCompletedCalls();
    }
  }, [teacherClasses, selectedMonth]);

  const fetchCompletedCalls = async () => {
    setLoading(true);
    try {
      // Buscar todas as presenças
      const response = await api.get("/attendance");
      const allAttendances = response.data;

      const students = await api.get("/student");
      const allStudents = students.data;

      const teacherClassIds = teacherClasses.map((cls) => cls.id);

      // Filtrar attendances das turmas do professor no mês selecionado
      const monthStart = new Date(`${selectedMonth}-02`);
      const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 2,
        1,
      );
      const teacherAttendances = allAttendances.filter((attendance) => {
        const attendanceDate = new Date(attendance.date);
        return (
          teacherClassIds.includes(attendance.schoolClassId) &&
          attendanceDate >= monthStart &&
          attendanceDate <= monthEnd
        );
      });
      // Agrupar por data e turma
      const groupedAttendances = teacherAttendances.reduce(
        (acc, attendance) => {
          const key = `${attendance.date}-${attendance.schoolClassId}`;
          if (!acc[key]) {
            acc[key] = {
              date: attendance.date,
              schoolClassId: attendance.schoolClassId,
              attendances: [],
            };
          }
          acc[key].attendances.push(attendance);
          return acc;
        },
        {},
      );

      // Verificar quais chamadas estão completas
      const completedCallsData = Object.values(groupedAttendances)
        .map((group) => {
          // Contar alunos da turma
          const classStudents = allStudents.map(
            (student) => student.schoolClassId === group.schoolClassId,
          );
          // console.log(classStudents);
          const className =
            teacherClasses.find((cls) => cls.id === group.schoolClassId)
              ?.name || `Turma ${group.schoolClassId}`;

          const isComplete = group.attendances.length === classStudents.length;
          const presentCount = group.attendances.filter(
            (att) => att.present,
          ).length;
          const absentCount = group.attendances.length - presentCount;

          return {
            date: group.date,
            className,
            schoolClassId: group.schoolClassId,
            isComplete,
            totalStudents: classStudents.length,
            presentCount,
            absentCount,
            attendanceRate:
              classStudents.length > 0
                ? Math.round((presentCount / classStudents.length) * 100)
                : 0,
          };
        })
        .filter((call) => {
          return call.isComplete;
        })
        .sort((a, b) => {
          new Date(b.date) - new Date(a.date);
        });

      // console.log(completedCallsData);
      setCompletedCalls(completedCallsData);
    } catch (error) {
      toast.error("Erro ao carregar chamadas finalizadas");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceBgColor = (rate) => {
    if (rate >= 90) return "bg-green-100";
    if (rate >= 75) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (teacherClasses.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Você não possui turmas para visualizar chamadas finalizadas
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
            Chamadas Finalizadas
          </h3>
          <p className="text-sm text-gray-500">
            Chamadas que foram concluídas e estão bloqueadas para edição
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : completedCalls.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Nenhuma chamada finalizada encontrada para este mês
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Chamadas são automaticamente bloqueadas após serem salvas
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {completedCalls.length}
              </div>
              <div className="text-sm text-blue-600">Chamadas Finalizadas</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  completedCalls.reduce(
                    (acc, call) => acc + call.attendanceRate,
                    0,
                  ) / completedCalls.length || 0,
                )}
                %
              </div>
              <div className="text-sm text-green-600">
                Taxa Média de Presença
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {
                  [...new Set(completedCalls.map((call) => call.schoolClassId))]
                    .length
                }
              </div>
              <div className="text-sm text-purple-600">Turmas Ativas</div>
            </div>
          </div>

          {completedCalls.map((call, index) => (
            <div
              key={`${call.date}-${call.schoolClassId}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {call.className}
                    </h4>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      ID: {call.schoolClassId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(call.date)} • {call.totalStudents} alunos
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {call.presentCount}
                      </span>
                    </div>
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {call.absentCount}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getAttendanceBgColor(call.attendanceRate)} ${getAttendanceColor(call.attendanceRate)}`}
                  >
                    {call.attendanceRate}% presença
                  </div>
                </div>

                <div className="flex items-center text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="font-medium text-blue-800">
              Sobre Chamadas Finalizadas
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Chamadas são automaticamente finalizadas quando todos os alunos da
              turma têm sua presença registrada. Uma vez finalizadas, não podem
              ser editadas para manter a integridade dos dados. Para alterações,
              entre em contato com a administração.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedCallsStatus;
