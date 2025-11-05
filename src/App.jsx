import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { authService } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import SecretaryDashboard from "./pages/SecretaryDashboard";
import SecretaryEnrollments from "./pages/SecretaryEnrollments";
import SecretaryNewEnrollment from "./pages/SecretaryNewEnrollment";
import SecretaryLogs from "./pages/SecretaryLogs";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import CoordinatorClasses from "./pages/CoordinatorClasses";
import CoordinatorPerformance from "./pages/CoordinatorPerformance";
import CoordinatorSchedules from "./pages/CoordinatorSchedules";
import StudentActivities from "./pages/StudentActivities";
import StudentAttendance from "./pages/StudentAttendance";
import Activities from "./pages/Activities";
import AttendanceCall from "./pages/AttendanceCall";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Admins from "./pages/Admins";
import Secretaries from "./pages/Secretaries";
import Coordinators from "./pages/Coordinators";
import SchoolUnits from "./pages/SchoolUnits";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Unauthorized from "./pages/Unauthorized";
import TokenWarning from "./components/TokenWarning";

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />

        {/* Componente de aviso de token expirado */}
        <TokenWarning />

        <Routes>
          {/* Rota pública */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          {/* Rota de erro */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  {(() => {
                    const role = user?.role;
                    switch (role) {
                      case "ROLE_ADMIN":
                        return <Dashboard />;
                      case "ROLE_TEACHER":
                        return <TeacherDashboard />;
                      case "ROLE_STUDENT":
                        return <StudentDashboard />;
                      case "ROLE_SECRETARY":
                        return <SecretaryDashboard />;
                      case "ROLE_COORDINATOR":
                        return <CoordinatorDashboard />;
                      default:
                        return <Navigate to="/login" replace />;
                    }
                  })()}
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activities"
            element={
              <ProtectedRoute requiredRole="ROLE_TEACHER">
                <Layout>
                  <Activities />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance-call"
            element={
              <ProtectedRoute requiredRole="ROLE_TEACHER">
                <Layout>
                  <AttendanceCall />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute requiredRole={["ROLE_ADMIN", "ROLE_SECRETARY"]}>
                <Layout>
                  <Students />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/teachers"
            element={
              <ProtectedRoute requiredRole={["ROLE_ADMIN", "ROLE_SECRETARY"]}>
                <Layout>
                  <Teachers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Layout>
                  <Admins />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretaries"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Layout>
                  <Secretaries />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinators"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Layout>
                  <Coordinators />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-units"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Layout>
                  <SchoolUnits />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Layout>
                  <Classes />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator/classes"
            element={
              <ProtectedRoute requiredRole="ROLE_COORDINATOR">
                <Layout>
                  <CoordinatorClasses />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator/performance"
            element={
              <ProtectedRoute requiredRole="ROLE_COORDINATOR">
                <Layout>
                  <CoordinatorPerformance />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator/schedules"
            element={
              <ProtectedRoute requiredRole="ROLE_COORDINATOR">
                <Layout>
                  <CoordinatorSchedules />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/subjects"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Layout>
                  <Subjects />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/secretary/enrollments"
            element={
              <ProtectedRoute requiredRole="ROLE_SECRETARY">
                <Layout>
                  <SecretaryEnrollments />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/secretary/new-enrollment"
            element={
              <ProtectedRoute requiredRole="ROLE_SECRETARY">
                <Layout>
                  <SecretaryNewEnrollment />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/secretary/logs"
            element={
              <ProtectedRoute requiredRole="ROLE_SECRETARY">
                <Layout>
                  <SecretaryLogs />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-activities"
            element={
              <ProtectedRoute requiredRole="ROLE_STUDENT">
                <Layout>
                  <StudentActivities />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-attendance"
            element={
              <ProtectedRoute requiredRole="ROLE_STUDENT">
                <Layout>
                  <StudentAttendance />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirecionamento padrão */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rota para qualquer caminho não encontrado */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
