import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { isTokenExpired } from "../utils/jwt";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      // Verifica se o token está válido antes de definir como autenticado
      const token = authService.getToken();
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      // Se o token estiver expirado, força logout
      if (token && isTokenExpired(token)) {
        authService.clearExpiredToken();
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setIsAuthenticated(authenticated);
        setUser(currentUser);
      }

      setIsLoading(false);
    };

    const handleAuthChange = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    initAuth();

    // Inicia a verificação periódica de expiração do token
    authService.startTokenExpirationCheck();

    // Adiciona listener para mudanças de autenticação
    authService.addAuthListener(handleAuthChange);

    // Cleanup na desmontagem
    return () => {
      authService.stopTokenExpirationCheck();
      authService.removeAuthListener(handleAuthChange);
    };
  }, []);

  const login = async (username, password) => {
    try {
      const { token, user } = await authService.login(username, password);
      setIsAuthenticated(true);
      setUser(user);
      return { token, user };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    // Para a verificação periódica ao fazer logout
    authService.stopTokenExpirationCheck();
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    hasRole: (role) => user && user.role === role,
    isAdmin: () => user && user.role === "ROLE_ADMIN",
    isTeacher: () => user && user.role === "ROLE_TEACHER",
    isStudent: () => user && user.role === "ROLE_STUDENT",
    checkTokenExpiration: () => authService.isTokenValid(),
    getTokenInfo: () => authService.getTokenInfo(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
