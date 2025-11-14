import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Search, X, Eye, Fingerprint } from "lucide-react";
import api from "../services/api";
import { studentService } from "../services/studentService";
import { schoolUnitService } from "../services/schoolUnitService";
import { ensureArray } from "../hooks/useSafeArray";
import toast from "react-hot-toast";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUpdatingStudent, setIsUpdatingStudent] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [biometryData, setBiometryData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Observa as mudanças nos campos nome e RM para gerar credenciais
  const watchName = watch("name");
  const watchRm = watch("rm");

  useEffect(() => {
    fetchStudents();
    fetchSchoolClasses();
    fetchSchoolUnits();
  }, []);

  useEffect(() => {
    const safeStudents = ensureArray(students, []);
    const filtered = safeStudents.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/student");
      const data = ensureArray(response.data, []);
      setStudents(data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      toast.error("Erro ao carregar alunos");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await api.get("/schoolclass");
      setSchoolClasses(response.data);
    } catch (error) {
      toast.error("Erro ao carregar turmas");
      console.error("Erro ao carregar turmas:", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchSchoolUnits = async () => {
    try {
      setLoadingUnits(true);
      const units = await schoolUnitService.getAllSchoolUnits();
      setSchoolUnits(units);
    } catch (error) {
      toast.error("Erro ao carregar unidades escolares");
      console.error("Erro:", error);
    } finally {
      setLoadingUnits(false);
    }
  };

  // Função helper para atualizar um aluno específico na lista
  const updateStudentInList = async (studentId) => {
    setIsUpdatingStudent(true);
    try {
      const updatedStudentResponse = await api.get(`/student/${studentId}`);
      const updatedStudent = updatedStudentResponse.data;

      // Atualiza o aluno na lista principal
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? updatedStudent : student,
        ),
      );

      // Se há um aluno selecionado no modal, atualiza também seus dados
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(updatedStudent);
        setLastUpdated(new Date());
      }

      return updatedStudent;
    } catch (error) {
      console.error("Erro ao atualizar dados do aluno:", error);
      // Em caso de erro na atualização específica, faz refresh completo como fallback
      await fetchStudents();
      throw error;
    } finally {
      setIsUpdatingStudent(false);
    }
  };

  // Cleanup do interval quando component desmonta ou modal fecha
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Para o auto-refresh quando modal fecha
  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedStudent(null);
    setLastUpdated(null);
  };

  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, data);
        toast.success("Aluno atualizado com sucesso!");
      } else {
        await studentService.createStudent(data);
        toast.success("Aluno criado com sucesso!");
      }

      setShowForm(false);
      setEditingStudent(null);
      reset();
      fetchStudents();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar aluno");
      console.error("Erro:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    const formData = {
      ...student,
      schoolClassId: student.schoolClass?.id || "",
      unitId: student.unitId || "",
    };
    reset(formData);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await api.delete(`/student/${id}`);
        toast.success("Aluno excluído com sucesso!");
        fetchStudents();
      } catch (error) {
        toast.error("Erro ao excluir aluno");
        console.error("Erro:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    reset({
      name: "",
      cpf: "",
      rm: "",
      ra: "",
      email: "",
      phone: "",
      birthdate: "",
      schoolClassId: "",
      unitId: "",
    });
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

  const registerBiometry = async (studentId) => {
    try {
      await toast.promise(
        api.post("/student/biometry/enroll", {
          studentId: studentId,
        }),
        {
          loading: "Coloque o dedo no sensor...",
          success: "Biometria cadastrada com sucesso!",
          error: (err) => {
            // Tratamento de erro mais específico
            if (err.response?.status === 400) {
              return "Erro na leitura biométrica. Tente novamente.";
            } else if (err.response?.status === 409) {
              return "Biometria já cadastrada para este aluno.";
            } else if (err.response?.status === 500) {
              return "Erro interno do servidor. Contate o administrador.";
            }
            return "Erro ao cadastrar a biometria. Tente novamente.";
          },
        },
      );
      try {
        await updateStudentInList(studentId);
      } catch (updateError) {
        toast.error(
          "Biometria cadastrada, mas os dados podem não estar atualizados. Recarregue a página.",
        );
      }
    } catch (error) {
      console.error("Erro ao cadastrar biometria:", error);
      if (error.response) {
        console.error("Detalhes do erro:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
    }
  };

  const deleteBiometry = async (studentId) => {
    try {
      await api.post("/student/biometry/delete", {
        studentId: studentId,
      });
      toast.success("Biometria do aluno limpa com sucesso.");
      try {
        await updateStudentInList(studentId);
      } catch (updateError) {
        toast.error(
          "Biometria limpa, mas os dados podem não estar atualizados. Recarregue a página.",
        );
      }
    } catch (error) {
      console.error("Erro ao limpar biometria:", error);
    }
  };

  const readBiometry = async () => {
    try {
      const response = await api.post("/student/biometry/read");
      const data = response.data;
      if (response.status !== 200) {
        throw new Error(`Erro ao ler biometria: ${response.statusText}`);
      }
      console.log(data);
      setSelectedStudent(data);
      return data;
    } catch (error) {
      console.error("Erro ao ler biometria:", error);
      throw error;
    }
  };

  const handleReadBiometry = async () => {
    try {
      const studentData = await toast.promise(readBiometry(), {
        loading: "Coloque o dedo no sensor",
        success: "Biometria lida com sucesso.",
        error: "Erro ao ler biometria.",
      });
      setShowDetailsModal(true);
      try {
        await updateStudentInList(studentData.id);
      } catch (updateError) {
        toast.error(
          "Biometria lida, mas os dados podem não estar atualizados. Recarregue a página.",
        );
        console.error("Erro ao atualizar aluno:", updateError);
      }
    } catch (error) {
      console.error("Falha na leitura da biometria:", error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
          <p className="text-gray-600">
            Gerencie os alunos cadastrados no sistema
          </p>
        </div>
        <div className="flex gap-x-2">
          {students.length > 0 && (
            <button
              onClick={() => handleReadBiometry()}
              className="btn btn-secondary flex items-center"
            >
              <Fingerprint className="h-4 w-4 mr-2" />
              Ler biometria
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Aluno
          </button>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar alunos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingStudent ? "Editar Aluno" : "Cadastrar Aluno"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Nome é obrigatório" })}
                    className="input w-full"
                    placeholder="Nome completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    {...register("cpf", { required: "CPF é obrigatório" })}
                    className="input w-full"
                    placeholder="111.222.333-44"
                    maxLength={11}
                  />
                  {errors.cpf && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.cpf.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RM
                  </label>
                  <input
                    type="text"
                    {...register("rm", { required: "RM é obrigatório" })}
                    className="input w-full"
                    placeholder="RM"
                    maxLength={5}
                  />
                  {errors.rm && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.rm.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RA
                  </label>
                  <input
                    type="text"
                    {...register("ra", { required: "RA é obrigatório" })}
                    className="input w-full"
                    placeholder="RA"
                    maxLength={13}
                  />
                  {errors.ra && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ra.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    className="input w-full"
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    className="input w-full"
                    placeholder="(11) 99999-9999"
                    maxLength={11}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    {...register("birthdate")}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    className="input w-full"
                    placeholder="Rua Exemplo, 123 - Bairro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade Escolar
                  </label>
                  <select
                    {...register("unitId", {
                      required: "Unidade escolar é obrigatória",
                    })}
                    className="input w-full bg-white"
                    disabled={loadingUnits}
                    defaultValue=""
                  >
                    <option value="">Todas as unidades</option>
                    {ensureArray(schoolUnits, []).map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                  {errors.unitId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.unitId.message}
                    </p>
                  )}
                  {loadingUnits && (
                    <p className="mt-1 text-sm text-gray-500">
                      Carregando unidades...
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turma
                  </label>
                  <select
                    {...register("schoolClassId", {
                      required: "Turma é obrigatória",
                    })}
                    className="input w-full bg-white"
                    disabled={loadingClasses}
                    defaultValue=""
                  >
                    <option value="">Selecione uma turma</option>
                    {schoolClasses.map((schoolClass) => (
                      <option key={schoolClass.id} value={schoolClass.id}>
                        {schoolClass.name}
                      </option>
                    ))}
                  </select>
                  {errors.schoolClassId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.schoolClassId.message}
                    </p>
                  )}
                  {loadingClasses && (
                    <p className="mt-1 text-sm text-gray-500">
                      Carregando turmas...
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingStudent ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de alunos */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biometria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presença
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ensureArray(filteredStudents, []).map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.rm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.cpf
                      ? student.cpf.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          "$1.$2.$3-$4",
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone
                      ? student.phone.replace(
                          /(\d{2})(\d{5})(\d{4})/,
                          "($1) $2-$3",
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.schoolClass ? `${student.schoolClass.name}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        student.biometry === true
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.biometry === true
                        ? "Cadastrada"
                        : "Não cadastrada"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        student.inschool === true
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.inschool === true ? "Na escola" : "Ausente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        student.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : student.status === "INACTIVE"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.status === "DELETED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status === "ACTIVE"
                        ? "Ativo"
                        : student.status === "INACTIVE"
                          ? "Pendente"
                          : student.status === "DELETED"
                            ? "Cancelado"
                            : "Pendente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver mais"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? "Nenhum aluno encontrado para esta pesquisa."
                  : "Nenhum aluno cadastrado."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes do aluno */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Detalhes do Aluno
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RA
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.ra || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RM
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.rm}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.cpf
                    ? selectedStudent.cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4",
                      )
                    : "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.address || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.phone
                    ? selectedStudent.phone.replace(
                        /(\d{2})(\d{5})(\d{4})/,
                        "($1) $2-$3",
                      )
                    : "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedStudent.birthdate
                    ? new Date(selectedStudent.birthdate).toLocaleDateString(
                        "pt-BR",
                        { timeZone: "UTC" },
                      )
                    : "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biometria Cadastrada
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      selectedStudent.biometry === true
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedStudent.biometry === true ? "Sim" : "Não"}
                  </span>
                </p>
              </div>
            </div>

            {selectedStudent.schoolClass && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Informações da Turma
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Turma
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedStudent.schoolClass.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Série/Ano
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {getYearLabel(selectedStudent.schoolClass.year)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curso
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedStudent.schoolClass.course}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Turno
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {getShiftLabel(selectedStudent.schoolClass.shift)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Indicador de última atualização */}
            {lastUpdated && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Última atualização: {lastUpdated.toLocaleString("pt-BR")}
                </p>
              </div>
            )}

            <div className="flex w-full gap-x-2 items-center justify-center">
              {selectedStudent.biometry ? (
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    className={`px-8 py-3 rounded-md transition-colors ${
                      selectedStudent.biometry
                        ? "bg-gray-400 hover:bg-gray-600"
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white`}
                    onClick={() => {
                      if (selectedStudent.biometry) {
                        deleteBiometry(selectedStudent.id);
                      }
                    }}
                    disabled={isUpdatingStudent}
                  >
                    Limpar biometria
                  </button>
                </div>
              ) : null}
              <div className="mt-6 flex justify-center gap-3">
                <button
                  className={`px-8 py-3 rounded-md transition-colors ${
                    isUpdatingStudent
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                  onClick={() => {
                    if (!isUpdatingStudent) {
                      registerBiometry(selectedStudent.id);
                    }
                  }}
                  disabled={isUpdatingStudent}
                >
                  {selectedStudent.biometry
                    ? "Atualizar Biometria"
                    : "Cadastrar Biometria"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
