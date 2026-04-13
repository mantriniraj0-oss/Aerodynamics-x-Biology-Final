// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [activeTab, setActiveTab] = React.useState('intro');
    const [isAdmin, setIsAdmin] = React.useState(() => {
        return localStorage.getItem('ab_auth_session') === 'true';
    });

    const handleLogin = () => {
        setIsAdmin(true);
        localStorage.setItem('ab_auth_session', 'true');
    };

    const handleLogout = () => {
        setIsAdmin(false);
        localStorage.removeItem('ab_auth_session');
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'intro': return <TabIntro isAdmin={isAdmin} />;
            case 'ppt': return <TabPPT isAdmin={isAdmin} />;
            case 'simulation': return <TabSimulation isAdmin={isAdmin} />;
            case 'reallife': return <TabRealLife isAdmin={isAdmin} />;
            case 'developers': return <TabDevelopers isAdmin={isAdmin} />;
            case 'admin': return <TabAdmin isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout} />;
            default: return <TabIntro isAdmin={isAdmin} />;
        }
    };

    return (
      <div className="min-h-screen relative flex flex-col" data-name="app" data-file="app.js">
        {/* Fixed Background Image Container */}
        <div 
            className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2560&auto=format&fit=crop')" }}
        ></div>
        
        {/* Dark Overlay for better text readability on bg image */}
        <div className="fixed inset-0 -z-10 bg-emerald-950/60 pointer-events-none"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-emerald-950/30 to-black/80 pointer-events-none"></div>

        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
        
        <main className={`flex-grow w-full relative z-10 ${activeTab === 'intro' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-52 pb-32 md:py-32'}`}>
             {/* Admin Banner Indicator */}
             {isAdmin && activeTab !== 'admin' && (
                <div className="glass-panel text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-6 animate-fade-in border-emerald-500/30 bg-emerald-900/40">
                    <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></div>
                    <div className="icon-shield-check text-xs"></div>
                    Admin Mode Active
                </div>
            )}
            
            <div key={activeTab} className="page-enter-active">
                {renderContent()}
            </div>
        </main>

        <ChatBot activeTab={activeTab} setActiveTab={setActiveTab} />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);