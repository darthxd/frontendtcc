import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import Select from "react-select";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [expandedSubjectsRows, setExpandedSubjectsRows] = useState({});
  const [expandedClassesRows, setExpandedClassesRows] = useState({});
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [loadingSchoolClasses, setLoadingSchoolClasses] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
    fetchSchoolClasses();
  }, []);

  useEffect(() => {
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialization
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/teacher");
      setTeachers(response.data);
    } catch (error) {
      toast.error("Erro ao carregar professores");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/schoolsubject");
      setSubjects(response.data || []);
    } catch (error) {
      toast.error("Erro ao carregar disciplinas");
      console.error("Erro:", error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchSchoolClasses = async () => {
    try {
      const response = await api.get("/schoolclass");
      setSchoolClasses(response.data || []);
    } catch (error) {
      toast.error("Erro ao carregar turmas");
      console.error("Erro:", error);
    } finally {
      setLoadingSchoolClasses(false);
    }
  };

  const subjectOptions = useMemo(() => {
    return (subjects || []).map((subject) => ({
      value: subject.id,
      label: subject.name,
    }));
  }, [subjects]);

  const schoolClassOptions = useMemo(() => {
    return (schoolClasses || []).map((schoolClass) => ({
      value: schoolClass.id,
      label: schoolClass.name,
    }));
  }, [schoolClasses]);

  const getTeacherSubjectNames = (teacher) => {
    if (teacher?.subjects && Array.isArray(teacher.subjects)) {
      return teacher.subjects.map((s) => s?.name).filter(Boolean);
    }
    if (teacher?.subjectIds && Array.isArray(teacher.subjectIds)) {
      const idToName = new Map((subjects || []).map((s) => [s.id, s.name]));
      return teacher.subjectIds.map((id) => idToName.get(id)).filter(Boolean);
    }
    return [];
  };

  const getTeacherClassNames = (teacher) => {
    if (teacher?.schoolClasses && Array.isArray(teacher.schoolClasses)) {
      return teacher.schoolClasses.map((c) => c?.name).filter(Boolean);
    }
    if (teacher?.schoolClassIds && Array.isArray(teacher.schoolClassIds)) {
      const idToName = new Map(
        (schoolClasses || []).map((c) => [c.id, c.name]),
      );
      return teacher.schoolClassIds
        .map((id) => idToName.get(id))
        .filter(Boolean);
    }
    return [];
  };

  const toggleExpandedRow = (teacherId) => {
    setExpandedSubjectsRows((prev) => ({
      ...prev,
      [teacherId]: !prev[teacherId],
    }));
  };

  const toggleExpandedClassRow = (teacherId) => {
    setExpandedClassesRows((prev) => ({
      ...prev,
      [teacherId]: !prev[teacherId],
    }));
  };

  const openCreateForm = () => {
    setEditingTeacher(null);
    reset({
      username: "",
      password: "",
      name: "",
      cpf: "",
      email: "",
      phone: "",
      birthdate: "",
      subjectIds: [],
      schoolClassIds: [],
    });
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        subjectIds: (data.subjectIds || []).map((id) => Number(id)),
        schoolClassIds: (data.schoolClassIds || []).map((id) => Number(id)),
      };
      if (editingTeacher) {
        await api.put(`/teacher/${editingTeacher.id}`, payload);
        toast.success("Professor atualizado com sucesso!");
      } else {
        await api.post("/teacher", payload);
        toast.success("Professor criado com sucesso!");
      }

      setShowForm(false);
      setEditingTeacher(null);
      reset();
      fetchTeachers();
    } catch (error) {
      toast.error("Erro ao salvar professor");
      console.error("Erro:", error);
    }
  };

  const handleEdit = async (teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);

    // Preenche o formulário com dados básicos imediatamente
    reset({
      ...teacher,
      subjectIds:
        teacher.subjectIds ||
        (teacher.subjects ? teacher.subjects.map((s) => s.id) : []),
      schoolClassIds:
        teacher.schoolClassIds ||
        (teacher.schoolClasses ? teacher.schoolClasses.map((c) => c.id) : []),
    });

    // Busca detalhes atualizados, garantindo subjectIds para o select
    try {
      const response = await api.get(`/teacher/${teacher.id}`);
      const full = response.data || {};
      const inferredSubjectIds =
        full.subjectIds ||
        (full.subjects ? full.subjects.map((s) => s.id) : []);
      const inferredSchoolClassIds =
        full.schoolClassIds ||
        (full.schoolClasses ? full.schoolClasses.map((c) => c.id) : []);
      reset({
        ...teacher,
        ...full,
        subjectIds: inferredSubjectIds || [],
        schoolClassIds: inferredSchoolClassIds || [],
      });
    } catch (error) {
      // Se falhar, mantém os dados já preenchidos
      console.error("Erro ao carregar detalhes do professor:", error);
      toast.error("Não foi possível carregar os detalhes do professor.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este professor?")) {
      try {
        await api.delete(`/teachers/${id}`);
        toast.success("Professor excluído com sucesso!");
        fetchTeachers();
      } catch (error) {
        toast.error("Erro ao excluir professor");
        console.error("Erro:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeacher(null);
    reset({
      username: "",
      password: "",
      name: "",
      cpf: "",
      email: "",
      phone: "",
      birthdate: "",
      subjectIds: [],
      schoolClassIds: [],
    });
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
            Gerenciar Professores
          </h1>
          <p className="text-gray-600">Gerencie os professores do sistema</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Professor
        </button>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar professores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingTeacher ? "Editar Professor" : "Cadastrar Professor"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuário
                  </label>
                  <input
                    type="text"
                    {...register("username", {
                      required: "O usuário é obrigatório",
                    })}
                    className="input w-full"
                    placeholder="Usuário que será usado para entrar na conta"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {!editingTeacher ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <input
                      type="text"
                      {...register("password", {
                        required: "A senha é obrigatória",
                      })}
                      className="input w-full"
                      placeholder="Senha que será usada para entrar na conta"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                ) : null}

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
                    CPF
                  </label>
                  <input
                    type="text"
                    {...register("cpf", { required: "O CPF é obrigatório." })}
                    className="input w-full"
                    placeholder="111.222.333-44"
                    maxLength={11}
                  />
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disciplinas que leciona
                  </label>
                  <Controller
                    control={control}
                    name="subjectIds"
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        isLoading={loadingSubjects}
                        options={subjectOptions}
                        value={subjectOptions.filter((opt) =>
                          (field.value || []).includes(opt.value),
                        )}
                        onChange={(selected) =>
                          field.onChange(
                            (selected || []).map((opt) => opt.value),
                          )
                        }
                        classNamePrefix="rs"
                        placeholder="Selecione as disciplinas..."
                        noOptionsMessage={() => "Nenhuma disciplina encontrada"}
                      />
                    )}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Você pode buscar pelo nome e selecionar múltiplas opções.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turmas que leciona
                  </label>
                  <Controller
                    control={control}
                    name="schoolClassIds"
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        isLoading={loadingSchoolClasses}
                        options={schoolClassOptions}
                        value={schoolClassOptions.filter((opt) =>
                          (field.value || []).includes(opt.value),
                        )}
                        onChange={(selected) =>
                          field.onChange(
                            (selected || []).map((opt) => opt.value),
                          )
                        }
                        classNamePrefix="rs"
                        placeholder="Selecione as turmas..."
                        noOptionsMessage={() => "Nenhuma turma encontrada"}
                      />
                    )}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Você pode buscar pelo nome e selecionar múltiplas opções.
                  </p>
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
                  {editingTeacher ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de professores */}
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
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disciplinas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turmas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.cpf
                      ? teacher.cpf.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          "$1.$2.$3-$4",
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.phone
                      ? teacher.phone.replace(
                          /(\d{2})(\d{5})(\d{4})/,
                          "($1) $2-$3",
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs">
                    {(() => {
                      const names = getTeacherSubjectNames(teacher);
                      if (!names.length) return "-";
                      const fullText = names.join(", ");
                      const isExpanded = !!expandedSubjectsRows[teacher.id];
                      const LIMIT = 60;
                      const shouldTruncate = fullText.length > LIMIT;
                      const textToShow =
                        isExpanded || !shouldTruncate
                          ? fullText
                          : `${fullText.slice(0, LIMIT)}...`;
                      return (
                        <div className="flex items-center space-x-2">
                          <span className="truncate" title={fullText}>
                            {textToShow}
                          </span>
                          {shouldTruncate && (
                            <button
                              type="button"
                              onClick={() => toggleExpandedRow(teacher.id)}
                              className="text-primary-600 hover:text-primary-900 text-xs underline"
                            >
                              {isExpanded ? "ver menos" : "ver mais"}
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs">
                    {(() => {
                      const names = getTeacherClassNames(teacher);
                      if (!names.length) return "-";
                      const fullText = names.join(", ");
                      const isExpanded = !!expandedClassesRows[teacher.id];
                      const LIMIT = 60;
                      const shouldTruncate = fullText.length > LIMIT;
                      const textToShow =
                        isExpanded || !shouldTruncate
                          ? fullText
                          : `${fullText.slice(0, LIMIT)}...`;
                      return (
                        <div className="flex items-center space-x-2">
                          <span className="truncate" title={fullText}>
                            {textToShow}
                          </span>
                          {shouldTruncate && (
                            <button
                              type="button"
                              onClick={() => toggleExpandedClassRow(teacher.id)}
                              className="text-primary-600 hover:text-primary-900 text-xs underline"
                            >
                              {isExpanded ? "ver menos" : "ver mais"}
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
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

          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? "Nenhum professor encontrado para esta pesquisa."
                  : "Nenhum professor cadastrado."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
