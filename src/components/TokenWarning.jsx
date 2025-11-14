import React from "react";
import { useTokenWarning } from "../hooks/useTokenStatus";
import { X, AlertTriangle } from "lucide-react";

/**
 * Componente para exibir avisos sobre expiração de token
 */
const TokenWarning = () => {
  const tokenWarning = useTokenWarning(5);

  // Verificação de segurança
  if (!tokenWarning) {
    console.error("TokenWarning: useTokenWarning retornou undefined");
    return null;
  }

  const { shouldShowWarning, warningMessage, dismissWarning } = tokenWarning;

  if (!shouldShowWarning) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-yellow-700 font-medium">
              Aviso de Sessão
            </p>
            <p className="text-sm text-yellow-600 mt-1">{warningMessage}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              className="bg-yellow-50 rounded-md inline-flex text-yellow-400 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              onClick={dismissWarning}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Versão compacta do aviso de token para usar na barra de navegação
 */
export const TokenWarningBadge = () => {
  const tokenWarning = useTokenWarning(5);

  // Verificação de segurança
  if (!tokenWarning) {
    console.error("TokenWarningBadge: useTokenWarning retornou undefined");
    return null;
  }

  const { shouldShowWarning, warningMessage } = tokenWarning;

  if (!shouldShowWarning) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <span className="font-medium">Sessão expirando</span>
    </div>
  );
};

/**
 * Modal de aviso crítico quando o token está muito próximo da expiração
 */
export const TokenExpirationModal = (props = {}) => {
  const { isOpen = false, onClose = () => {}, timeRemaining = 0 } = props || {};
  if (!isOpen) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle
                className="h-6 w-6 text-yellow-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Sessão Expirando
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Sua sessão expirará em{" "}
                  <span className="font-semibold text-red-600">
                    {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
                  </span>
                  . Salve seu trabalho e faça login novamente para continuar.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Ir para Login
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenWarning;
