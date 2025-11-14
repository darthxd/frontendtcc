import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você pode também registrar o erro em um serviço de relatório de erros
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
    console.error("Error stack:", error.stack);
    console.error("Component stack:", errorInfo.componentStack);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Tenta identificar se é o erro de parâmetro desestruturado
    if (
      error.message &&
      (error.message.includes("undefined") ||
        error.message.includes("destructured"))
    ) {
      console.error(
        "DIAGNÓSTICO: Erro de parâmetro desestruturado detectado!",
      );
      console.error("Erro completo:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback
      return (
        <div
          style={{
            padding: "20px",
            background: "#fee",
            border: "2px solid #c00",
            margin: "20px",
            fontFamily: "monospace",
          }}
        >
          <h1 style={{ color: "#c00" }}>Algo deu errado</h1>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Detalhes do erro
            </summary>
            <div style={{ marginTop: "10px" }}>
              <h3>Mensagem:</h3>
              <pre
                style={{
                  background: "#fff",
                  padding: "10px",
                  overflow: "auto",
                  border: "1px solid #ccc",
                }}
              >
                {this.state.error && this.state.error.toString()}
              </pre>

              <h3 style={{ marginTop: "20px" }}>Stack Trace:</h3>
              <pre
                style={{
                  background: "#fff",
                  padding: "10px",
                  overflow: "auto",
                  border: "1px solid #ccc",
                  fontSize: "12px",
                }}
              >
                {this.state.error && this.state.error.stack}
              </pre>

              {this.state.errorInfo && (
                <>
                  <h3 style={{ marginTop: "20px" }}>Component Stack:</h3>
                  <pre
                    style={{
                      background: "#fff",
                      padding: "10px",
                      overflow: "auto",
                      border: "1px solid #ccc",
                      fontSize: "12px",
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
          </details>

          <div style={{ marginTop: "20px" }}>
            <h3>Informações de Debug:</h3>
            <ul style={{ background: "#fff", padding: "20px" }}>
              <li>React carregado: {React ? "✓ Sim" : "✗ Não"}</li>
              <li>
                Document disponível: {typeof document !== "undefined" ? "✓ Sim" : "✗ Não"}
              </li>
              <li>
                Window disponível: {typeof window !== "undefined" ? "✓ Sim" : "✗ Não"}
              </li>
              <li>
                LocalStorage disponível:{" "}
                {typeof localStorage !== "undefined" ? "✓ Sim" : "✗ Não"}
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#c00",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Limpar dados e ir para Login
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              marginLeft: "10px",
              padding: "10px 20px",
              background: "#06c",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
