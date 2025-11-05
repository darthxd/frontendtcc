import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  AlertCircle,
  Filter,
  UserPlus,
  Trash,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const SecretaryEnrollments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [searchTerm, statusFilter, enrollments]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/student/enroll");
      const sortedEnrollments = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setEnrollments(sortedEnrollments);
    } catch (error) {
      toast.error("Erro ao carregar matrículas");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.rm?.includes(searchTerm) ||
          e.cpf?.includes(searchTerm) ||
          e.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredEnrollments(filtered);
  };

  const handleApprove = async (enrollmentId) => {
    if (
      window.confirm(
        "Tem certeza que deseja aprovar esta matrícula? O aluno poderá acessar o sistema.",
      )
    ) {
      try {
        await api.post(`/student/${enrollmentId}/setactive`);
        toast.success("Matrícula aprovada com sucesso!");
        fetchEnrollments();
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      } catch (error) {
        toast.error("Erro ao aprovar matrícula");
        console.error("Erro:", error);
      }
    }
  };

  const handleDeactivate = async (enrollmentId) => {
    if (
      window.confirm(
        "Tem certeza que deseja desativar esta matrícula? O aluno perderá o acesso ao sistema.",
      )
    ) {
      try {
        await api.post(`/student/${enrollmentId}/setinactive`);
        toast.success("Matrícula desativada com sucesso!");
        fetchEnrollments();
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      } catch (error) {
        toast.error("Erro ao desativar matrícula");
        console.error("Erro:", error);
      }
    }
  };

  const handleDelete = async (enrollmentId) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta matrícula? Esta ação não pode ser desfeita.",
      )
    ) {
      try {
        await api.delete(`/student/${enrollmentId}`);
        toast.success("Matrícula excluída com sucesso!");
        fetchEnrollments();
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      } catch (error) {
        toast.error("Erro ao excluir matrícula");
        console.error("Erro:", error);
      }
    }
  };

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetailsModal(true);
  };

  const getCourseLabel = (course) => {
    const courses = {
      ADM: "Administração",
      BIO: "Biologia",
      CV: "CV",
      DG: "Design Gráfico",
      DDI: "DDI",
      DS: "Desenvolvimento de Sistemas",
      EDF: "EDF",
      LOG: "Logística",
      MAT: "Matemática",
      MEC: "Mecânica",
      MED: "Medicina",
    };
    return courses[course] || course;
  };

  const getYearLabel = (year) => {
    const years = {
      FIRST_YEAR: "1º Ano",
      SECOND_YEAR: "2º Ano",
      THIRD_YEAR: "3º Ano",
    };
    return years[year] || year;
  };

  const getShiftLabel = (shift) => {
    const shifts = {
      MORNING: "Manhã",
      AFTERNOON: "Tarde",
      NIGHT: "Noite",
    };
    return shifts[shift] || shift;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Aprovada",
      },
      INACTIVE: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pendente",
      },
      DELETED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Cancelada",
      },
    };

    const config = statusConfig[status] || statusConfig.INACTIVE;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciar Matrículas
          </h1>
          <p className="text-gray-600">
            Visualize, aprove e gerencie as matrículas dos alunos
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/secretary/new-enrollment")}
            className="btn btn-primary flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nova Matrícula
          </button>
          <button
            onClick={fetchEnrollments}
            className="btn btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {enrollments.length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {enrollments.filter((e) => e.status === "INACTIVE").length}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Aprovadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {enrollments.filter((e) => e.status === "ACTIVE").length}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
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
              placeholder="Buscar por nome, RM, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="INACTIVE">Pendentes</option>
              <option value="ACTIVE">Aprovadas</option>
              <option value="DELETED">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments List */}
      {filteredEnrollments.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma matrícula encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros de busca."
              : "Não há matrículas cadastradas no momento."}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RM / CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        RM: {enrollment.rm}
                      </div>
                      <div className="text-sm text-gray-500">
                        CPF: {enrollment.cpf}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getYearLabel(enrollment.schoolClass.year)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getCourseLabel(enrollment.schoolClass.course)} -{" "}
                        {getShiftLabel(enrollment.schoolClass.shift)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(enrollment)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {enrollment.status === "INACTIVE" && (
                        <button
                          onClick={() => handleApprove(enrollment.id)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center"
                          title="Aprovar matrícula"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {enrollment.status === "ACTIVE" && (
                        <button
                          onClick={() => handleDeactivate(enrollment.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                          title="Desativar matrícula"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      {enrollment.status !== "DELETED" && (
                        <button
                          onClick={() => handleDelete(enrollment.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                          title="Excluir matrícula"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Detalhes da Matrícula
                  </h3>
                  <div className="mt-2">
                    {getStatusBadge(selectedEnrollment.status)}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Student Photo */}
              {selectedEnrollment.photoUrl && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={selectedEnrollment.photoUrl}
                    alt={selectedEnrollment.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
              )}

              {/* Student Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nome Completo
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedEnrollment.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">RM</p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedEnrollment.rm}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">CPF</p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedEnrollment.cpf}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">RA</p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedEnrollment.ra || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedEnrollment.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Telefone
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedEnrollment.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Data de Nascimento
                  </p>
                  <p className="text-base text-gray-900 mt-1">
                    {formatDate(selectedEnrollment.birthdate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p className="text-base text-gray-900 mt-1">
                    {selectedEnrollment.address}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Informações Acadêmicas
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ano</p>
                      <p className="text-base text-gray-900 mt-1">
                        {getYearLabel(selectedEnrollment.schoolClass.year)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Curso</p>
                      <p className="text-base text-gray-900 mt-1">
                        {getCourseLabel(selectedEnrollment.schoolClass.course)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Turno</p>
                    <p className="text-base text-gray-900 mt-1">
                      {getShiftLabel(selectedEnrollment.schoolClass.shift)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Turma</p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedEnrollment.schoolClass.name}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Data da Matrícula
                      </p>
                      <p className="text-base text-gray-900 mt-1">
                        {formatDate(selectedEnrollment.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(selectedEnrollment.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn btn-secondary"
                >
                  Fechar
                </button>
                {selectedEnrollment.status === "INACTIVE" && (
                  <button
                    onClick={() => handleApprove(selectedEnrollment.id)}
                    className="btn btn-primary flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar Matrícula
                  </button>
                )}
                {selectedEnrollment.status === "ACTIVE" && (
                  <button
                    onClick={() => handleDeactivate(selectedEnrollment.id)}
                    className="btn bg-red-600 hover:bg-red-700 text-white flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Desativar Matrícula
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretaryEnrollments;
