import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
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
    console.error('FinSight India Application Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    if (window.confirm('Reset local cache to restore application? Your previous backup can be re-imported.')) {
      try {
        localStorage.clear();
      } catch (e) {}
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px', color: '#f8fafc' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
              FinSight encountered an unexpected initialization error:
            </p>
            <div style={{
              backgroundColor: '#020617',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#f43f5e',
              wordBreak: 'break-all',
              textAlign: 'left',
              maxHeight: '100px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {this.state.error?.message || String(this.state.error)}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <button
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: '#020617',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Reload Application
              </button>
              <button
                onClick={this.handleResetAndReload}
                style={{
                  width: '100%',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Restart
              </button>
            </div>
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
