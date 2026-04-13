function Footer() {
    const [showShare, setShowShare] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const currentUrl = window.location.href;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&color=10b981&bgcolor=022c22`;

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <footer className="bg-black/30 border-t border-white/5 mt-20 py-8 backdrop-blur-sm relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <p className="text-slate-400 text-sm">
                        © 2026 Aerodynamics × Biology. Educational Purpose Only.
                    </p>
                    
                    <button 
                        onClick={() => setShowShare(true)}
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20"
                    >
                        <div className="icon-qr-code text-base"></div>
                        Share Website
                    </button>
                </div>

                <div className="flex gap-4 text-slate-500">
                    <a href="#" className="hover:text-emerald-400 transition-colors"><div className="icon-github text-xl"></div></a>
                    <a href="#" className="hover:text-emerald-400 transition-colors"><div className="icon-twitter text-xl"></div></a>
                    <a href="#" className="hover:text-emerald-400 transition-colors"><div className="icon-mail text-xl"></div></a>
                </div>
            </div>

            {/* Share Modal */}
            {showShare && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShare(false)}></div>
                    <div className="relative bg-emerald-950 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-fade-in flex flex-col items-center text-center">
                        <button 
                            onClick={() => setShowShare(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <div className="icon-x text-xl"></div>
                        </button>
                        
                        <h3 className="text-xl font-bold text-white mb-2 font-serif">Scan to Share</h3>
                        <p className="text-slate-400 text-sm mb-6">Share the marvels of biomimicry</p>
                        
                        <div className="bg-white p-4 rounded-2xl mb-6 shadow-inner">
                            {/* Using a public QR code API with emerald color to match theme */}
                            <img src={qrUrl} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                        </div>

                        <div className="w-full bg-black/30 rounded-xl p-3 flex items-center gap-3 border border-white/10">
                            <div className="flex-1 truncate text-xs text-slate-300 font-mono text-left">
                                {currentUrl}
                            </div>
                            <button 
                                onClick={handleCopy}
                                className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors relative"
                                title="Copy Link"
                            >
                                {copied ? <div className="icon-check text-lg"></div> : <div className="icon-copy text-lg"></div>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}