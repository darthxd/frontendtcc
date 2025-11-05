import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Eye,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const CoordinatorClasses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = classes.filter(
      (cls) =>
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.shift?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredClasses(filtered);
  }, [searchTerm, classes]);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      // Buscar turmas
      const classesResponse = await api.get("/schoolclass");
      const classesData = classesResponse.data || [];

      // Buscar estudantes para contar por turma
      const studentsResponse = await api.get("/student");
      const students = studentsResponse.data || [];

      // Adicionar contagem de alunos por turma
      const classesWithStudents = classesData.map((cls) => ({
        ...cls,
        studentCount:
          students.filter((s) => s.schoolClass?.id === cls.id).length || 0,
        performance: Math.floor(Math.random() * 30) + 70, // Simulado
      }));

      setClasses(classesWithStudents);
      setFilteredClasses(classesWithStudents);
    } catch (error) {
      toast.error("Erro ao carregar turmas");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (classItem) => {
    try {
      // Buscar detalhes completos da turma
      const response = await api.get(`/schoolclass/${classItem.id}`);
      const classDetails = response.data;

      // Buscar alunos da turma
      const studentsResponse = await api.get("/student");
      const allStudents = studentsResponse.data || [];
      const classStudents = allStudents.filter(
        (s) => s.schoolClass?.id === classItem.id,
      );

      setSelectedClass({
        ...classDetails,
        students: classStudents,
        studentCount: classStudents.length,
      });
      setShowDetailsModal(true);
    } catch (error) {
      toast.error("Erro ao carregar detalhes da turma");
      console.error("Erro:", error);
    }
  };

  const getShiftLabel = (shift) => {
    const shifts = {
      MORNING: "Manhã",
      AFTERNOON: "Tarde",
      EVENING: "Noite",
    };
    return shifts[shift] || shift;
  };

  const getCourseLabel = (course) => {
    const courses = {
      ENSINO_MEDIO: "Ensino Médio",
      TECNICO_INFORMATICA: "Técnico em Informática",
      TECNICO_ADMINISTRACAO: "Técnico em Administração",
      TECNICO_ELETRONICA: "Técnico em Eletrônica",
    };
    return courses[course] || course;
  };

  const getYearLabel = (year) => {
    const years = {
      FIRST_YEAR: "1º Ano",
      SECOND_YEAR: "2º Ano",
      THIRD_YEAR: "3º Ano",
    };
    return years[year] || year;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Turmas</h1>
          <p className="text-gray-600">
            Visualize e gerencie as turmas da coordenação
          </p>
        </div>
        <button
          onClick={fetchClasses}
          className="btn btn-secondary flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de Turmas
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {classes.length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de Alunos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Média por Turma
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {classes.length > 0
                  ? Math.round(
                      classes.reduce((sum, cls) => sum + cls.studentCount, 0) /
                        classes.length,
                    )
                  : 0}
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar turmas por nome, curso ou turno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="card text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma turma encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Tente buscar com outros termos."
              : "Não há turmas cadastradas no momento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-2 mr-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getCourseLabel(classItem.course)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Ano:</span>
                  <span>{getYearLabel(classItem.year)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Turno:</span>
                  <span>{getShiftLabel(classItem.shift)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="font-medium">{classItem.studentCount}</span>
                  <span className="ml-1">alunos</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewDetails(classItem)}
                  className="w-full btn btn-secondary flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedClass.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  {getCourseLabel(selectedClass.course)} -{" "}
                  {getYearLabel(selectedClass.year)} -{" "}
                  {getShiftLabel(selectedClass.shift)}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Class Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="card bg-blue-50">
                <p className="text-sm font-medium text-gray-600">
                  Total de Alunos
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {selectedClass.studentCount}
                </p>
              </div>
              <div className="card bg-green-50">
                <p className="text-sm font-medium text-gray-600">Turno</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {getShiftLabel(selectedClass.shift)}
                </p>
              </div>
              <div className="card bg-purple-50">
                <p className="text-sm font-medium text-gray-600">Ano</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {getYearLabel(selectedClass.year)}
                </p>
              </div>
            </div>

            {/* Students List */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Alunos da Turma ({selectedClass.students?.length || 0})
              </h4>
              {selectedClass.students && selectedClass.students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RM
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedClass.students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.rm}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Nenhum aluno matriculado nesta turma
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-secondary"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorClasses;
