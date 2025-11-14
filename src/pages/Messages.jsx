import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Inbox,
  Globe,
  Users,
  User,
  Plus,
  Trash2,
  X,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle,
  Filter,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { messageService } from "../services/messageService";
import { Loading, Card, EmptyState } from "../components/ui";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all"); // all, global, class, private
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
  }, [user]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getVisibleMessages(user.id);
      // Ordenar por data mais recente
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setMessages(sortedData);
    } catch (error) {
      toast.error("Erro ao carregar mensagens");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      return;
    }

    try {
      await messageService.deleteMessage(messageId);
      toast.success("Mensagem excluída com sucesso!");
      loadMessages();
      setSelectedMessage(null);
    } catch (error) {
      toast.error("Erro ao excluir mensagem");
      console.error("Erro:", error);
    }
  };

  const canSendGlobalMessages = () => {
    return ["ROLE_ADMIN", "ROLE_SECRETARY"].includes(user.role);
  };

  const canSendClassMessages = () => {
    return [
      "ROLE_ADMIN",
      "ROLE_SECRETARY",
      "ROLE_COORDINATOR",
      "ROLE_TEACHER",
    ].includes(user.role);
  };

  const canSendPrivateMessages = () => {
    return true; // Todos podem enviar mensagens privadas
  };

  const canDeleteMessage = (message) => {
    // Admin pode excluir qualquer mensagem
    if (user.role === "ROLE_ADMIN") {
      return true;
    }
    // Usuários podem excluir apenas suas próprias mensagens
    // Comparar pelo nome do autor já que authorId não vem na response
    console.log(user);
    console.log(message.authorName);
    return message.authorName === user.name;
  };

  const getMessageIcon = (target) => {
    switch (target) {
      case "GLOBAL":
        return <Globe className="h-5 w-5 text-blue-500" />;
      case "CLASS":
        return <Users className="h-5 w-5 text-green-500" />;
      case "PRIVATE":
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMessageTypeLabel = (target) => {
    switch (target) {
      case "GLOBAL":
        return "Global";
      case "CLASS":
        return "Turma";
      case "PRIVATE":
        return "Privada";
      default:
        return "Desconhecida";
    }
  };

  const getMessageTypeBadgeColor = (target) => {
    switch (target) {
      case "GLOBAL":
        return "bg-blue-100 text-blue-800";
      case "CLASS":
        return "bg-green-100 text-green-800";
      case "PRIVATE":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true;
    return message.target.toLowerCase() === filter;
  });

  if (loading) {
    return <Loading text="Carregando mensagens..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-8 w-8 text-primary-600" />
            Mensagens
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie suas mensagens e comunicações
          </p>
        </div>
        <button
          onClick={() => setShowNewMessageModal(true)}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Mensagem
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Filter className="h-4 w-4 mr-1" />
          Todas
        </button>
        <button
          onClick={() => setFilter("global")}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === "global"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
          }`}
        >
          <Globe className="h-4 w-4 mr-1" />
          Globais
        </button>
        <button
          onClick={() => setFilter("class")}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === "class"
              ? "bg-green-600 text-white"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          <Users className="h-4 w-4 mr-1" />
          Turmas
        </button>
        <button
          onClick={() => setFilter("private")}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === "private"
              ? "bg-purple-600 text-white"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
          }`}
        >
          <User className="h-4 w-4 mr-1" />
          Privadas
        </button>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nenhuma mensagem encontrada"
          message="Não há mensagens para exibir no momento."
        />
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getMessageIcon(message.target)}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMessageTypeBadgeColor(
                        message.target,
                      )}`}
                    >
                      {getMessageTypeLabel(message.target)}
                    </span>
                    {message.target === "CLASS" && message.schoolClassId && (
                      <span className="text-xs text-gray-500">
                        • Turma ID: {message.schoolClassId}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {message.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {message.body}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {message.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
                {canDeleteMessage(message) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(message.id);
                    }}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <NewMessageModal
          user={user}
          onClose={() => setShowNewMessageModal(false)}
          onSuccess={() => {
            setShowNewMessageModal(false);
            loadMessages();
          }}
          canSendGlobalMessages={canSendGlobalMessages()}
          canSendClassMessages={canSendClassMessages()}
          canSendPrivateMessages={canSendPrivateMessages()}
        />
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          canDelete={canDeleteMessage(selectedMessage)}
          onDelete={handleDeleteMessage}
        />
      )}
    </div>
  );
};

// Modal para criar nova mensagem
const NewMessageModal = ({
  user,
  onClose,
  onSuccess,
  canSendGlobalMessages,
  canSendClassMessages,
  canSendPrivateMessages,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    target: "",
    schoolClassId: "",
    targetId: "",
  });
  const [classes, setClasses] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    // Definir target padrão baseado nas permissões
    if (user.role === "ROLE_STUDENT") {
      setFormData((prev) => ({ ...prev, target: "PRIVATE" }));
      loadRecipients();
    } else if (canSendGlobalMessages) {
      setFormData((prev) => ({ ...prev, target: "GLOBAL" }));
    } else if (canSendClassMessages) {
      setFormData((prev) => ({ ...prev, target: "CLASS" }));
      loadClasses();
    }
  }, []);

  const loadClasses = async () => {
    try {
      setLoadingData(true);
      const data = await messageService.getAllClasses();
      setClasses(data);
    } catch (error) {
      toast.error("Erro ao carregar turmas");
      console.error("Erro:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadRecipients = async () => {
    try {
      setLoadingData(true);
      let data = [];

      // Admin pode enviar para qualquer usuário
      if (user.role === "ROLE_ADMIN") {
        data = await messageService.getAllUsers();
      }
      // Secretaria, Coordenador e Professor podem enviar para todos exceto admins
      else if (
        user.role === "ROLE_SECRETARY" ||
        user.role === "ROLE_COORDINATOR" ||
        user.role === "ROLE_TEACHER"
      ) {
        data = await messageService.getUsersExcludingAdmins();
      }
      // Aluno pode enviar para todos exceto admins e outros alunos
      else if (user.role === "ROLE_STUDENT") {
        data = await messageService.getUsersExcludingAdminsAndStudents();
      }

      // Remover o próprio usuário da lista
      data = data.filter((recipient) => recipient.username !== user.username);

      setRecipients(data);
    } catch (error) {
      toast.error("Erro ao carregar destinatários");
      console.error("Erro:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleTargetChange = (newTarget) => {
    setFormData({
      ...formData,
      target: newTarget,
      schoolClassId: "",
      targetId: "",
    });

    if (newTarget === "CLASS" && classes.length === 0) {
      loadClasses();
    } else if (newTarget === "PRIVATE" && recipients.length === 0) {
      loadRecipients();
    }
  };

  const getYearLabel = (year) => {
    const years = {
      FIRST: "1º Ano",
      FIRST_YEAR: "1º Ano",
      SECOND: "2º Ano",
      SECOND_YEAR: "2º Ano",
      THIRD: "3º Ano",
      THIRD_YEAR: "3º Ano",
    };
    return years[year] || year;
  };

  const getShiftLabel = (shift) => {
    const shifts = {
      MORNING: "Manhã",
      AFTERNOON: "Tarde",
      EVENING: "Noite",
    };
    return shifts[shift] || shift;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.target === "CLASS" && !formData.schoolClassId) {
      toast.error("Por favor, selecione uma turma");
      return;
    }

    if (formData.target === "PRIVATE" && !formData.targetId) {
      toast.error("Por favor, selecione um destinatário");
      return;
    }

    try {
      setLoading(true);
      const messageData = {
        title: formData.title,
        body: formData.body,
        target: formData.target,
        authorId: user.id,
      };

      if (formData.target === "CLASS") {
        messageData.schoolClassId = parseInt(formData.schoolClassId);
      }

      if (formData.target === "PRIVATE") {
        messageData.targetId = parseInt(formData.targetId);
      }

      await messageService.createMessage(messageData);
      toast.success("Mensagem enviada com sucesso!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Send className="h-5 w-5 text-primary-600" />
            Nova Mensagem
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Mensagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Mensagem *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {canSendGlobalMessages && (
                <button
                  type="button"
                  onClick={() => handleTargetChange("GLOBAL")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                    formData.target === "GLOBAL"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">Global</span>
                </button>
              )}
              {canSendClassMessages && (
                <button
                  type="button"
                  onClick={() => handleTargetChange("CLASS")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                    formData.target === "CLASS"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Turma</span>
                </button>
              )}
              {canSendPrivateMessages && (
                <button
                  type="button"
                  onClick={() => handleTargetChange("PRIVATE")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                    formData.target === "PRIVATE"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Privada</span>
                </button>
              )}
            </div>
          </div>

          {/* Seleção de Turma (se CLASS) */}
          {formData.target === "CLASS" && (
            <div>
              <label
                htmlFor="schoolClassId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Turma *
              </label>
              {loadingData ? (
                <p className="text-sm text-gray-500">Carregando turmas...</p>
              ) : (
                <select
                  id="schoolClassId"
                  value={formData.schoolClassId}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolClassId: e.target.value })
                  }
                  className="input w-full bg-white"
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.course} - {getYearLabel(cls.year)} -{" "}
                      {getShiftLabel(cls.shift)} (Sala: {cls.name})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Seleção de Destinatário (se PRIVATE) */}
          {formData.target === "PRIVATE" && (
            <div>
              <label
                htmlFor="targetId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Destinatário *
              </label>
              {loadingData ? (
                <p className="text-sm text-gray-500">
                  Carregando destinatários...
                </p>
              ) : (
                <select
                  id="targetId"
                  value={formData.targetId}
                  onChange={(e) =>
                    setFormData({ ...formData, targetId: e.target.value })
                  }
                  className="input w-full bg-white"
                  required
                >
                  <option value="">Selecione um destinatário</option>
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name} - {getRoleLabel(recipient.role)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Título */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input w-full bg-white"
              placeholder="Digite o título da mensagem"
              required
            />
          </div>

          {/* Corpo da Mensagem */}
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mensagem *
            </label>
            <textarea
              id="body"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              rows={6}
              className="input w-full"
              placeholder="Digite o conteúdo da mensagem"
              required
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.target}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Função auxiliar para obter label da role
const getRoleLabel = (role) => {
  const roleLabels = {
    ROLE_ADMIN: "Administrador",
    ROLE_SECRETARY: "Secretaria",
    ROLE_COORDINATOR: "Coordenador",
    ROLE_TEACHER: "Professor",
    ROLE_STUDENT: "Aluno",
  };
  return roleLabels[role] || role;
};

// Modal para visualizar detalhes da mensagem
const MessageDetailModal = ({
  message = null,
  onClose = () => {},
  canDelete = false,
  onDelete = () => {},
}) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {message.target === "GLOBAL" && (
              <Globe className="h-6 w-6 text-blue-500" />
            )}
            {message.target === "CLASS" && (
              <Users className="h-6 w-6 text-green-500" />
            )}
            {message.target === "PRIVATE" && (
              <User className="h-6 w-6 text-purple-500" />
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                message.target === "GLOBAL"
                  ? "bg-blue-100 text-blue-800"
                  : message.target === "CLASS"
                    ? "bg-green-100 text-green-800"
                    : "bg-purple-100 text-purple-800"
              }`}
            >
              {message.target === "GLOBAL"
                ? "Global"
                : message.target === "CLASS"
                  ? "Turma"
                  : "Privada"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {message.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {message.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
          </div>

          {message.target === "CLASS" && message.schoolClassId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <span className="font-medium">Turma:</span> ID{" "}
                {message.schoolClassId}
              </p>
            </div>
          )}

          {message.target === "PRIVATE" && message.targetName && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <span className="font-medium">Destinatário:</span>{" "}
                {message.targetName}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {canDelete && (
              <button
                onClick={() => onDelete(message.id)}
                className="btn btn-danger inline-flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
