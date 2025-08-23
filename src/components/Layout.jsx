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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailedUser, setDetailedUser] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, logout, hasRole } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
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
      name: "Fazer Chamada",
      href: "/attendance-call",
      icon: ClipboardCheck,
      role: "ROLE_TEACHER",
    },
    { name: "Alunos", href: "/students", icon: Users, role: "ROLE_ADMIN" },
    {
      name: "Professores",
      href: "/teachers",
      icon: GraduationCap,
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
                  {currentUser.username}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.role === "ROLE_ADMIN"
                    ? "Administrador"
                    : currentUser?.role === "ROLE_TEACHER"
                      ? "Professor"
                      : currentUser?.role === "ROLE_STUDENT"
                        ? "Aluno"
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
                      {currentUser.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentUser?.role === "ROLE_ADMIN"
                        ? "Administrador"
                        : currentUser?.role === "ROLE_TEACHER"
                          ? "Professor"
                          : currentUser?.role === "ROLE_STUDENT"
                            ? "Aluno"
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
