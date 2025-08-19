import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  BookOpen,
  Save,
  CheckCircle,
  XCircle,
  User,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const AttendanceCall = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingAttendances, setExistingAttendances] = useState([]);
  const [isCallLocked, setIsCallLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchTeacherData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchClassStudents();
      fetchExistingAttendances();
    }
  }, [selectedClass, selectedDate]);

  const fetchTeacherData = async () => {
    try {
      const response = await api.get(
        `/teacher/username/${currentUser.username}`,
      );
      const teacher = response.data;
      setTeacherData(teacher);

      if (teacher.schoolClassIds && teacher.schoolClassIds.length > 0) {
        await fetchTeacherClasses(teacher.schoolClassIds);
      } else {
        setTeacherClasses([]);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do professor");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherClasses = async (classIds) => {
    try {
      const response = await api.get("/schoolclass");
      const allClasses = response.data;
      const teacherClassesData = allClasses.filter((schoolClass) =>
        classIds.includes(schoolClass.id),
      );
      setTeacherClasses(teacherClassesData);
    } catch (error) {
      toast.error("Erro ao carregar turmas");
      console.error("Erro:", error);
    }
  };

  const fetchClassStudents = async () => {
    if (!selectedClass) return;

    setLoadingStudents(true);
    try {
      const response = await api.get(`/schoolclass/${selectedClass}/students`);
      const classStudents = response.data;
      setStudents(classStudents);

      // Inicializar attendance data com false para todos os alunos
      const initialAttendanceData = {};
      classStudents.forEach((student) => {
        initialAttendanceData[student.id] = false;
      });
      setAttendanceData(initialAttendanceData);
    } catch (error) {
      toast.error("Erro ao carregar alunos da turma");
      console.error("Erro:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchExistingAttendances = async () => {
    if (!selectedClass || !selectedDate) return;

    try {
      const response = await api.get("/attendances");
      const allAttendances = response.data;
      const classAttendances = allAttendances.filter(
        (attendance) =>
          attendance.schoolClassId === parseInt(selectedClass) &&
          attendance.date === selectedDate,
      );

      setExistingAttendances(classAttendances);

      // Verificar se a chamada está bloqueada (já foi finalizada)
      if (classAttendances.length > 0) {
        // Se existem attendances para todos os alunos da turma, considerar como finalizada
        const studentsInClass = students.length;
        const isComplete =
          classAttendances.length === studentsInClass && studentsInClass > 0;

        if (isComplete) {
          setIsCallLocked(true);
          setLockMessage(
            `Chamada já finalizada em ${new Date(classAttendances[0].date).toLocaleDateString("pt-BR")}. Para alterações, entre em contato com a administração.`,
          );
        } else {
          setIsCallLocked(false);
          setLockMessage("");
        }
      } else {
        setIsCallLocked(false);
        setLockMessage("");
      }

      // Atualizar attendance data com dados existentes
      const updatedAttendanceData = { ...attendanceData };
      classAttendances.forEach((attendance) => {
        updatedAttendanceData[attendance.studentId] = attendance.present;
      });
      setAttendanceData(updatedAttendanceData);
    } catch (error) {
      console.error("Erro ao carregar presenças existentes:", error);
    }
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    if (isCallLocked) {
      toast.error("Esta chamada já foi finalizada e não pode ser alterada");
      return;
    }

    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }));
  };

  const handleSelectAll = (isPresent) => {
    if (isCallLocked) {
      toast.error("Esta chamada já foi finalizada e não pode ser alterada");
      return;
    }

    const updatedData = {};
    students.forEach((student) => {
      updatedData[student.id] = isPresent;
    });
    setAttendanceData(updatedData);
  };

  const submitAttendances = async () => {
    if (!selectedClass || !selectedDate || students.length === 0) {
      toast.error("Selecione uma turma e data válidas");
      return;
    }

    if (isCallLocked) {
      toast.error("Esta chamada já foi finalizada e não pode ser alterada");
      return;
    }

    setSaving(true);
    try {
      // Criar array de attendances para enviar
      const attendanceList = students.map((student) => ({
        teacherId: teacherData.id,
        studentId: student.id,
        schoolClassId: parseInt(selectedClass),
        date: selectedDate,
        present: attendanceData[student.id] || false,
      }));

      await api.post("/attendance/list", attendanceList);
      toast.success("Chamada salva com sucesso!");

      // Atualizar attendances existentes
      await fetchExistingAttendances();
    } catch (error) {
      toast.error("Erro ao salvar chamada");
      console.error("Erro:", error);
    } finally {
      setSaving(false);
    }
  };

  const getSelectedClassName = () => {
    const classObj = teacherClasses.find(
      (cls) => cls.id === parseInt(selectedClass),
    );
    return classObj ? classObj.name : "";
  };

  const getPresentCount = () => {
    return Object.values(attendanceData).filter(Boolean).length;
  };

  const getAbsentCount = () => {
    return students.length - getPresentCount();
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/teacher-dashboard"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Realizar Chamada
            </h1>
            <p className="text-gray-600">
              Faça a chamada dos alunos da sua turma
            </p>
          </div>
        </div>
      </div>

      {/* Controles de Seleção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-2" />
            Data da Chamada
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input w-full"
          />
        </div>

        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="inline h-4 w-4 mr-2" />
            Turma
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input w-full"
          >
            <option value="">Selecione uma turma</option>
            {teacherClasses.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name} (ID: {schoolClass.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estatísticas */}
      {selectedClass && students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total de Alunos
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Presentes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {getPresentCount()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-red-500">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ausentes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {getAbsentCount()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Alunos para Chamada */}
      {selectedClass && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Lista de Chamada
              </h3>
              <p className="text-sm text-gray-500">
                {getSelectedClassName()} • {selectedDate}
              </p>
              {students.length > 0 && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getPresentCount() + getAbsentCount() === students.length
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${((getPresentCount() + getAbsentCount()) / students.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {getPresentCount() + getAbsentCount()}/{students.length}{" "}
                    marcados
                  </span>
                </div>
              )}
            </div>

            {students.length > 0 && !isCallLocked && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSelectAll(true)}
                  className="btn btn-secondary text-sm flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Todos Presentes
                </button>
                <button
                  onClick={() => handleSelectAll(false)}
                  className="btn btn-secondary text-sm flex items-center"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Todos Ausentes
                </button>
              </div>
            )}
          </div>

          {loadingStudents ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedClass
                  ? "Nenhum aluno encontrado nesta turma"
                  : "Selecione uma turma para ver os alunos"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {student.id} • {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <label
                        className={`flex items-center ${isCallLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      >
                        <input
                          type="checkbox"
                          checked={attendanceData[student.id] || false}
                          onChange={(e) =>
                            handleAttendanceChange(student.id, e.target.checked)
                          }
                          disabled={isCallLocked}
                          className="sr-only"
                        />
                        <div
                          className={`relative w-6 h-6 rounded-md border-2 transition-colors ${
                            attendanceData[student.id]
                              ? "bg-green-500 border-green-500"
                              : isCallLocked
                                ? "bg-gray-200 border-gray-300"
                                : "bg-white border-gray-300 hover:border-green-400"
                          }`}
                        >
                          {attendanceData[student.id] && (
                            <CheckCircle className="h-4 w-4 text-white absolute top-0.5 left-0.5" />
                          )}
                        </div>
                        <span
                          className={`ml-2 text-sm font-medium ${isCallLocked ? "text-gray-500" : "text-gray-700"}`}
                        >
                          {isCallLocked
                            ? attendanceData[student.id]
                              ? "Presente"
                              : "Ausente"
                            : "Presente"}
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Link to="/teacher-dashboard" className="btn btn-secondary">
                  {isCallLocked ? "Voltar" : "Cancelar"}
                </Link>
                {!isCallLocked && (
                  <button
                    onClick={submitAttendances}
                    disabled={saving}
                    className="btn btn-primary flex items-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Chamada
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Aviso sobre dados existentes */}
      {existingAttendances.length > 0 && (
        <div
          className={`card ${isCallLocked ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${isCallLocked ? "bg-red-500" : "bg-yellow-500"}`}
              >
                <span className="text-white text-xs font-bold">
                  {isCallLocked ? "🔒" : "!"}
                </span>
              </div>
            </div>
            <div>
              <h4
                className={`font-medium ${isCallLocked ? "text-red-800" : "text-yellow-800"}`}
              >
                {isCallLocked ? "Chamada Finalizada" : "Chamada já realizada"}
              </h4>
              <p
                className={`text-sm mt-1 ${isCallLocked ? "text-red-700" : "text-yellow-700"}`}
              >
                {isCallLocked
                  ? lockMessage
                  : "Já existe uma chamada registrada para esta turma na data selecionada. Os dados existentes foram carregados. Salvar novamente irá sobrescrever os registros anteriores."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCall;
