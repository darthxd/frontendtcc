import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Eye,
  Star,
  Calendar,
  User,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import { activityService } from "../services/activityService";
import toast from "react-hot-toast";

const ActivityGrading = ({ activity, isOpen, onClose, onGradeSubmitted }) => {
  console.log("ActivityGrading component rendered with props:", {
    activity,
    isOpen,
    onClose,
    onGradeSubmitted,
  });

  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [gradingLoading, setGradingLoading] = useState(false);

  useEffect(() => {
    console.log(
      "ActivityGrading useEffect triggered - isOpen:",
      isOpen,
      "activity:",
      activity,
    );
    if (isOpen && activity) {
      loadSubmissions();
    }
  }, [isOpen, activity]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const submissionsData = await activityService.listSubmissionsByActivity(
        activity.id,
      );

      // Para cada submissão, buscar dados do aluno
      const submissionsWithStudents = await Promise.all(
        submissionsData.map(async (submission) => {
          try {
            const student = await activityService.getStudentById(
              submission.studentId,
            );
            return {
              ...submission,
              studentName: student.name,
              studentEmail: student.email,
            };
          } catch (error) {
            console.error("Erro ao buscar dados do aluno:", error);
            return {
              ...submission,
              studentName: "Nome não encontrado",
              studentEmail: "",
            };
          }
        }),
      );

      setSubmissions(submissionsWithStudents);
    } catch (error) {
      toast.error("Erro ao carregar submissões");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = async (submission) => {
    setLoading(true);
    try {
      const [studentResponse, submissionResponse] = await Promise.all([
        activityService.getStudentById(submission.studentId),
        activityService.getSubmissionById(submission.id),
      ]);

      setStudentData(studentResponse);
      setSubmissionDetails(submissionResponse);
      setSelectedSubmission(submission);
      setGradeValue(submissionResponse.grade?.toString() || "");
    } catch (error) {
      toast.error("Erro ao carregar detalhes da submissão");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrade = async () => {
    if (!gradeValue || gradeValue < 0 || gradeValue > activity.maxScore) {
      toast.error(`A nota deve estar entre 0 e ${activity.maxScore}`);
      return;
    }

    setGradingLoading(true);
    try {
      await activityService.submitGrade(selectedSubmission.id, {
        grade: parseFloat(gradeValue),
      });

      toast.success("Nota atribuída com sucesso!");

      // Atualizar a lista de submissões
      await loadSubmissions();

      // Fechar o modal de detalhes
      setSelectedSubmission(null);
      setStudentData(null);
      setSubmissionDetails(null);
      setGradeValue("");

      // Notificar componente pai
      if (onGradeSubmitted) {
        onGradeSubmitted();
      }
    } catch (error) {
      toast.error("Erro ao atribuir nota");
      console.error("Erro:", error);
    } finally {
      setGradingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubmissionStatus = (submission) => {
    if (submission.grade !== null && submission.grade !== undefined) {
      return { status: "graded", label: "Avaliado", color: "green" };
    }
    return { status: "pending", label: "Pendente", color: "yellow" };
  };

  const getGradeColor = (grade, maxScore) => {
    const percentage = (grade / maxScore) * 100;
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  console.log("ActivityGrading render check - isOpen:", isOpen);
  if (!isOpen) {
    console.log("ActivityGrading not rendering because isOpen is false");
    return null;
  }

  console.log("ActivityGrading IS RENDERING - activity:", activity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Correção de Atividade
              </h2>
              <p className="text-gray-600 mt-1">{activity?.title}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Prazo:{" "}
                  {activity?.deadline ? formatDate(activity.deadline) : "N/A"}
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Nota máxima: {activity?.maxScore || "N/A"}
                </span>
                {activity?.deadline && isDeadlinePassed(activity.deadline) && (
                  <span className="flex items-center text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Prazo expirado
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Lista de Submissões */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Submissões ({submissions.length})
              </h3>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma submissão encontrada
                  </h4>
                  <p className="text-gray-500">
                    Os alunos ainda não enviaram esta atividade.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission) => {
                    const { status, label, color } =
                      getSubmissionStatus(submission);
                    return (
                      <div
                        key={submission.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedSubmission?.id === submission.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {submission.studentName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {submission.studentEmail}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                color === "green"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {submission.submissionDate
                              ? formatDate(submission.submissionDate)
                              : "N/A"}
                          </span>
                          {submission.grade !== null &&
                            submission.grade !== undefined && (
                              <span
                                className={`font-medium ${getGradeColor(
                                  submission.grade,
                                  activity.maxScore,
                                )}`}
                              >
                                Nota: {submission.grade}
                              </span>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Detalhes da Submissão */}
          <div className="w-1/2 overflow-y-auto">
            {selectedSubmission ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Detalhes da Submissão
                  </h3>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  studentData &&
                  submissionDetails && (
                    <div className="space-y-6">
                      {/* Informações do Aluno */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Informações do Aluno
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nome:</span>
                            <span className="font-medium">
                              {studentData.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">
                              {studentData.email}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Enviado em:</span>
                            <span className="font-medium">
                              {submissionDetails.submissionDate
                                ? formatDate(submissionDetails.submissionDate)
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Resposta do Aluno */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Resposta
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {submissionDetails.answerText ||
                              "Nenhuma resposta fornecida."}
                          </p>
                        </div>
                      </div>

                      {/* Arquivo Anexo */}
                      {submissionDetails.fileUrl && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Arquivo Anexo
                          </h4>
                          <a
                            href={submissionDetails.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary-600 hover:text-primary-700"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visualizar arquivo
                          </a>
                        </div>
                      )}

                      {/* Atribuir Nota */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Atribuir Nota
                        </h4>
                        {submissionDetails.grade !== null &&
                          submissionDetails.grade !== undefined && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-md">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  <span className="text-sm text-green-800">
                                    Nota atual:{" "}
                                    <strong
                                      className={getGradeColor(
                                        submissionDetails.grade,
                                        activity.maxScore,
                                      )}
                                    >
                                      {submissionDetails.grade}
                                    </strong>{" "}
                                    de {activity.maxScore}
                                  </span>
                                </div>
                                <span className="text-xs text-green-600 font-medium">
                                  {Math.round(
                                    (submissionDetails.grade /
                                      activity.maxScore) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          )}

                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {submissionDetails.grade !== null
                                ? "Nova Nota"
                                : "Atribuir Nota"}{" "}
                              (0 a {activity.maxScore})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={activity.maxScore}
                              step="0.1"
                              value={gradeValue}
                              onChange={(e) => setGradeValue(e.target.value)}
                              className="input"
                              placeholder="0.0"
                            />
                          </div>
                          <button
                            onClick={handleSubmitGrade}
                            disabled={gradingLoading || !gradeValue}
                            className="btn btn-primary flex items-center"
                          >
                            {gradingLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            {submissionDetails.grade !== null
                              ? "Atualizar Nota"
                              : "Atribuir Nota"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Selecione uma submissão
                  </h4>
                  <p className="text-gray-500">
                    Escolha uma submissão da lista ao lado para visualizar os
                    detalhes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityGrading;
