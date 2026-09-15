import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center', textAlign: 'center' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%' }}>
            <h2 style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>BhoomiSetu Application Recovered</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px', fontFamily: 'monospace' }}>
              {this.state.error?.toString() || 'A temporary component initialization error occurred.'}
            </p>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{ padding: '10px 24px', background: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Reload BhoomiSetu Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
