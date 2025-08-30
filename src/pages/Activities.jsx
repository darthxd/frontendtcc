import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  CalendarClock,
  Users,
  FileText,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { activityService } from "../services/activityService";
import EmptyState from "../components/EmptyState";
import ActivityGrading from "../components/ActivityGrading";
import toast from "react-hot-toast";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showGrading, setShowGrading] = useState(false);
  const [gradingActivity, setGradingActivity] = useState(null);
  const [submissionsStats, setSubmissionsStats] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    maxScore: "",
    schoolClassId: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    loadTeacherData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadActivities();
    }
  }, [selectedClass]);

  const loadTeacherData = async () => {
    try {
      const teacher = await activityService.getTeacherByUsername(user.username);
      setTeacherData(teacher);

      if (teacher.schoolClassIds && teacher.schoolClassIds.length > 0) {
        const allClasses = await activityService.getSchoolClasses();
        const teacherClassesData = allClasses.filter((schoolClass) =>
          teacher.schoolClassIds.includes(schoolClass.id),
        );
        setTeacherClasses(teacherClassesData);

        if (teacherClassesData.length > 0) {
          setSelectedClass(teacherClassesData[0].id.toString());
        }
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do professor");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const activitiesData = await activityService.listActivitiesBySchoolClass(
        parseInt(selectedClass),
      );
      setActivities(activitiesData);

      // Carregar estatísticas de submissões para cada atividade
      await loadSubmissionsStats(activitiesData);
    } catch (error) {
      toast.error("Erro ao carregar atividades");
      console.error("Erro:", error);
    }
  };

  const loadSubmissionsStats = async (activities) => {
    const stats = {};

    for (const activity of activities) {
      try {
        const submissions = await activityService.listSubmissionsByActivity(
          activity.id,
        );
        const graded = submissions.filter(
          (s) => s.grade !== null && s.grade !== undefined,
        ).length;

        stats[activity.id] = {
          total: submissions.length,
          graded: graded,
          pending: submissions.length - graded,
        };
      } catch (error) {
        console.error(
          `Erro ao carregar submissões da atividade ${activity.id}:`,
          error,
        );
        stats[activity.id] = { total: 0, graded: 0, pending: 0 };
      }
    }

    setSubmissionsStats(stats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação usando o serviço
    const validationErrors = activityService.validateActivityData({
      ...formData,
      maxScore: parseFloat(formData.maxScore),
      schoolClassId: parseInt(formData.schoolClassId || selectedClass),
    });

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    try {
      const activityData = {
        ...formData,
        maxScore: parseFloat(formData.maxScore),
        teacherId: teacherData.id,
        schoolClassId: parseInt(formData.schoolClassId || selectedClass),
      };

      if (editingActivity) {
        await activityService.updateActivity(editingActivity.id, activityData);
        toast.success("Atividade atualizada com sucesso!");
      } else {
        await activityService.createActivity(activityData);
        toast.success("Atividade criada com sucesso!");
      }

      setShowForm(false);
      setEditingActivity(null);
      resetForm();
      loadActivities();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao salvar atividade";
      toast.error(errorMessage);
      console.error("Erro:", error);
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      deadline: activity.deadline,
      maxScore: activity.maxScore.toString(),
      schoolClassId: activity.schoolClassId.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
      try {
        await activityService.deleteActivity(id);
        toast.success("Atividade excluída com sucesso!");
        loadActivities();
      } catch (error) {
        toast.error("Erro ao excluir atividade");
        console.error("Erro:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      deadline: "",
      maxScore: "",
      schoolClassId: "",
    });
  };

  const handleGradeActivity = (activity) => {
    setGradingActivity(activity);
    setShowGrading(true);
  };

  const handleGradeSubmitted = () => {
    // Recarregar estatísticas após atribuir nota
    if (activities.length > 0) {
      loadSubmissionsStats(activities);
    }
    toast.success("Nota atribuída com sucesso!");
  };

  const formatDate = (dateString) => {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR");
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const calculateOverallStats = () => {
    const totalActivities = activities.length;
    const totalSubmissions = Object.values(submissionsStats).reduce(
      (acc, stat) => acc + stat.total,
      0,
    );
    const totalGraded = Object.values(submissionsStats).reduce(
      (acc, stat) => acc + stat.graded,
      0,
    );
    const totalPending = Object.values(submissionsStats).reduce(
      (acc, stat) => acc + stat.pending,
      0,
    );

    return { totalActivities, totalSubmissions, totalGraded, totalPending };
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Minhas Atividades
          </h1>
          <p className="text-gray-600">
            Gerencie as atividades das suas turmas
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingActivity(null);
            resetForm();
          }}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Atividade
        </button>
      </div>

      {/* Stats Cards */}
      {selectedClass && activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Total de Atividades
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {calculateOverallStats().totalActivities}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Submissões</p>
                <p className="text-lg font-semibold text-gray-900">
                  {calculateOverallStats().totalSubmissions}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Corrigidas</p>
                <p className="text-lg font-semibold text-gray-900">
                  {calculateOverallStats().totalGraded}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {calculateOverallStats().totalPending}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seletor de Turma */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <label className="text-sm font-medium text-gray-700">Turma:</label>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">Selecione uma turma</option>
            {teacherClasses.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingActivity ? "Editar Atividade" : "Nova Atividade"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo de Entrega *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nota Máxima *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.maxScore}
                  onChange={(e) =>
                    setFormData({ ...formData, maxScore: e.target.value })
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turma
                </label>
                <select
                  value={formData.schoolClassId || selectedClass}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolClassId: e.target.value })
                  }
                  className="input w-full"
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {teacherClasses.map((schoolClass) => (
                    <option key={schoolClass.id} value={schoolClass.id}>
                      {schoolClass.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingActivity(null);
                    resetForm();
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingActivity ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Atividades */}
      {selectedClass ? (
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="card">
              <EmptyState
                type="activities"
                title="Nenhuma atividade encontrada"
                description="Crie sua primeira atividade para esta turma e comece a gerenciar o aprendizado dos seus alunos."
                action="Nova Atividade"
                onActionClick={() => {
                  setShowForm(true);
                  setEditingActivity(null);
                  resetForm();
                }}
              />
            </div>
          ) : (
            activities.map((activity) => {
              const overdue = isOverdue(activity.deadline);
              return (
                <div key={activity.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {activity.title}
                        </h3>
                        {overdue && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">
                        {activity.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className={overdue ? "text-red-500" : ""}>
                            Postagem: {formatDate(activity.creationDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <CalendarClock className="h-4 w-4 mr-2" />
                          <span className={overdue ? "text-red-500" : ""}>
                            Conclusão: {formatDate(activity.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Star className="h-4 w-4 mr-2" />
                          Nota máxima: {activity.maxScore}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          Turma:{" "}
                          {teacherClasses.find(
                            (c) => c.id === activity.schoolClassId,
                          )?.name || activity.schoolClassId}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center text-gray-500 mb-1">
                            <FileText className="h-4 w-4 mr-2" />
                            {submissionsStats[activity.id] ? (
                              <span className="text-sm">
                                {submissionsStats[activity.id].total} submissões
                              </span>
                            ) : (
                              "Carregando..."
                            )}
                          </div>
                          {submissionsStats[activity.id] &&
                            submissionsStats[activity.id].total > 0 && (
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${
                                        (submissionsStats[activity.id].graded /
                                          submissionsStats[activity.id].total) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-green-600 font-medium min-w-0">
                                  {submissionsStats[activity.id].graded}/
                                  {submissionsStats[activity.id].total}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleGradeActivity(activity)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md relative"
                        title="Corrigir"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {submissionsStats[activity.id] &&
                          submissionsStats[activity.id].pending > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {submissionsStats[activity.id].pending}
                            </span>
                          )}
                      </button>
                      <button
                        onClick={() => handleEdit(activity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            type="students"
            title="Selecione uma turma"
            description="Escolha uma turma para visualizar e gerenciar suas atividades. Você pode selecionar uma turma no dropdown acima."
            icon={Users}
          />
        </div>
      )}

      {/* Modal de Correção */}
      {showGrading && gradingActivity && (
        <ActivityGrading
          activity={gradingActivity}
          isOpen={showGrading}
          onClose={() => {
            setShowGrading(false);
            setGradingActivity(null);
          }}
          onGradeSubmitted={handleGradeSubmitted}
        />
      )}
    </div>
  );
};

export default Activities;
