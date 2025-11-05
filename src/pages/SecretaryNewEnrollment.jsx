import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserPlus, Upload, X, ArrowLeft } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const SecretaryNewEnrollment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    fetchSchoolUnits();
  }, []);

  const fetchSchoolUnits = async () => {
    try {
      setLoadingUnits(true);
      const response = await api.get("/schoolunit");
      setSchoolUnits(response.data || []);
    } catch (error) {
      toast.error("Erro ao carregar unidades escolares");
      console.error("Erro:", error);
    } finally {
      setLoadingUnits(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A foto deve ter no máximo 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("O arquivo deve ser uma imagem");
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("ra", data.ra);
      formData.append("cpf", data.cpf);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("gradeYear", data.gradeYear);
      formData.append("course", data.course);
      formData.append("shift", data.shift);
      formData.append("birthdate", data.birthdate);
      formData.append("address", data.address);
      formData.append("unitId", data.unitId);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await api.post("/student/enroll", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Matrícula cadastrada com sucesso!");
      navigate("/secretary/enrollments");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao cadastrar matrícula",
      );
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/secretary/enrollments")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nova Matrícula</h1>
          <p className="text-gray-600">
            Cadastre um novo aluno no sistema escolar
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Foto do Aluno
          </h3>
          <div className="flex items-center space-x-6">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <label className="btn btn-secondary cursor-pointer inline-flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 3,
                    message: "Nome deve ter no mínimo 3 caracteres",
                  },
                })}
                className="input w-full"
                placeholder="Digite o nome completo do aluno"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("cpf", {
                  required: "CPF é obrigatório",
                  pattern: {
                    value: /^\d{11}$/,
                    message: "CPF deve conter 11 dígitos",
                  },
                })}
                className="input w-full"
                placeholder="00000000000"
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
                RA
              </label>
              <input
                type="text"
                {...register("ra")}
                className="input w-full"
                placeholder="Registro do Aluno (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("birthdate", {
                  required: "Data de nascimento é obrigatória",
                })}
                className="input w-full"
              />
              {errors.birthdate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.birthdate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Telefone é obrigatório",
                  pattern: {
                    value: /^\d{10,11}$/,
                    message: "Telefone deve conter 10 ou 11 dígitos",
                  },
                })}
                className="input w-full"
                placeholder="11999999999"
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
                Email <span className="text-red-500">*</span>
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
                placeholder="aluno@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("address", {
                  required: "Endereço é obrigatório",
                })}
                className="input w-full"
                placeholder="Rua, Número, Bairro, Cidade - Estado"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações Acadêmicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gradeYear", {
                  required: "Ano é obrigatório",
                })}
                className="input w-full bg-white"
              >
                <option value="">Selecione o ano</option>
                <option value="FIRST_YEAR">1º Ano</option>
                <option value="SECOND_YEAR">2º Ano</option>
                <option value="THIRD_YEAR">3º Ano</option>
              </select>
              {errors.gradeYear && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.gradeYear.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curso <span className="text-red-500">*</span>
              </label>
              <select
                {...register("course", {
                  required: "Curso é obrigatório",
                })}
                className="input w-full bg-white"
              >
                <option value="">Selecione o curso</option>
                <option value="ADM">Administração</option>
                <option value="BIO">Biologia</option>
                <option value="CV">CV</option>
                <option value="DG">Design Gráfico</option>
                <option value="DDI">DDI</option>
                <option value="DS">Desenvolvimento de Sistemas</option>
                <option value="EDF">EDF</option>
                <option value="LOG">Logística</option>
                <option value="MAT">Matemática</option>
                <option value="MEC">Mecânica</option>
                <option value="MED">Medicina</option>
              </select>
              {errors.course && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.course.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turno <span className="text-red-500">*</span>
              </label>
              <select
                {...register("shift", {
                  required: "Turno é obrigatório",
                })}
                className="input w-full bg-white"
              >
                <option value="">Selecione o turno</option>
                <option value="MORNING">Manhã</option>
                <option value="AFTERNOON">Tarde</option>
                <option value="NIGHT">Noite</option>
              </select>
              {errors.shift && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shift.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Observação:</strong> A turma será automaticamente
              atribuída com base no ano, curso e turno selecionados. O sistema
              buscará uma turma disponível que corresponda a esses critérios.
            </p>
          </div>
        </div>

        {/* Unit Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Unidade Escolar
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidade Escolar <span className="text-red-500">*</span>
            </label>
            <select
              {...register("unitId", {
                required: "Unidade escolar é obrigatória",
              })}
              className="input w-full bg-white"
              disabled={loadingUnits}
            >
              <option value="">
                {loadingUnits ? "Carregando..." : "Selecione uma unidade"}
              </option>
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
        </div>

        {/* Info Alert */}
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Importante
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  A matrícula será criada com status <strong>INATIVO</strong>.
                  Para ativar a matrícula e permitir que o aluno acesse o
                  sistema, você precisará aprová-la na página de gerenciamento
                  de matrículas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/secretary/enrollments")}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Cadastrando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Matrícula
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecretaryNewEnrollment;
