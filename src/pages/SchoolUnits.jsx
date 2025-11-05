import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { schoolUnitService } from "../services/schoolUnitService";
import toast from "react-hot-toast";

const SchoolUnits = () => {
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSchoolUnits();
  }, []);

  useEffect(() => {
    const filtered = schoolUnits.filter(
      (unit) =>
        unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.phone?.includes(searchTerm),
    );
    setFilteredUnits(filtered);
  }, [searchTerm, schoolUnits]);

  const fetchSchoolUnits = async () => {
    try {
      setLoading(true);
      const units = await schoolUnitService.getAllSchoolUnits();
      setSchoolUnits(units);
      setFilteredUnits(units);
    } catch (error) {
      toast.error("Erro ao carregar unidades escolares");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingUnit) {
        await schoolUnitService.updateSchoolUnit(editingUnit.id, data);
        toast.success("Unidade escolar atualizada com sucesso!");
      } else {
        await schoolUnitService.createSchoolUnit(data);
        toast.success("Unidade escolar criada com sucesso!");
      }

      setShowForm(false);
      setEditingUnit(null);
      reset();
      fetchSchoolUnits();
    } catch (error) {
      toast.error(error.message || "Erro ao salvar unidade escolar");
      console.error("Erro:", error);
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    reset({
      name: unit.name,
      address: unit.address,
      phone: unit.phone,
      email: unit.email,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta unidade escolar? Esta ação pode afetar outros registros do sistema.",
      )
    ) {
      try {
        await schoolUnitService.deleteSchoolUnit(id);
        toast.success("Unidade escolar excluída com sucesso!");
        fetchSchoolUnits();
      } catch (error) {
        toast.error("Erro ao excluir unidade escolar");
        console.error("Erro:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUnit(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Unidades Escolares
          </h1>
          <p className="text-gray-600">
            Gerencie as unidades escolares do sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Unidade
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nome, endereço, email ou telefone..."
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
                {editingUnit
                  ? "Editar Unidade Escolar"
                  : "Nova Unidade Escolar"}
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
                  Nome da Unidade
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Nome da unidade é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Mínimo de 3 caracteres",
                    },
                  })}
                  className="input w-full"
                  placeholder="Ex: ETEC Polivalente Americana"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  type="text"
                  {...register("address", {
                    required: "Endereço é obrigatório",
                    minLength: {
                      value: 10,
                      message: "Mínimo de 10 caracteres",
                    },
                  })}
                  className="input w-full"
                  placeholder="Ex: Rua Exemplo, 1000 - Centro"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
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
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message:
                        "Telefone inválido (apenas números, 10-11 dígitos)",
                    },
                  })}
                  className="input w-full"
                  placeholder="Ex: 11999999999"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
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
                  placeholder="Ex: contato@escola.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
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
                  {editingUnit ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma unidade escolar encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Tente buscar com outros termos."
                : "Comece criando uma nova unidade escolar."}
            </p>
          </div>
        ) : (
          filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {unit.name}
                    </h3>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(unit)}
                    className="text-primary-600 hover:text-primary-900"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Excluir"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{unit.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{unit.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{unit.email}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ID: {unit.id}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SchoolUnits;
