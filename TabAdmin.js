function TabAdmin({ isAdmin, onLogin, onLogout }) {
    const [credentials, setCredentials] = React.useState({ id: '', password: '' });
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded credentials as per requirement
        if (credentials.id === 'Aerodynamics_future' && credentials.password === 'Nmimsians') {
            onLogin();
            setError('');
        } else {
            setError('Invalid Admin ID or Password');
        }
    };

    if (isAdmin) {
        return (
            <div className="max-w-md mx-auto text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-500/30">
                    <div className="icon-shield-check text-4xl"></div>
                </div>
                <h2 className="text-3xl font-bold text-slate-100">Admin Access Granted</h2>
                <p className="text-slate-400">You have full access to edit content, upload files, and manage simulations across all tabs.</p>
                <button onClick={onLogout} className="btn-secondary w-full justify-center">
                    <div className="icon-log-out"></div> Logout
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-12" data-name="admin-login">
            <div className="card border-emerald-500/20 shadow-xl bg-black/40">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-500/30">
                        <div className="icon-lock text-3xl"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">Admin Login</h2>
                    <p className="text-slate-400 text-sm mt-1">Please verify your credentials to edit content.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-3 rounded-lg text-sm flex items-center gap-2">
                            <div className="icon-circle-alert"></div>
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Admin ID</label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                <div className="icon-user text-lg"></div>
                            </div>
                            <input 
                                type="text" 
                                className="input-field pl-10" 
                                placeholder="Enter Admin ID"
                                value={credentials.id}
                                onChange={(e) => setCredentials({...credentials, id: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                <div className="icon-key text-lg"></div>
                            </div>
                            <input 
                                type="password" 
                                className="input-field pl-10" 
                                placeholder="Enter Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center py-2.5">
                        Verify Credentials
                    </button>
                </form>
            </div>
        </div>
    );
}