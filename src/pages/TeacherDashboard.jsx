import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  ClipboardCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import AttendanceHistory from "../components/AttendanceHistory";
import TeacherStats from "../components/TeacherStats";
import CompletedCallsStatus from "../components/CompletedCallsStatus";

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const response = await api.get(
        `/teacher/username/${currentUser.username}`,
      );
      const teacher = response.data;
      setTeacherData(teacher);

      if (teacher.schoolClassIds && teacher.schoolClassIds.length > 0) {
        await fetchTeacherClasses(teacher.schoolClassIds);
      } else {
        setTeacherClasses([]);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do professor");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherClasses = async (classIds) => {
    try {
      const response = await api.get("/schoolclass");
      const allClasses = response.data;
      const teacherClassesData = allClasses.filter((schoolClass) =>
        classIds.includes(schoolClass.id),
      );
      setTeacherClasses(teacherClassesData);

      if (teacherClassesData.length > 0 && !selectedClass) {
        setSelectedClass(teacherClassesData[0]);
      }
    } catch (error) {
      toast.error("Erro ao carregar turmas");
      console.error("Erro:", error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard do Professor
        </h1>
        <p className="text-gray-600">
          Bem-vindo, {teacherData?.name || currentUser?.username}! Gerencie suas
          turmas e presenças.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Minhas Turmas"
          value={teacherClasses.length}
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="Total de Alunos"
          value="--"
          icon={Users}
          color="bg-green-500"
          subtitle="Todas as turmas"
        />
        <StatCard
          title="Chamadas Realizadas"
          value="--"
          icon={CheckCircle}
          color="bg-emerald-500"
          subtitle="Este mês"
        />
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Minhas Turmas
          </h3>
          <div className="space-y-2">
            {teacherClasses.length === 0 ? (
              <p className="text-gray-500">Nenhuma turma atribuída</p>
            ) : (
              teacherClasses.map((schoolClass) => (
                <div
                  key={schoolClass.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <div className="font-medium">{schoolClass.name}</div>
                    <div className="text-sm text-gray-500">
                      ID: {schoolClass.id}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Realizar Chamada
          </h3>
          <p className="text-gray-600 mb-4">
            Faça a chamada dos seus alunos de forma rápida e organizada
          </p>
          <Link
            to="/attendance-call"
            className="btn btn-primary flex items-center justify-center w-full"
          >
            <ClipboardCheck className="h-5 w-5 mr-2" />
            Fazer Chamada
          </Link>
        </div>
      </div>

      {/* Informações do Professor */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Minhas Informações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">{teacherData?.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{teacherData?.email || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Usuário:</span>
              <span className="font-medium">{currentUser?.username}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">CPF:</span>
              <span className="font-medium">
                {teacherData?.cpf
                  ? teacherData.cpf.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      "$1.$2.$3-$4",
                    )
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium">
                {teacherData?.phone
                  ? teacherData.phone.replace(
                      /(\d{2})(\d{5})(\d{4})/,
                      "($1) $2-$3",
                    )
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Turmas:</span>
              <span className="font-medium">{teacherClasses.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas do Professor */}
      <TeacherStats teacherData={teacherData} teacherClasses={teacherClasses} />

      {/* Chamadas Finalizadas */}
      <CompletedCallsStatus
        teacherData={teacherData}
        teacherClasses={teacherClasses}
      />

      {/* Histórico de Chamadas */}
      <AttendanceHistory
        teacherData={teacherData}
        selectedClass={teacherClasses[0] || null}
      />
    </div>
  );
};

export default TeacherDashboard;
