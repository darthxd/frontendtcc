import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Search, X, Shield } from "lucide-react";
import api from "../services/api";
import { schoolUnitService } from "../services/schoolUnitService";
import { getUnitIdFromToken } from "../utils/jwt";
import toast from "react-hot-toast";

const Coordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchCoordinators();
    fetchSchoolUnits();
  }, []);

  useEffect(() => {
    const filtered = coordinators.filter(
      (coordinator) =>
        coordinator.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        coordinator.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coordinator.phone?.includes(searchTerm),
    );
    setFilteredCoordinators(filtered);
  }, [searchTerm, coordinators]);

  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const response = await api.get("/coordinator");
      setCoordinators(response.data);
      setFilteredCoordinators(response.data);
    } catch (error) {
      toast.error("Erro ao carregar coordenadores");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
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

  const onSubmit = async (data) => {
    try {
      // Se unitId não foi fornecido, pegar do token
      if (!data.unitId) {
        const unitId = getUnitIdFromToken();
        if (unitId) {
          data.unitId = unitId;
        }
      }

      if (editingCoordinator) {
        await api.put(`/coordinator/${editingCoordinator.id}`, data);
        toast.success("Coordenador atualizado com sucesso!");
      } else {
        await api.post("/coordinator", data);
        toast.success("Coordenador criado com sucesso!");
      }

      setShowForm(false);
      setEditingCoordinator(null);
      reset();
      fetchCoordinators();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar coordenador");
      console.error("Erro:", error);
    }
  };

  const handleEdit = (coordinator) => {
    setEditingCoordinator(coordinator);
    reset({
      username: coordinator.username,
      email: coordinator.email,
      phone: coordinator.phone,
      unitId: coordinator.unitId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este coordenador?")) {
      try {
        await api.delete(`/coordinator/${id}`);
        toast.success("Coordenador excluído com sucesso!");
        fetchCoordinators();
      } catch (error) {
        toast.error("Erro ao excluir coordenador");
        console.error("Erro:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCoordinator(null);
    reset();
  };

  const getUnitName = (unitId) => {
    const unit = schoolUnits.find((u) => u.id === unitId);
    return unit?.name || "Unidade não encontrada";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coordenadores</h1>
          <p className="text-gray-600">Gerencie os coordenadores do sistema</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Coordenador
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCoordinator ? "Editar Coordenador" : "Novo Coordenador"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  {...register("username", {
                    required: "Nome de usuário é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Mínimo de 3 caracteres",
                    },
                  })}
                  className="input w-full"
                  disabled={editingCoordinator !== null}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {!editingCoordinator && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Mínimo de 6 caracteres",
                      },
                    })}
                    className="input w-full"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Nome é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Mínimo de 3 caracteres",
                    },
                  })}
                  className="input w-full"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  type="text"
                  {...register("cpf", {
                    required: "CPF é obrigatório",
                    minLength: {
                      value: 11,
                      message: "CPF deve ter 11 dígitos",
                    },
                  })}
                  className="input w-full"
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.cpf.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Telefone é obrigatório",
                  })}
                  className="input w-full"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unidade Escolar
                </label>
                <select
                  {...register("unitId", {
                    required: "Unidade escolar é obrigatória",
                  })}
                  className="input w-full bg-white"
                  disabled={loadingUnits}
                >
                  <option value="">Selecione uma unidade</option>
                  {schoolUnits.map((unit) => (
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
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCoordinator ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredCoordinators.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum coordenador encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando um novo coordenador.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidade Escolar
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCoordinators.map((coordinator) => (
                  <tr key={coordinator.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {coordinator.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coordinator.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coordinator.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getUnitName(coordinator.unitId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(coordinator)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(coordinator.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coordinators;
