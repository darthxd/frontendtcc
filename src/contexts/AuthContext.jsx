import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { isTokenExpired } from "../utils/jwt";
import api from "../services/api";

console.log("=== AuthContext: Módulo carregado ===");
console.log("createContext existe?", createContext ? "SIM" : "NÃO");
console.log("useContext existe?", useContext ? "SIM" : "NÃO");
console.log("useState existe?", useState ? "SIM" : "NÃO");
console.log("useEffect existe?", useEffect ? "SIM" : "NÃO");

const AuthContext = createContext();
console.log("AuthContext criado:", AuthContext ? "SIM" : "NÃO");

export const useAuth = () => {
  console.log("useAuth: Chamado");
  const context = useContext(AuthContext);
  console.log("useAuth: Context value:", context);

  if (!context) {
    console.error("useAuth: Context é undefined/null!");
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = (props = {}) => {
  console.log("=== AuthProvider: Iniciando ===");
  console.log("AuthProvider: Props recebidas:", props);
  console.log("AuthProvider: typeof props:", typeof props);

  // Extrai children com fallback seguro
  const { children = null } = props || {};
  console.log("AuthProvider: children extraído:", children);
  console.log("AuthProvider: children existe?", children ? "✓" : "✗");

  // Apenas avisa se children não existe, mas não quebra
  if (!children) {
    console.warn(
      "AVISO: AuthProvider sem children - pode ser re-render do React",
    );
  }

  console.log("AuthProvider: Inicializando estados...");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log("AuthProvider: Estados inicializados");

  useEffect(() => {
    console.log("AuthProvider: useEffect executando");
    const initAuth = async () => {
      console.log("AuthProvider: initAuth iniciando");
      // Verifica se o token está válido antes de definir como autenticado
      const token = authService.getToken();
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      // Se o token estiver expirado, força logout
      if (token && isTokenExpired(token)) {
        authService.clearExpiredToken();
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      } else if (authenticated && currentUser) {
        // Se o usuário já tem dados completos (id existe), usa os dados do localStorage
        if (currentUser.id) {
          setIsAuthenticated(authenticated);
          setUser(currentUser);
          setIsLoading(false);
        } else {
          // Se não tem id, busca dados completos do usuário
          try {
            const fullUser = await authService.getUserByUsername(
              currentUser.username,
            );
            const updatedUser = {
              id: fullUser.id,
              username: fullUser.username,
              name: fullUser.name,
              email: fullUser.email,
              role: currentUser.role,
              ...fullUser,
            };

            // Atualiza o localStorage com dados completos
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setIsAuthenticated(true);
            setUser(updatedUser);
          } catch (error) {
            console.error(
              "Erro ao carregar dados completos do usuário:",
              error,
            );
            // Em caso de erro, usa os dados básicos disponíveis
            setIsAuthenticated(authenticated);
            setUser(currentUser);
          }
          setIsLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
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

  const login = async (username, password, unitId) => {
    try {
      const { token, user } = await authService.login(
        username,
        password,
        unitId,
      );
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
    hasRole: (role) => {
      if (!user) return false;
      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    },
    isAdmin: () => user && user.role === "ROLE_ADMIN",
    isTeacher: () => user && user.role === "ROLE_TEACHER",
    isStudent: () => user && user.role === "ROLE_STUDENT",
    checkTokenExpiration: () => authService.isTokenValid(),
    getTokenInfo: () => authService.getTokenInfo(),
  };

  console.log("AuthProvider: Value object criado:", value);
  console.log("AuthProvider: Renderizando Provider com children");

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
