function TabDevelopers({ isAdmin }) {
    const [team, setTeam] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAdding, setIsAdding] = React.useState(false);
    const [newMember, setNewMember] = React.useState({ 
        name: '', 
        title: '', 
        image: '', 
        linkedin: '',
        category: 'developer'
    });
    const fileInputRef = React.useRef(null);
    
    React.useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        try {
            const data = await DB.getAll(DB_TABLES.TEAM);
            setTeam(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await DB.delete(DB_TABLES.TEAM, id);
            setTeam(team.filter(m => m._id !== id));
        } catch (error) {
            alert('Failed to remove member');
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                alert("Image is too large. Please use an image under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewMember(prev => ({ ...prev, image: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            // Use default placeholder if no image provided
            const memberData = {
                ...newMember,
                image: newMember.image || 'https://drive.google.com/file/d/1J9sBRdjs3UNEj8djy6b8vf71fQzrtv2h/view?usp=drive_link',
                linkedin: newMember.linkedin || '#'
            };
            
            const savedMember = await DB.add(DB_TABLES.TEAM, memberData);
            setTeam([...team, savedMember]);
            setIsAdding(false);
            setNewMember({ 
                name: '', 
                title: '', 
                image: '', 
                linkedin: '',
                category: 'developer'
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            alert('Failed to add member');
        }
    };

    const guides = team.filter(m => m.category === 'guide');
    const developers = team.filter(m => m.category === 'developer');

    // Helper to ensure Google Drive links are viewable
    const getImageUrl = (url) => {
        if (!url) return 'https://drive.google.com/file/d/1J9sBRdjs3UNEj8djy6b8vf71fQzrtv2h/view?usp=drive_link';
        if (url.includes('drive.google.com') && url.includes('/view')) {
            // Extract ID
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
            }
        }
        return url;
    };

    const MemberCard = ({ member, isGuide = false }) => (
        <div className={`relative group ${isGuide ? 'max-w-md mx-auto transform hover:scale-105 transition-all duration-300' : ''}`}>
            <div className={`glass-card p-6 rounded-2xl flex flex-col items-center text-center h-full border border-white/10 ${isGuide ? 'bg-gradient-to-b from-emerald-900/40 to-black/40 border-emerald-500/30 shadow-emerald-900/20 shadow-2xl' : ''}`}>
                <div className={`relative mb-4 ${isGuide ? 'w-40 h-40' : 'w-32 h-32'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img 
                        src={getImageUrl(member.image)} 
                        alt={member.name}
                        className={`relative w-full h-full object-cover rounded-full border-2 shadow-xl ${isGuide ? 'border-emerald-500/50' : 'border-white/10 group-hover:border-emerald-500/50 transition-colors'}`}
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://drive.google.com/file/d/1J9sBRdjs3UNEj8djy6b8vf71fQzrtv2h/view?usp=drive_link';
                        }}
                    />
                    {isAdmin && (
                        <button 
                            onClick={() => handleDelete(member._id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                        >
                            <div className="icon-trash-2 text-xs"></div>
                        </button>
                    )}
                </div>
                
                <h3 className={`font-bold text-white font-serif mb-1 ${isGuide ? 'text-3xl' : 'text-xl'}`}>
                    {member.name}
                </h3>
                
                <p className={`font-medium mb-4 ${isGuide ? 'text-emerald-400 text-lg uppercase tracking-widest' : 'text-slate-400 text-sm'}`}>
                    {member.title}
                </p>

                {member.linkedin && member.linkedin !== '#' && (
                    <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-[#0077b5] hover:text-white text-slate-300 transition-all text-sm font-medium border border-white/5"
                    >
                        <div className="icon-linkedin text-sm"></div>
                        <span>Connect</span>
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto" data-name="tab-developers">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-16 gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2 font-serif">Meet the Team</h2>
                    <p className="text-slate-300 text-lg">The minds behind Aerodynamics × Biology.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
                        <div className="icon-user-plus"></div> Add Member
                    </button>
                )}
            </div>

            {isAdmin && isAdding && (
                <div className="card mb-16 animate-fade-in border-emerald-500/30 bg-emerald-900/20 max-w-2xl mx-auto">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-emerald-100">
                        <div className="p-1 bg-emerald-500/20 rounded text-emerald-400"><div className="icon-plus text-sm"></div></div>
                        Add Team Member
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="input-field" 
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Title / Degree</label>
                                <input 
                                    required
                                    type="text" 
                                    className="input-field" 
                                    value={newMember.title}
                                    onChange={(e) => setNewMember({...newMember, title: e.target.value})}
                                    placeholder="e.g. B.tech AI"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Role Category</label>
                                <select 
                                    className="input-field bg-black/40 text-slate-200"
                                    value={newMember.category}
                                    onChange={(e) => setNewMember({...newMember, category: e.target.value})}
                                >
                                    <option value="developer">Developer</option>
                                    <option value="guide">Guide / Professor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">LinkedIn URL</label>
                                <input 
                                    type="url" 
                                    className="input-field" 
                                    value={newMember.linkedin}
                                    onChange={(e) => setNewMember({...newMember, linkedin: e.target.value})}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Profile Image</label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input 
                                        type="url" 
                                        className="input-field" 
                                        value={newMember.image.startsWith('data:') ? '' : newMember.image}
                                        onChange={(e) => setNewMember({...newMember, image: e.target.value})}
                                        placeholder="Paste Image URL..."
                                        disabled={newMember.image.startsWith('data:')}
                                    />
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-xl hover:bg-emerald-600/30 transition-colors whitespace-nowrap flex items-center gap-2"
                                    >
                                        <div className="icon-upload text-sm"></div> Upload
                                    </button>
                                </div>
                                
                                {newMember.image && (
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/50 group">
                                        <img src={newMember.image} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setNewMember(prev => ({ ...prev, image: '' }));
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                        >
                                            <div className="icon-x"></div>
                                        </button>
                                    </div>
                                )}
                                <p className="text-xs text-slate-500">Supported: JPG, PNG (Max 2MB). Paste a URL or upload a file.</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary text-sm">Cancel</button>
                            <button type="submit" className="btn-primary text-sm">Save Member</button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading team...</p>
                </div>
            ) : (
                <div className="space-y-20">
                    {/* Guidance Section */}
                    {guides.length > 0 && (
                        <div className="text-center space-y-8 animate-fade-in">
                            <div className="inline-block relative">
                                <h3 className="text-xl font-medium text-emerald-400 uppercase tracking-[0.2em] mb-2">Under Guidance of</h3>
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                {guides.map(guide => (
                                    <MemberCard key={guide._id} member={guide} isGuide={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Developers Section */}
                    {developers.length > 0 && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-bold text-white font-serif">Developers</h3>
                                <div className="h-px flex-1 bg-white/10"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {developers.map(dev => (
                                    <MemberCard key={dev._id} member={dev} />
                                ))}
                            </div>
                        </div>
                    )}

                    {team.length === 0 && (
                        <div className="text-center text-slate-400 py-10 bg-white/5 rounded-2xl border border-white/5">
                            No team members added yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}