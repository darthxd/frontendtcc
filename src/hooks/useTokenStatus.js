import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import {
  isTokenExpired,
  getTokenExpirationTime,
  isTokenExpiringSoon,
} from "../utils/jwt";

/**
 * Hook personalizado para monitorar o status do token JWT
 * @returns {object} Objeto com informações sobre o status do token
 */
export const useTokenStatus = () => {
  const [tokenStatus, setTokenStatus] = useState({
    isValid: false,
    isExpired: false,
    isExpiringSoon: false,
    timeRemaining: 0,
    expirationDate: null,
  });

  const updateTokenStatus = useCallback(() => {
    const token = authService.getToken();

    if (!token) {
      setTokenStatus({
        isValid: false,
        isExpired: true,
        isExpiringSoon: false,
        timeRemaining: 0,
        expirationDate: null,
      });
      return;
    }

    const expired = isTokenExpired(token);
    const expiringSoon = isTokenExpiringSoon(token, 5); // 5 minutos de antecedência
    const timeRemaining = getTokenExpirationTime(token);

    // Calcula a data de expiração
    const expirationDate =
      timeRemaining > 0 ? new Date(Date.now() + timeRemaining * 1000) : null;

    setTokenStatus({
      isValid: !expired,
      isExpired: expired,
      isExpiringSoon: expiringSoon,
      timeRemaining,
      expirationDate,
    });

    // Se o token estiver expirado, limpa automaticamente
    if (expired) {
      authService.clearExpiredToken();
    }
  }, []);

  useEffect(() => {
    // Atualiza o status inicialmente
    updateTokenStatus();

    // Adiciona listener para mudanças de autenticação
    authService.addAuthListener(updateTokenStatus);

    // Atualiza o status a cada 30 segundos
    const interval = setInterval(updateTokenStatus, 30000);

    // Cleanup
    return () => {
      authService.removeAuthListener(updateTokenStatus);
      clearInterval(interval);
    };
  }, [updateTokenStatus]);

  return {
    ...tokenStatus,
    updateStatus: updateTokenStatus,
  };
};

/**
 * Hook para verificar se o token vai expirar em breve e mostrar avisos
 * @param {number} warningMinutes - Minutos antes da expiração para mostrar aviso
 * @returns {object} Objeto com informações de aviso
 */
export const useTokenWarning = (warningMinutes = 5) => {
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    const checkTokenWarning = () => {
      try {
        const token = authService.getToken();

        if (!token) {
          setShouldShowWarning(false);
          setWarningMessage("");
          return;
        }

        if (isTokenExpired(token)) {
          setShouldShowWarning(true);
          setWarningMessage(
            "Sua sessão expirou. Você será redirecionado para o login.",
          );
          return;
        }

        if (isTokenExpiringSoon(token, warningMinutes)) {
          const timeRemaining = getTokenExpirationTime(token);
          const minutes = Math.floor(timeRemaining / 60);
          const seconds = timeRemaining % 60;

          setShouldShowWarning(true);
          setWarningMessage(
            `Sua sessão expirará em ${minutes}m ${seconds}s. Salve seu trabalho.`,
          );
        } else {
          setShouldShowWarning(false);
          setWarningMessage("");
        }
      } catch (error) {
        console.error("Erro ao verificar token warning:", error);
        setShouldShowWarning(false);
        setWarningMessage("");
      }
    };

    // Verifica inicialmente
    checkTokenWarning();

    // Verifica a cada 10 segundos quando próximo da expiração
    const interval = setInterval(checkTokenWarning, 10000);

    // Adiciona listener para mudanças de autenticação
    authService.addAuthListener(checkTokenWarning);

    return () => {
      clearInterval(interval);
      authService.removeAuthListener(checkTokenWarning);
    };
  }, [warningMinutes]);

  // Sempre retorna um objeto válido
  return {
    shouldShowWarning: shouldShowWarning || false,
    warningMessage: warningMessage || "",
    dismissWarning: () => setShouldShowWarning(false),
  };
};
