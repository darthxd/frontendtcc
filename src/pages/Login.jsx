import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, User, Building2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { schoolUnitService } from "../services/schoolUnitService";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const from = location.state?.from?.pathname || "/dashboard";

  // Buscar unidades escolares ao carregar o componente
  useEffect(() => {
    const fetchSchoolUnits = async () => {
      try {
        setLoadingUnits(true);
        const units = await schoolUnitService.getAllSchoolUnits();
        setSchoolUnits(units);
      } catch (error) {
        console.error("Erro ao carregar unidades escolares:", error);
        toast.error("Erro ao carregar unidades escolares");
      } finally {
        setLoadingUnits(false);
      }
    };

    fetchSchoolUnits();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password, data.unitId);
      toast.success("Login realizado com sucesso!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <Lock className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema Escolar
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para acessar o sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Campo de Unidade Escolar */}
            <div>
              <label
                htmlFor="unitId"
                className="block text-sm font-medium text-gray-700"
              >
                Unidade Escolar
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="unitId"
                  {...register("unitId", {
                    required: "Selecione uma unidade escolar",
                  })}
                  className="input pl-10"
                  disabled={loadingUnits}
                >
                  <option value="">
                    {loadingUnits
                      ? "Carregando unidades..."
                      : "Selecione uma unidade"}
                  </option>
                  {schoolUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.unitId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.unitId.message}
                </p>
              )}
            </div>

            {/* Campo de Usuário */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Usuário
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  {...register("username", {
                    required: "Usuário é obrigatório",
                  })}
                  className="input pl-10"
                  placeholder="Digite seu usuário"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Campo de Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Senha é obrigatória" })}
                  className="input pl-10 pr-10"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || loadingUnits}
              className="btn btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Sistema de Gerenciamento Escolar - TCC
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
