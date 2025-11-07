import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const CoordinatorPerformance = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [stats, setStats] = useState({
    averagePerformance: 0,
    bestClass: null,
    worstClass: null,
    totalClasses: 0,
  });

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);

      // Buscar turmas
      const classesResponse = await api.get("/schoolclass");
      const classes = classesResponse.data || [];

      // Buscar estudantes
      const studentsResponse = await api.get("/student");
      const students = studentsResponse.data || [];

      // Calcular performance real por turma baseado nas notas
      const performanceByClass = await Promise.all(
        classes.map(async (cls) => {
          const classStudents = students.filter(
            (s) => s.schoolClass?.id === cls.id,
          );

          let performance = 0;
          let hasGrades = false;

          try {
            // Buscar notas médias por matéria da turma (todos os bimestres)
            const gradesResponse = await api.get(
              `/grade/class/${cls.id}/performance`,
            );
            const gradesBySubject = gradesResponse.data || {};

            // Calcular média geral entre todas as matérias
            const subjects = Object.keys(gradesBySubject);
            if (subjects.length > 0) {
              const totalAverage = subjects.reduce((sum, subject) => {
                return sum + (gradesBySubject[subject] || 0);
              }, 0);

              performance = Math.round((totalAverage / subjects.length) * 10); // Convertendo para porcentagem (0-100)
              hasGrades = true;
            }
          } catch (error) {
            console.error(`Erro ao buscar notas da turma ${cls.name}:`, error);
          }

          // Se não houver notas, performance fica como 0
          if (!hasGrades) {
            performance = 0;
          }

          return {
            ...cls,
            performance,
            studentCount: classStudents.length,
            hasGrades,
          };
        }),
      );

      // Ordenar por performance
      const sorted = [...performanceByClass].sort(
        (a, b) => b.performance - a.performance,
      );

      // Calcular estatísticas
      const classesWithGrades = performanceByClass.filter((c) => c.hasGrades);
      const avgPerformance =
        classesWithGrades.length > 0
          ? Math.round(
              classesWithGrades.reduce((sum, cls) => sum + cls.performance, 0) /
                classesWithGrades.length,
            )
          : 0;

      setPerformanceData(sorted);
      setStats({
        averagePerformance: avgPerformance,
        bestClass: sorted.find((c) => c.hasGrades) || null,
        worstClass: sorted.reverse().find((c) => c.hasGrades) || null,
        totalClasses: classes.length,
      });
    } catch (error) {
      toast.error("Erro ao carregar dados de desempenho");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 80) return "text-green-600";
    if (performance >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBgColor = (performance) => {
    if (performance >= 80) return "bg-green-100";
    if (performance >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getPerformanceLabel = (performance, hasGrades) => {
    if (!hasGrades) return "Sem Dados";
    if (performance >= 80) return "Excelente";
    if (performance >= 60) return "Bom";
    return "Precisa Melhorar";
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
      FIRST: "1º Ano",
      SECOND: "2º Ano",
      THIRD: "3º Ano",
    };
    return years[year] || year;
  };

  const getShiftLabel = (shift) => {
    const shifts = {
      MORNING: "Manhã",
      AFTERNOON: "Tarde",
      EVENING: "Noite",
    };
    return shifts[shift] || shift;
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
          <h1 className="text-2xl font-bold text-gray-900">
            Análise de Desempenho
          </h1>
          <p className="text-gray-600">
            Acompanhe o desempenho acadêmico das turmas com base nas notas reais
          </p>
        </div>
        <button
          onClick={fetchPerformanceData}
          className="btn btn-secondary flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Média Geral</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.averagePerformance}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Turmas com notas</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de Turmas
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalClasses}
              </p>
              <p className="text-xs text-gray-500 mt-1">Monitoradas</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {stats.bestClass && (
          <div className="card bg-green-50 border-green-200">
            <div>
              <p className="text-sm font-medium text-green-700">
                Melhor Desempenho
              </p>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {stats.bestClass.name}
              </p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                {stats.bestClass.performance}%
              </p>
            </div>
          </div>
        )}

        {stats.worstClass && (
          <div className="card bg-orange-50 border-orange-200">
            <div>
              <p className="text-sm font-medium text-orange-700">
                Precisa de Atenção
              </p>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                {stats.worstClass.name}
              </p>
              <p className="text-lg font-semibold text-orange-600 mt-1">
                {stats.worstClass.performance}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Alert Info */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Informação sobre Desempenho
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Os dados de desempenho são calculados com base nas notas reais dos
              alunos em todas as matérias e bimestres. A média é calculada entre
              todas as disciplinas. Turmas sem notas cadastradas aparecem com 0%
              ou "Sem Dados". Turmas com desempenho abaixo de 60% necessitam de
              atenção especial.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Desempenho por Turma
        </h2>
        {performanceData.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma turma encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há dados de desempenho disponíveis no momento.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso / Ano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alunos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Desempenho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceData.map((classItem, index) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold ${
                            index === 0 && classItem.hasGrades
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1 && classItem.hasGrades
                                ? "bg-gray-200 text-gray-700"
                                : index === 2 && classItem.hasGrades
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {index + 1}º
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {classItem.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCourseLabel(classItem.course)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getYearLabel(classItem.year)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getShiftLabel(classItem.shift)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {classItem.studentCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-full bg-gray-200 rounded-full h-2 mr-2"
                          style={{ width: "100px" }}
                        >
                          <div
                            className={`h-2 rounded-full ${
                              !classItem.hasGrades
                                ? "bg-gray-400"
                                : classItem.performance >= 80
                                  ? "bg-green-500"
                                  : classItem.performance >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{
                              width: `${classItem.hasGrades ? classItem.performance : 0}%`,
                            }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            classItem.hasGrades
                              ? getPerformanceColor(classItem.performance)
                              : "text-gray-500"
                          }`}
                        >
                          {classItem.hasGrades
                            ? `${classItem.performance}%`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {classItem.hasGrades ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Com Notas
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Sem Notas
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          !classItem.hasGrades
                            ? "bg-gray-100 text-gray-600"
                            : `${getPerformanceBgColor(classItem.performance)} ${getPerformanceColor(classItem.performance)}`
                        }`}
                      >
                        {getPerformanceLabel(
                          classItem.performance,
                          classItem.hasGrades,
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Excelente</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {
                  performanceData.filter(
                    (c) => c.hasGrades && c.performance >= 80,
                  ).length
                }
              </p>
              <p className="text-xs text-green-600 mt-1">≥ 80% de desempenho</p>
            </div>
            <div className="bg-green-200 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="card bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Bom</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">
                {
                  performanceData.filter(
                    (c) =>
                      c.hasGrades && c.performance >= 60 && c.performance < 80,
                  ).length
                }
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                60% - 79% de desempenho
              </p>
            </div>
            <div className="bg-yellow-200 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="card bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">
                Precisa Melhorar
              </p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {
                  performanceData.filter(
                    (c) => c.hasGrades && c.performance < 60,
                  ).length
                }
              </p>
              <p className="text-xs text-red-600 mt-1">
                {"<"} 60% de desempenho
              </p>
            </div>
            <div className="bg-red-200 rounded-lg p-3">
              <TrendingDown className="h-6 w-6 text-red-700" />
            </div>
          </div>
        </div>

        <div className="card bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Sem Dados</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {performanceData.filter((c) => !c.hasGrades).length}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Sem notas cadastradas
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg p-3">
              <AlertCircle className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorPerformance;
