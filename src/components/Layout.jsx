import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Users,
  GraduationCap,
  BookOpen,
  Home,
  LogOut,
  User,
  ClipboardCheck,
  Rocket,
  FileText,
  Calendar,
  TrendingUp,
  Shield,
  UserCog,
  Building2,
  Fingerprint,
  Mail,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailedUser, setDetailedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, logout, hasRole } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Mensagens", href: "/messages", icon: Mail },
    {
      name: "Atividades",
      href: "/activities",
      icon: FileText,
      role: "ROLE_TEACHER",
    },
    {
      name: "Minhas Atividades",
      href: "/student-activities",
      icon: FileText,
      role: "ROLE_STUDENT",
    },
    {
      name: "Minhas Presenças",
      href: "/student-attendance",
      icon: Calendar,
      role: "ROLE_STUDENT",
    },
    {
      name: "Meus Horários",
      href: "/student-schedules",
      icon: Calendar,
      role: "ROLE_STUDENT",
    },
    {
      name: "Fazer Chamada",
      href: "/attendance-call",
      icon: ClipboardCheck,
      role: "ROLE_TEACHER",
    },
    // Secretary Menu Items
    {
      name: "Alunos",
      href: "/students",
      icon: Users,
      role: "ROLE_SECRETARY",
    },
    {
      name: "Professores",
      href: "/teachers",
      icon: GraduationCap,
      role: "ROLE_SECRETARY",
    },
    {
      name: "Matrículas",
      href: "/secretary/enrollments",
      icon: FileText,
      role: "ROLE_SECRETARY",
    },
    {
      name: "Logs de Acesso",
      href: "/secretary/logs",
      icon: Fingerprint,
      role: "ROLE_SECRETARY",
    },
    // Coordinator Menu Items
    {
      name: "Turmas",
      href: "/coordinator/classes",
      icon: BookOpen,
      role: "ROLE_COORDINATOR",
    },
    {
      name: "Desempenho",
      href: "/coordinator/performance",
      icon: TrendingUp,
      role: "ROLE_COORDINATOR",
    },
    {
      name: "Horários",
      href: "/coordinator/schedules",
      icon: Calendar,
      role: "ROLE_COORDINATOR",
    },
    // Admin Menu Items
    { name: "Alunos", href: "/students", icon: Users, role: "ROLE_ADMIN" },
    {
      name: "Professores",
      href: "/teachers",
      icon: GraduationCap,
      role: "ROLE_ADMIN",
    },
    {
      name: "Administradores",
      href: "/admins",
      icon: Users,
      role: "ROLE_ADMIN",
    },
    {
      name: "Secretarias",
      href: "/secretaries",
      icon: UserCog,
      role: "ROLE_ADMIN",
    },
    {
      name: "Coordenadores",
      href: "/coordinators",
      icon: Shield,
      role: "ROLE_ADMIN",
    },
    {
      name: "Unidades Escolares",
      href: "/school-units",
      icon: Building2,
      role: "ROLE_ADMIN",
    },
    { name: "Turmas", href: "/classes", icon: BookOpen, role: "ROLE_ADMIN" },
    {
      name: "Disciplinas",
      href: "/subjects",
      icon: BookOpen,
      role: "ROLE_ADMIN",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNavigation = navigation.filter(
    (item) => !item.role || hasRole(item.role),
  );

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (hasRole("ROLE_ADMIN")) {
        const response = await api.get(
          `/admin/username/${currentUser.username}`,
        );
        const data = response.data;
        setDetailedUser(data);
      }
      if (hasRole("ROLE_TEACHER")) {
        const response = await api.get(
          `/teacher/username/${currentUser.username}`,
        );
        const data = response.data;
        setDetailedUser(data);
      }
      if (hasRole("ROLE_STUDENT")) {
        const response = await api.get(
          `/student/username/${currentUser.username}`,
        );
        const data = response.data;
        setDetailedUser(data);
      }
      if (hasRole("ROLE_COORDINATOR")) {
        const response = await api.get(
          `/coordinator/username/${currentUser.username}`,
        );
        const data = response.data;
        setDetailedUser(data);
      }
      if (hasRole("ROLE_SECRETARY")) {
        const response = await api.get(
          `/secretary/username/${currentUser.username}`,
        );
        const data = response.data;
        setDetailedUser(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">
                Sistema Escolar
              </h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? "bg-primary-100 text-primary-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? "text-primary-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {detailedUser.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.role === "ROLE_ADMIN"
                    ? "Administrador"
                    : currentUser?.role === "ROLE_TEACHER"
                      ? "Professor"
                      : currentUser?.role === "ROLE_STUDENT"
                        ? "Aluno"
                        : currentUser?.role === "ROLE_COORDINATOR"
                          ? "Coordenador"
                          : currentUser?.role === "ROLE_SECRETARY"
                            ? "Secretária"
                            : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="relative z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="fixed inset-0 z-40 flex">
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Fechar sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-gray-900">
                    Sistema Escolar
                  </h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {filteredNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          isActive
                            ? "bg-primary-100 text-primary-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`${
                            isActive
                              ? "text-primary-500"
                              : "text-gray-400 group-hover:text-gray-500"
                          } mr-4 flex-shrink-0 h-6 w-6`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">
                      {detailedUser.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentUser?.role === "ROLE_ADMIN"
                        ? "Administrador"
                        : currentUser?.role === "ROLE_TEACHER"
                          ? "Professor"
                          : currentUser?.role === "ROLE_STUDENT"
                            ? "Aluno"
                            : currentUser?.role === "ROLE_COORDINATOR"
                              ? "Coordenador"
                              : currentUser?.role === "ROLE_SECRETARY"
                                ? "Secretária"
                                : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão de logout flutuante */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        title="Sair"
      >
        <LogOut className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Layout;
