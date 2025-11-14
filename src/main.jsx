import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Diagnóstico de erro
console.log("=== DIAGNÓSTICO INICIAL ===");
console.log("React:", StrictMode ? "✓" : "✗");
console.log("ReactDOM:", createRoot ? "✓" : "✗");
console.log("App:", App ? "✓" : "✗");
console.log("Document:", document ? "✓" : "✗");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement ? "✓" : "✗");

if (!rootElement) {
  console.error("ERRO: Elemento root não encontrado!");
  throw new Error("Failed to find the root element");
}

try {
  console.log("Criando root...");
  const root = createRoot(rootElement);
  console.log("Root criado com sucesso");

  console.log("Renderizando App...");
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log("App renderizado com sucesso");
} catch (error) {
  console.error("ERRO NO MAIN.JSX:", error);
  console.error("Stack:", error.stack);
  // Mostra erro na tela para o usuário
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; border: 2px solid #c00; margin: 20px; font-family: monospace;">
      <h2 style="color: #c00;">Erro ao carregar aplicação</h2>
      <p><strong>Mensagem:</strong> ${error.message}</p>
      <pre style="background: #fff; padding: 10px; overflow: auto;">${error.stack}</pre>
    </div>
  `;
  throw error;
}
