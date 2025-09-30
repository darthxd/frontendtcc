import React, { useState } from 'react';
import { useTokenStatus } from '../hooks/useTokenStatus';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Clock, Shield, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Componente de debug para mostrar informações do token JWT
 * Útil durante desenvolvimento para verificar se a verificação de expiração está funcionando
 */
const TokenDebugInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTokenContent, setShowTokenContent] = useState(false);
  const {
    isValid,
    isExpired,
    isExpiringSoon,
    timeRemaining,
    expirationDate,
    updateStatus
  } = useTokenStatus();

  const { user, getTokenInfo } = useAuth();
  const tokenInfo = getTokenInfo();

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-full text-sm hover:bg-gray-700 transition-colors"
          title="Mostrar informações do token (Debug)"
        >
          <Shield className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    if (seconds <= 0) return 'Expirado';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getStatusIcon = () => {
    if (isExpired) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else if (isExpiringSoon) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else if (isValid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-gray-500" />;
  };

  const getStatusColor = () => {
    if (isExpired) return 'border-red-500 bg-red-50';
    if (isExpiringSoon) return 'border-yellow-500 bg-yellow-50';
    if (isValid) return 'border-green-500 bg-green-50';
    return 'border-gray-500 bg-gray-50';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className={`border-2 rounded-lg p-4 shadow-lg bg-white ${getStatusColor()}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <h3 className="font-semibold text-gray-800">Token Status (Debug)</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>

        {/* Status Information */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${
              isExpired ? 'text-red-600' :
              isExpiringSoon ? 'text-yellow-600' :
              isValid ? 'text-green-600' : 'text-gray-600'
            }`}>
              {isExpired ? 'Expirado' :
               isExpiringSoon ? 'Expirando em breve' :
               isValid ? 'Válido' : 'Inválido'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tempo restante:</span>
            <span className="font-mono text-xs">
              {formatTime(timeRemaining)}
            </span>
          </div>

          {expirationDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Expira em:</span>
              <span className="text-xs">
                {expirationDate.toLocaleString('pt-BR')}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Usuário:</span>
            <span className="text-xs">{user?.username || 'N/A'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Papel:</span>
            <span className="text-xs">{user?.role || 'N/A'}</span>
          </div>
        </div>

        {/* Token Information */}
        {tokenInfo && (
          <div className="mt-3 pt-3 border-t">
            <button
              onClick={() => setShowTokenContent(!showTokenContent)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-2"
            >
              {showTokenContent ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              <span>{showTokenContent ? 'Ocultar' : 'Mostrar'} conteúdo do token</span>
            </button>

            {showTokenContent && (
              <div className="bg-gray-100 rounded p-2 text-xs font-mono overflow-auto max-h-32">
                <div className="mb-1"><strong>Sub:</strong> {tokenInfo.sub}</div>
                <div className="mb-1"><strong>Role:</strong> {tokenInfo.role}</div>
                <div className="mb-1"><strong>Iat:</strong> {new Date(tokenInfo.iat * 1000).toLocaleString('pt-BR')}</div>
                <div className="mb-1"><strong>Exp:</strong> {new Date(tokenInfo.exp * 1000).toLocaleString('pt-BR')}</div>
                {tokenInfo.iss && <div className="mb-1"><strong>Iss:</strong> {tokenInfo.iss}</div>}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 pt-3 border-t flex space-x-2">
          <button
            onClick={updateStatus}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          >
            <Clock className="h-3 w-3" />
            <span>Atualizar</span>
          </button>

          {isValid && (
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja fazer logout?')) {
                  const { logout } = require('../contexts/AuthContext');
                  logout();
                }
              }}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Warning */}
        <div className="mt-2 text-xs text-gray-500 italic">
          ⚠️ Este componente é apenas para desenvolvimento
        </div>
      </div>
    </div>
  );
};

export default TokenDebugInfo;
