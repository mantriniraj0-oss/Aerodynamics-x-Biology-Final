function Navbar({ activeTab, setActiveTab, isAdmin }) {
    const tabs = [
        { id: 'intro', label: 'Intro' },
        { id: 'ppt', label: 'PPT' },
        { id: 'simulation', label: 'Simulation' },
        { id: 'reallife', label: 'Real Life' },
        { id: 'developers', label: 'Developers', icon: 'users' },
        { id: 'admin', label: 'Admin', icon: 'lock' }
    ];

    const [scrolled, setScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled || mobileMenuOpen ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-500 ${scrolled || mobileMenuOpen ? 'h-16' : 'h-20'}`}>
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('intro')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative border border-white/20 bg-white/5 p-2 rounded-full text-emerald-400 transform group-hover:rotate-12 transition-transform duration-500">
                                <div className="icon-wind text-xl"></div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-xl text-white leading-none tracking-wide">
                                Aero<span className="text-emerald-400">×</span>Bio
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium group-hover:text-emerald-300 transition-colors">Engineering Nature</span>
                        </div>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className={`hidden md:flex items-center p-1 rounded-full transition-all duration-500 ${
                        scrolled ? 'bg-white/5 border border-white/10' : 'bg-black/20 border border-white/5 backdrop-blur-sm'
                    }`}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === tab.id 
                                    ? 'bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-900/20 border border-emerald-500/30' 
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab.icon && <div className={`icon-${tab.icon} text-sm`}></div>}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-lg transition-colors backdrop-blur-sm ${
                                mobileMenuOpen 
                                ? 'bg-emerald-500/20 text-emerald-300' 
                                : 'bg-white/10 text-white hover:bg-emerald-500/20 hover:text-emerald-300'
                            }`}
                        >
                            {mobileMenuOpen ? (
                                <div className="icon-x text-2xl"></div>
                            ) : (
                                <div className="icon-menu text-2xl"></div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu Dropdown (Collapsible) */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? 'max-h-96 opacity-100 border-t border-white/10' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-4 py-4 space-y-2 bg-black/40 backdrop-blur-xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center gap-3 ${
                                activeTab === tab.id 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                        >
                            {tab.icon ? (
                                <div className={`icon-${tab.icon} text-lg`}></div>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                            )}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}