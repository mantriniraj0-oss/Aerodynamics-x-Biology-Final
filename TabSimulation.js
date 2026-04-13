function TabSimulation({ isAdmin }) {
    const [sims, setSims] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAdding, setIsAdding] = React.useState(false);
    const [newSim, setNewSim] = React.useState({ title: '', url: '', description: '' });

    React.useEffect(() => {
        loadSims();
    }, []);

    const loadSims = async () => {
        try {
            const data = await DB.getAll(DB_TABLES.SIM);
            setSims(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this simulation?')) return;
        try {
            await DB.delete(DB_TABLES.SIM, id);
            setSims(sims.filter(s => s._id !== id));
        } catch (error) {
            alert('Failed to delete simulation');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const savedSim = await DB.add(DB_TABLES.SIM, newSim);
            setSims([savedSim, ...sims]);
            setIsAdding(false);
            setNewSim({ title: '', url: '', description: '' });
        } catch (error) {
            alert('Failed to add simulation');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-16" data-name="tab-simulation">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 font-serif">Simulation Lab</h2>
                    <p className="text-slate-300 text-lg">Interactive visualizations of airflow and biomechanics.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
                        <div className="icon-flask-conical"></div> Add Simulation
                    </button>
                )}
            </div>

            {/* Interactive Lab Section */}
            <div className="animate-fade-in space-y-8">
                <div className="glass-panel p-1 rounded-3xl border-emerald-500/20 bg-black/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 opacity-50"></div>
                    
                    <div className="p-6 md:p-8">
                         <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                <div className="icon-wind text-2xl"></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Interactive Wind Turbine Explorer</h3>
                                <p className="text-slate-400 text-sm">Advanced simulation environment for wind turbine aerodynamics</p>
                            </div>
                        </div>

                        <div className="w-full h-[600px] md:h-[700px] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 relative">
                            <iframe 
                                src="https://wind-turbine-explorer--mogo29.replit.app/" 
                                className="w-full h-full absolute inset-0"
                                frameBorder="0"
                                title="Wind Turbine Explorer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing External Simulations List */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-6 font-serif border-b border-white/10 pb-4">External Resources</h3>
                
                {isAdmin && isAdding && (
                    <div className="card mb-10 animate-fade-in border-emerald-500/30 bg-emerald-900/20">
                         <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-emerald-100">
                            <div className="p-1 bg-emerald-500/20 rounded text-emerald-400"><div className="icon-plus text-sm"></div></div>
                            New Resource
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="input-field" 
                                        value={newSim.title}
                                        onChange={(e) => setNewSim({...newSim, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Embed URL</label>
                                    <input 
                                        required
                                        type="url" 
                                        className="input-field" 
                                        placeholder="https://..."
                                        value={newSim.url}
                                        onChange={(e) => setNewSim({...newSim, url: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                                <textarea 
                                    className="input-field min-h-[100px]" 
                                    value={newSim.description}
                                    onChange={(e) => setNewSim({...newSim, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary text-sm">Cancel</button>
                                <button type="submit" className="btn-primary text-sm">Save Resource</button>
                            </div>
                        </form>
                    </div>
                )}

                {isLoading ? (
                     <div className="text-center py-10 text-slate-400">Loading resources...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {sims.map(sim => (
                            <div key={sim._id} className="card p-0 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden ring-1 ring-black/5">
                                <div className="relative aspect-video bg-slate-900 group">
                                    <iframe 
                                        src={sim.url} 
                                        title={sim.title}
                                        className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"></div>
                                    
                                    {isAdmin && (
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            <button 
                                                onClick={() => handleDelete(sim._id)}
                                                className="bg-red-500/90 backdrop-blur text-white p-2.5 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <div className="icon-trash-2 text-sm"></div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 flex-1 bg-gradient-to-b from-emerald-950/80 to-emerald-950/40 backdrop-blur-md border-t border-white/5">
                                    <h3 className="text-2xl font-bold mb-3 text-white font-serif">{sim.title}</h3>
                                    <p className="text-slate-200 leading-relaxed">{sim.description}</p>
                                </div>
                            </div>
                        ))}
                        {sims.length === 0 && (
                            <div className="col-span-full py-10 text-center text-slate-400">No additional resources added yet.</div>
                        )}
                    </div>
                )}
            </div>
            
        </div>
    );
}