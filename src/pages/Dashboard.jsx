import { useState, useEffect } from "react";
import { Users, GraduationCap, BookOpen, School } from "lucide-react";
import api from "../services/api";
import { authService } from "../services/authService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (authService.isAdmin()) {
          const [studentsRes, teachersRes, classesRes, subjectsRes] =
            await Promise.all([
              api.get("/student"),
              api.get("/teachers"),
              api.get("/schoolclass"),
              api.get("/schoolsubject"),
            ]);

          setStats({
            students: studentsRes.data.length,
            teachers: teachersRes.data.length,
            classes: classesRes.data.length,
            subjects: subjectsRes.data.length,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {loading ? "..." : value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bem-vindo, {currentUser?.username}! Aqui está um resumo do sistema.
        </p>
      </div>

      {authService.isAdmin() && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Alunos"
            value={stats.students}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total de Professores"
            value={stats.teachers}
            icon={GraduationCap}
            color="bg-green-500"
          />
          <StatCard
            title="Total de Turmas"
            value={stats.classes}
            icon={School}
            color="bg-purple-500"
          />
          <StatCard
            title="Total de Disciplinas"
            value={stats.subjects}
            icon={BookOpen}
            color="bg-orange-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informações do Usuário
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Usuário:</span>
              <span className="font-medium">{currentUser?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Função:</span>
              <span className="font-medium">
                {currentUser?.role === "ROLE_ADMIN"
                  ? "Administrador"
                  : currentUser?.role === "ROLE_TEACHER"
                    ? "Professor"
                    : currentUser?.role === "ROLE_STUDENT"
                      ? "Aluno"
                      : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Permissões</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${authService.isAdmin() ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm text-gray-600">
                Acesso Administrativo
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${authService.isTeacher() ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm text-gray-600">Acesso de Professor</span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${authService.isStudent() ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm text-gray-600">Acesso de Aluno</span>
            </div>
          </div>
        </div>
      </div>

      {!authService.isAdmin() && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Acesso Limitado
          </h3>
          <p className="text-gray-600">
            Você tem acesso limitado ao sistema. Entre em contato com um
            administrador para solicitar permissões adicionais.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
