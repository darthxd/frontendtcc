import { useState, useEffect } from "react";
import { Fingerprint, Calendar, Users, Search, RefreshCw, AlertCircle, Clock, Download } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const SecretaryLogs = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("presence"); // presence, biometry
  const [presenceLogs, setPresenceLogs] = useState([]);
  const [filteredPresenceLogs, setFilteredPresenceLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, dateFilter, presenceLogs]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Buscar logs de presença
      const presenceResponse = await api.get("/presencelog");
      const presenceData = presenceResponse.data || [];

      // Buscar estudantes para resolver nomes
      const studentsResponse = await api.get("/student");
      const studentsData = studentsResponse.data || [];

      setPresenceLogs(presenceData);
      setStudents(studentsData);
      setFilteredPresenceLogs(presenceData);
    } catch (error) {
      toast.error("Erro ao carregar logs");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = presenceLogs;

    // Filtrar por data
    if (dateFilter) {
      filtered = filtered.filter((log) => log.date === dateFilter);
    }

    // Filtrar por termo de busca (nome do aluno ou ID)
    if (searchTerm) {
      filtered = filtered.filter((log) => {
        const student = students.find((s) => s.id === log.studentId);
        return (
          student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student?.rm?.toString().includes(searchTerm) ||
          log.studentId?.toString().includes(searchTerm)
        );
      });
    }

    setFilteredPresenceLogs(filtered);
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student?.name || `Aluno #${studentId}`;
  };

  const getStudentRM = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student?.rm || "N/A";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const time = new Date(timeString);
    return time.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (entryTime, exitTime) => {
    if (!entryTime || !exitTime) return "Em andamento";
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diff = exit - entry;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  const exportToCSV = () => {
    const headers = ["Data", "RM", "Nome do Aluno", "Entrada", "Saída", "Duração"];
    const rows = filteredPresenceLogs.map((log) => [
      formatDate(log.date),
      getStudentRM(log.studentId),
      getStudentName(log.studentId),
      formatTime(log.entryTime),
      formatTime(log.exitTime),
      calculateDuration(log.entryTime, log.exitTime),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `logs_presenca_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório exportado com sucesso!");
  };

  const getLogsToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return presenceLogs.filter((log) => log.date === today);
  };

  const getLogsThisWeek = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return presenceLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= weekAgo && logDate <= today;
    });
  };

  const getActiveStudents = () => {
    return presenceLogs.filter((log) => log.entryTime && !log.exitTime).length;
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
          <h1 className="text-2xl font-bold text-gray-900">Logs de Acesso</h1>
          <p className="text-gray-600">
            Visualize registros de biometria e presença dos alunos
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="btn btn-secondary flex items-center"
            disabled={filteredPresenceLogs.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button
            onClick={fetchData}
            className="btn btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Registros</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {presenceLogs.length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <Fingerprint className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Hoje</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {getLogsToday().length}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Esta Semana</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {getLogsThisWeek().length}
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Na Escola</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {getActiveStudents()}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab("presence")}
              className={`${
                selectedTab === "presence"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Logs de Presença
            </button>
            <button
              onClick={() => setSelectedTab("biometry")}
              className={`${
                selectedTab === "biometry"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Fingerprint className="h-5 w-5 mr-2" />
              Registros de Biometria
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {selectedTab === "presence" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou RM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Presence Logs Table */}
              {filteredPresenceLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Nenhum registro encontrado
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || dateFilter
                      ? "Tente ajustar os filtros de busca."
                      : "Não há logs de presença registrados."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RM
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aluno
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entrada
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saída
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duração
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPresenceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(log.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getStudentRM(log.studentId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {getStudentName(log.studentId)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTime(log.entryTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTime(log.exitTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {calculateDuration(log.entryTime, log.exitTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log.exitTime ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                Saiu
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Na escola
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {selectedTab === "biometry" && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <Fingerprint className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Registros de Biometria
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Esta seção mostra os alunos com biometria cadastrada no sistema.
                </p>
              </div>

              {/* Students with Biometry */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  Alunos com Biometria Cadastrada
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students
                    .filter((s) => s.biometry === true)
                    .map((student) => (
                      <div
                        key={student.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 rounded-full p-2">
                            <Fingerprint className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              RM: {student.rm}
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Ativo
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {students.filter((s) => s.biometry === true).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm">Nenhum aluno com biometria cadastrada</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  Estatísticas de Biometria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card bg-green-50">
                    <p className="text-sm font-medium text-green-700">
                      Com Biometria
                    </p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {students.filter((s) => s.biometry === true).length}
                    </p>
                  </div>
                  <div className="card bg-yellow-50">
                    <p className="text-sm font-medium text-yellow-700">
                      Sem Biometria
                    </p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">
                      {students.filter((s) => !s.biometry).length}
                    </p>
                  </div>
                  <div className="card bg-blue-50">
                    <p className="text-sm font-medium text-blue-700">
                      Taxa de Cadastro
                    </p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {students.length > 0
                        ? Math.round(
                            (students.filter((s) => s.biometry === true).length /
                              students.length) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Sobre os Logs de Acesso
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Os logs de presença registram automaticamente a entrada e saída dos
              alunos através da biometria. Alunos marcados como "Na escola" ainda
              não registraram a saída. Você pode exportar os dados para análise
              posterior clicando no botão "Exportar".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryLogs;
