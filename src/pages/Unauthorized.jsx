import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesso Negado
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Você não tem permissão para acessar esta página
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-500">
            Esta área requer permissões administrativas que você não possui no momento.
          </p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary w-full flex justify-center items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Ir para Dashboard
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary w-full flex justify-center items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Se você acredita que deveria ter acesso a esta área, entre em contato com um administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
