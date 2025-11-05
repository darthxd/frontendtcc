import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Search, X, Shield } from "lucide-react";
import api from "../services/api";
import { schoolUnitService } from "../services/schoolUnitService";
import { getUnitIdFromToken } from "../utils/jwt";
import toast from "react-hot-toast";

const Secretaries = () => {
  const [secretaries, setSecretaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSecretary, setEditingSecretary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSecretaries, setFilteredSecretaries] = useState([]);
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSecretaries();
    fetchSchoolUnits();
  }, []);

  useEffect(() => {
    const filtered = secretaries.filter(
      (secretary) =>
        secretary.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        secretary.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        secretary.phone?.includes(searchTerm),
    );
    setFilteredSecretaries(filtered);
  }, [searchTerm, secretaries]);

  const fetchSecretaries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/secretary");
      setSecretaries(response.data);
      setFilteredSecretaries(response.data);
    } catch (error) {
      toast.error("Erro ao carregar secretarias");
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

      if (editingSecretary) {
        await api.put(`/secretary/${editingSecretary.id}`, data);
        toast.success("Secretaria atualizada com sucesso!");
      } else {
        await api.post("/secretary", data);
        toast.success("Secretaria criada com sucesso!");
      }

      setShowForm(false);
      setEditingSecretary(null);
      reset();
      fetchSecretaries();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar secretaria");
      console.error("Erro:", error);
    }
  };

  const handleEdit = (secretary) => {
    setEditingSecretary(secretary);
    reset({
      username: secretary.username,
      email: secretary.email,
      phone: secretary.phone,
      unitId: secretary.unitId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta secretaria?")) {
      try {
        await api.delete(`/secretary/${id}`);
        toast.success("Secretaria excluída com sucesso!");
        fetchSecretaries();
      } catch (error) {
        toast.error("Erro ao excluir secretaria");
        console.error("Erro:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSecretary(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Secretarias</h1>
          <p className="text-gray-600">Gerencie as secretarias do sistema</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Secretaria
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por usuário, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSecretary ? "Editar Secretaria" : "Nova Secretaria"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usuário *
                    </label>
                    <input
                      type="text"
                      {...register("username", {
                        required: "Usuário é obrigatório",
                        minLength: {
                          value: 3,
                          message: "Usuário deve ter pelo menos 3 caracteres",
                        },
                      })}
                      className="input w-full"
                      placeholder="nome.usuario"
                      disabled={editingSecretary}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username.message}
                      </p>
                    )}
                    {editingSecretary && (
                      <p className="mt-1 text-xs text-gray-500">
                        O usuário não pode ser alterado
                      </p>
                    )}
                  </div>

                  {!editingSecretary && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha *
                      </label>
                      <input
                        type="password"
                        {...register("password", {
                          required: "Senha é obrigatória",
                          minLength: {
                            value: 6,
                            message: "Senha deve ter pelo menos 6 caracteres",
                          },
                        })}
                        className="input w-full"
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
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
                      Telefone *
                    </label>
                    <input
                      type="text"
                      {...register("phone", {
                        required: "Telefone é obrigatório",
                      })}
                      className="input w-full"
                      placeholder="(11) 99999-9999"
                      maxLength={11}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidade Escolar *
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
                    {loadingUnits && (
                      <p className="mt-1 text-sm text-gray-500">
                        Carregando unidades...
                      </p>
                    )}
                  </div>

                  {editingSecretary && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nova Senha (deixe em branco para manter a atual)
                      </label>
                      <input
                        type="password"
                        {...register("password", {
                          minLength: {
                            value: 6,
                            message: "Senha deve ter pelo menos 6 caracteres",
                          },
                        })}
                        className="input w-full"
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
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
                    {editingSecretary ? "Atualizar" : "Criar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredSecretaries.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma secretaria encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Tente ajustar os termos de busca"
                : "Comece criando uma nova secretaria"}
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
                {filteredSecretaries.map((secretary) => (
                  <tr key={secretary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {secretary.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {secretary.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {secretary.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getUnitName(secretary.unitId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(secretary)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(secretary.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total de Secretarias
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {secretaries.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Unidades Cobertas
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(secretaries.map((s) => s.unitId)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Resultados da Busca
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredSecretaries.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Secretaries;
