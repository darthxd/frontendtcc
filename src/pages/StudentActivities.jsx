import { useState, useEffect } from "react";
import {
  BookOpen,
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  Target,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { activityService } from "../services/activityService";
import { Loading, Card, EmptyState, StatusBadge } from "../components/ui";
import {
  formatDate,
  formatGrade,
  getStatusConfig,
  isPastDate,
} from "../utils/formatters";
import api from "../services/api";
import toast from "react-hot-toast";

const StudentActivities = () => {
  const [studentData, setStudentData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    answerText: "",
    fileUrl: "",
  });

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
    } catch (error) {
      toast.error("Erro ao carregar atividades");
      console.error("Erro:", error);
      // Set empty arrays to prevent crashes
      setActivities([]);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitActivity = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("studentId", studentData.id);
      formData.append("answerText", data.answerText);

      if (file) {
        formData.append("file", file);
      }

      if (!submissionData.answerText.trim()) {
        toast.error("A resposta é obrigatória");
        return;
      }

      await api.post(`/activity/submission/${selectedActivity.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Atividade enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar atividade");
      console.error("Erro:", error);
    }
  };

  // Formatação de data movida para utils/formatters.js

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getActivityStatus = (activity) => {
    const submission = submissions.find((s) => s.activityId === activity.id);
    const overdue = isOverdue(activity.deadline);

    if (submission) {
      if (submission.grade !== null && submission.grade !== undefined) {
        return {
          status: "graded",
          label: "Avaliado",
          color: "green",
          submission,
        };
      }
      return {
        status: "submitted",
        label: "Enviado",
        color: "blue",
        submission,
      };
    }

    if (overdue) {
      return {
        status: "overdue",
        label: "Atrasado",
        color: "red",
        submission: null,
      };
    }

    return {
      status: "pending",
      label: "Pendente",
      color: "yellow",
      submission: null,
    };
  };

  const calculateStats = () => {
    const total = activities.length;
    const submitted = submissions.length;
    const graded = submissions.filter((s) => s.grade !== null).length;
    const pending = total - submitted;
    const overdue = activities.filter((activity) => {
      const submission = submissions.find((s) => s.activityId === activity.id);
      return !submission && isOverdue(activity.deadline);
    }).length;

    return { total, submitted, graded, pending, overdue };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card">
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
    </div>
  );

  if (loading) {
    return <Loading text="Carregando suas atividades..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minhas Atividades</h1>
        <p className="text-gray-600">
          Visualize e gerencie suas atividades acadêmicas.
        </p>
      </div>

      {/* Stats Cards - Resumo das Atividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total de Atividades"
          value={stats.total}
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="Enviadas"
          value={stats.submitted}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Atrasadas"
          value={stats.overdue}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="Avaliadas"
          value={stats.graded}
          icon={GraduationCap}
          color="bg-purple-500"
        />
      </div>

      {/* Modal de Submissão */}
      {showSubmissionForm && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Enviar Atividade: {selectedActivity.title}
            </h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Descrição:</strong> {selectedActivity.description}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Prazo:</strong> {formatDate(selectedActivity.deadline)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Nota Máxima:</strong> {selectedActivity.maxScore}
              </p>
            </div>

            <form onSubmit={handleSubmitActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resposta *
                </label>
                <textarea
                  {...register("answerText", { required: true })}
                  rows={6}
                  className="input w-full"
                  placeholder="Digite sua resposta aqui..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmissionForm(false);
                    setSelectedActivity(null);
                    setSubmissionData({ answerText: "", fileUrl: "" });
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Enviar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Atividades */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Lista de Atividades
        </h3>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-500 mb-2">
              Não há atividades disponíveis para sua turma no momento.
            </p>
            {!studentData?.schoolClassId && (
              <p className="text-sm text-orange-600 bg-orange-50 rounded-md p-3 inline-block">
                ⚠️ Você não está atribuído a nenhuma turma. Entre em contato com
                a administração.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const { status, label, color, submission } =
                getActivityStatus(activity);
              const overdue = isOverdue(activity.deadline);

              return (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {activity.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            color === "green"
                              ? "bg-green-100 text-green-800"
                              : color === "blue"
                                ? "bg-blue-100 text-blue-800"
                                : color === "red"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {label}
                        </span>
                        {overdue && status === "pending" && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">
                        {activity.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-2" />
                          <span className={overdue ? "text-red-500" : ""}>
                            Conclusão: {formatDate(activity.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Nota máxima: {activity.maxScore}
                        </div>
                        {submission && submission.grade !== null && (
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            <span
                              className={`font-medium ${
                                submission.grade >= 7
                                  ? "text-green-600"
                                  : submission.grade >= 5
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              Nota: {submission.grade}
                            </span>
                          </div>
                        )}
                      </div>

                      {submission && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">
                            <strong>Enviado em:</strong>{" "}
                            {formatDate(submission.submissionDate)}
                          </p>
                          {submission.answerText && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Resposta:</strong>{" "}
                              {submission.answerText.substring(0, 100)}
                              {submission.answerText.length > 100 && "..."}
                            </p>
                          )}
                          {submission.fileUrl && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Arquivo:</strong>{" "}
                              <a
                                href={submission.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Ver arquivo
                              </a>
                            </p>
                          )}
                          {submission.feedback && (
                            <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                              <p className="text-sm text-gray-700">
                                <strong>Feedback do Professor:</strong>
                              </p>
                              <p className="text-sm text-gray-600">
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {status === "pending" && !overdue && (
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowSubmissionForm(true);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          Enviar
                        </button>
                      )}
                      {status === "pending" && overdue && (
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowSubmissionForm(true);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          Enviar (Atrasado)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentActivities;
