function TabRealLife({ isAdmin }) {
    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAdding, setIsAdding] = React.useState(false);
    const [newItem, setNewItem] = React.useState({ title: '', image: '', content: '' });

    React.useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await DB.getAll(DB_TABLES.REAL_LIFE);
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await DB.delete(DB_TABLES.REAL_LIFE, id);
            setItems(items.filter(i => i._id !== id));
        } catch (error) {
            alert('Failed to delete item');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const itemData = {
                ...newItem,
                image: newItem.image || 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800'
            };
            const savedItem = await DB.add(DB_TABLES.REAL_LIFE, itemData);
            setItems([savedItem, ...items]);
            setIsAdding(false);
            setNewItem({ title: '', image: '', content: '' });
        } catch (error) {
            alert('Failed to add case study');
        }
    };

    return (
        <div className="max-w-5xl mx-auto" data-name="tab-real-life">
             <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 font-serif">Bio-Inspired Innovation</h2>
                    <p className="text-slate-300 text-lg">Real-world applications where biology meets engineering.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
                        <div className="icon-sparkles"></div> Add Case Study
                    </button>
                )}
            </div>

            {isAdmin && isAdding && (
                <div className="card mb-12 animate-fade-in border-emerald-500/30 bg-emerald-900/20">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-emerald-100">
                        <div className="p-1 bg-emerald-500/20 rounded text-emerald-400"><div className="icon-plus text-sm"></div></div>
                        New Case Study
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
                                <input 
                                    required
                                    type="text" 
                                    className="input-field" 
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Image URL</label>
                                <input 
                                    type="url" 
                                    className="input-field" 
                                    placeholder="https://..."
                                    value={newItem.image}
                                    onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Content</label>
                            <textarea 
                                className="input-field min-h-[120px]" 
                                value={newItem.content}
                                onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary text-sm">Cancel</button>
                            <button type="submit" className="btn-primary text-sm bg-emerald-600 hover:bg-emerald-700">Add Item</button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10 text-slate-400">Loading case studies...</div>
            ) : (
                <div className="space-y-16">
                    {items.map((item, index) => (
                        <div key={item._id} className={`flex flex-col md:flex-row gap-10 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} group`}>
                            <div className="w-full md:w-1/2">
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-[1.02] hover:shadow-emerald-500/20">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 z-10"></div>
                                    <img src={item.image} alt={item.title} className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" />
                                    
                                    {isAdmin && (
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="absolute top-4 right-4 z-20 bg-white/90 text-red-500 p-2.5 rounded-full shadow hover:bg-white transition-colors"
                                        >
                                            <div className="icon-trash-2 text-sm"></div>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <div className={`flex items-center gap-3 ${index % 2 === 1 ? 'md:justify-end' : ''}`}>
                                    <span className="h-px w-12 bg-emerald-400"></span>
                                    <span className="text-emerald-300 font-bold uppercase tracking-widest text-xs">Case Study 0{index + 1}</span>
                                </div>
                                <h3 className={`text-4xl font-bold text-white font-serif leading-tight ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                                    {item.title}
                                </h3>
                                <p className={`text-slate-200 leading-loose text-lg font-light ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                                    {item.content}
                                </p>
                                <div className={`pt-2 ${index % 2 === 1 ? 'flex justify-end' : ''}`}>
                                    <button className="text-emerald-300 font-medium hover:text-emerald-200 transition-colors flex items-center gap-2 group/btn">
                                        Read Full Analysis 
                                        <div className="icon-arrow-right transition-transform group-hover/btn:translate-x-1"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center text-slate-400 py-10">No case studies available.</div>
                    )}
                </div>
            )}
        </div>
    );
}