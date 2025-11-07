import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const CoordinatorSchedules = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    schoolClassId: "",
    teacherId: "",
    subjectId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });

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
        const schoolClass = classesData.find(
          (c) => c.id === schedule.schoolClassId,
        );
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
      setSubjects(subjectsData);
      setTeachers(teachersData);
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
          s.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredSchedules(filtered);
  };

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        schoolClassId: schedule.schoolClassId,
        teacherId: schedule.teacherId,
        subjectId: schedule.subjectId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        schoolClassId: "",
        teacherId: "",
        subjectId: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFormData({
      schoolClassId: "",
      teacherId: "",
      subjectId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (
      !formData.schoolClassId ||
      !formData.teacherId ||
      !formData.subjectId ||
      !formData.dayOfWeek ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Validar horários
    if (formData.startTime >= formData.endTime) {
      toast.error(
        "O horário de término deve ser posterior ao horário de início",
      );
      return;
    }

    try {
      const submitData = {
        schoolClassId: parseInt(formData.schoolClassId),
        teacherId: parseInt(formData.teacherId),
        subjectId: parseInt(formData.subjectId),
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime + ":00", // Adicionar segundos
        endTime: formData.endTime + ":00",
      };

      if (editingSchedule) {
        await api.put(`/classschedule/${editingSchedule.id}`, submitData);
        toast.success("Horário atualizado com sucesso!");
      } else {
        await api.post("/classschedule", submitData);
        toast.success("Horário cadastrado com sucesso!");
      }

      handleCloseModal();
      fetchSchedules();
    } catch (error) {
      toast.error(
        editingSchedule
          ? "Erro ao atualizar horário"
          : "Erro ao cadastrar horário",
      );
      console.error("Erro:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este horário?")) {
      return;
    }

    try {
      await api.delete(`/classschedule/${id}`);
      toast.success("Horário excluído com sucesso!");
      fetchSchedules();
    } catch (error) {
      toast.error("Erro ao excluir horário");
      console.error("Erro:", error);
    }
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
    const days = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
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
      "bg-blue-50 border-blue-200 text-blue-700",
      "bg-green-50 border-green-200 text-green-700",
      "bg-purple-50 border-purple-200 text-purple-700",
      "bg-orange-50 border-orange-200 text-orange-700",
      "bg-pink-50 border-pink-200 text-pink-700",
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
          <h1 className="text-2xl font-bold text-gray-900">
            Horários das Turmas
          </h1>
          <p className="text-gray-600">
            Gerencie os horários de aulas de todas as turmas
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchSchedules}
            className="btn btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Horário
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por turma, matéria ou professor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dia da Semana
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="input"
            >
              <option value="all">Todos os dias</option>
              <option value="MONDAY">Segunda-feira</option>
              <option value="TUESDAY">Terça-feira</option>
              <option value="WEDNESDAY">Quarta-feira</option>
              <option value="THURSDAY">Quinta-feira</option>
              <option value="FRIDAY">Sexta-feira</option>
              <option value="SATURDAY">Sábado</option>
              <option value="SUNDAY">Domingo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de Horários
              </p>
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
              <p className="text-sm font-medium text-gray-500">Turmas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {classes.length}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Disciplinas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {subjects.length}
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Professores</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {teachers.length}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Grid by Day */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Horários por Dia da Semana
        </h2>
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum horário encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece cadastrando um novo horário para as turmas.
            </p>
            <div className="mt-6">
              <button
                onClick={() => handleOpenModal()}
                className="btn btn-primary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Horário
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {Object.keys(groupedByDay).map((day) => (
                    <th
                      key={day}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {getDayShort(day)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.entries(groupedByDay).map(([day, daySchedules]) => (
                    <td
                      key={day}
                      className="px-4 py-4 align-top border-r border-gray-200"
                    >
                      <div className="space-y-2">
                        {daySchedules.length === 0 ? (
                          <div className="text-xs text-gray-400 italic">
                            Sem horários
                          </div>
                        ) : (
                          daySchedules.map((schedule, idx) => (
                            <div
                              key={schedule.id}
                              className={`p-3 rounded-lg border ${getTimeSlotColor(
                                idx,
                              )} group relative`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center text-xs font-medium mb-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTime(schedule.startTime)} -{" "}
                                    {formatTime(schedule.endTime)}
                                  </div>
                                  <div className="text-sm font-semibold mb-1 truncate">
                                    {schedule.subjectName}
                                  </div>
                                  <div className="text-xs truncate">
                                    {schedule.className}
                                  </div>
                                  <div className="text-xs truncate text-gray-600">
                                    {schedule.teacherName}
                                  </div>
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleOpenModal(schedule)}
                                    className="p-1 hover:bg-white rounded"
                                    title="Editar"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(schedule.id)}
                                    className="p-1 hover:bg-white rounded text-red-600"
                                    title="Excluir"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule List by Class */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Horários por Turma
        </h2>
        {groupedByClass.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma turma com horários cadastrados
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByClass.map((classGroup) => (
              <div key={classGroup.className}>
                <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {classGroup.className}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Dia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Horário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Disciplina
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Professor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classGroup.schedules
                        .sort((a, b) => {
                          const dayOrder = [
                            "MONDAY",
                            "TUESDAY",
                            "WEDNESDAY",
                            "THURSDAY",
                            "FRIDAY",
                            "SATURDAY",
                            "SUNDAY",
                          ];
                          const dayCompare =
                            dayOrder.indexOf(a.dayOfWeek) -
                            dayOrder.indexOf(b.dayOfWeek);
                          if (dayCompare !== 0) return dayCompare;
                          return a.startTime.localeCompare(b.startTime);
                        })
                        .map((schedule) => (
                          <tr key={schedule.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getDayName(schedule.dayOfWeek)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                {formatTime(schedule.startTime)} -{" "}
                                {formatTime(schedule.endTime)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                                {schedule.subjectName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {schedule.teacherName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleOpenModal(schedule)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(schedule.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
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
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSchedule ? "Editar Horário" : "Novo Horário"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Turma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turma <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="schoolClassId"
                    value={formData.schoolClassId}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Disciplina */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disciplina <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Selecione uma disciplina</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Professor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Selecione um professor</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dia da Semana */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dia da Semana <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Selecione um dia</option>
                    <option value="MONDAY">Segunda-feira</option>
                    <option value="TUESDAY">Terça-feira</option>
                    <option value="WEDNESDAY">Quarta-feira</option>
                    <option value="THURSDAY">Quinta-feira</option>
                    <option value="FRIDAY">Sexta-feira</option>
                    <option value="SATURDAY">Sábado</option>
                    <option value="SUNDAY">Domingo</option>
                  </select>
                </div>

                {/* Horários */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Início <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário de Término <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Atenção:</strong> Verifique se não há conflitos de
                      horários para a mesma turma ou professor no mesmo dia e
                      horário.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSchedule ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorSchedules;
