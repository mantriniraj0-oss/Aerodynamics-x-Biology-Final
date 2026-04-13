function TabIntro({ isAdmin }) {
    const [data, setData] = React.useState({
        title: "Loading...",
        content: "Please wait while we fetch the latest content..."
    });
    const [dbId, setDbId] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [tempData, setTempData] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const introData = await DB.initIntro();
            setData(introData);
            setTempData(introData);
            setDbId(introData._id);
        } catch (error) {
            console.error("Failed to load intro", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!dbId) return;
        try {
            await DB.update(DB_TABLES.INTRO, dbId, tempData);
            setData(tempData);
            setIsEditing(false);
        } catch (error) {
            alert("Failed to save changes. Please try again.");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" data-name="tab-intro">
            {/* Immersive Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center -mt-20 pt-52 md:pt-40">
                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col md:flex-row items-center gap-12">
                    
                    <div className="flex-1 space-y-8 animate-fade-in text-center md:text-left">
                        {isEditing ? (
                            <div className="space-y-6 w-full glass-panel p-8 rounded-3xl animate-fade-in">
                                <input 
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white text-4xl font-serif font-bold placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
                                    value={tempData.title}
                                    onChange={(e) => setTempData({...tempData, title: e.target.value})}
                                />
                                <textarea 
                                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-slate-200 text-lg leading-relaxed focus:outline-none focus:border-emerald-500 min-h-[200px] transition-all"
                                    value={tempData.content}
                                    onChange={(e) => setTempData({...tempData, content: e.target.value})}
                                />
                                <div className="flex gap-3 justify-end pt-4">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">Cancel</button>
                                    <button onClick={handleSave} className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all">Save Changes</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] font-serif tracking-tight drop-shadow-2xl">
                                    <span className="block text-white">The Design of</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Nature & Flight</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light max-w-2xl mx-auto md:mx-0 drop-shadow-md">
                                    {data.content}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                    <button className="btn-primary group">
                                        Start Exploring 
                                        <div className="icon-arrow-down group-hover:translate-y-1 transition-transform"></div>
                                    </button>
                                    {isAdmin && (
                                        <button onClick={() => setIsEditing(true)} className="btn-secondary">
                                            <div className="icon-pencil text-sm"></div> Edit Intro
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
            </div>

            {/* Feature Cards Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card group hover:-translate-y-4 duration-500 border-t-4 border-t-emerald-500/50">
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20">
                                <div className="icon-feather text-3xl"></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Biomimicry</h3>
                            <p className="text-slate-400 leading-relaxed">Unlocking design secrets from nature's time-tested evolutionary blueprints.</p>
                        </div>
                    </div>
                    
                    <div className="card group hover:-translate-y-4 duration-500 border-t-4 border-t-teal-500/50">
                        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-teal-400 shadow-[inset_0_0_20px_rgba(20,184,166,0.2)] group-hover:scale-110 transition-transform duration-500 border border-teal-500/20">
                                <div className="icon-wind text-3xl"></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Fluid Dynamics</h3>
                            <p className="text-slate-400 leading-relaxed">Visualizing the invisible forces of air and water flow around biological structures.</p>
                        </div>
                    </div>
                    
                    <div className="card group hover:-translate-y-4 duration-500 border-t-4 border-t-lime-500/50">
                        <div className="absolute inset-0 bg-gradient-to-b from-lime-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-lime-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-lime-400 shadow-[inset_0_0_20px_rgba(132,204,22,0.2)] group-hover:scale-110 transition-transform duration-500 border border-lime-500/20">
                                <div className="icon-plane text-3xl"></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Aviation Future</h3>
                            <p className="text-slate-400 leading-relaxed">Pioneering sustainable, quiet, and efficient aircraft inspired by avian mechanics.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}