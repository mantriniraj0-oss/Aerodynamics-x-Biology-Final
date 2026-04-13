function TabPPT({ isAdmin }) {
    const [files, setFiles] = React.useState([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [newFile, setNewFile] = React.useState({ title: '', type: 'pdf' });
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [uploadError, setUploadError] = React.useState('');
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const data = await DB.getAll(DB_TABLES.PPT);
            // Sort by date desc
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setFiles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        try {
            await DB.delete(DB_TABLES.PPT, id);
            setFiles(files.filter(f => f._id !== id));
        } catch (error) {
            alert('Failed to delete file');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setUploadError('');
        
        if (file) {
            // Check file size (limit to 3MB to prevent timeouts/DB errors)
            const maxSize = 3 * 1024 * 1024; // 3MB
            if (file.size > maxSize) {
                setUploadError(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max size is 3MB.`);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            setSelectedFile(file);
            const ext = file.name.split('.').pop().toLowerCase();
            if (['pdf', 'ppt', 'pptx'].includes(ext)) {
                setNewFile(prev => ({ ...prev, type: ext }));
            }
            if (!newFile.title) {
                setNewFile(prev => ({ ...prev, title: file.name.split('.')[0] }));
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setUploadError('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        
        try {
            // Convert file to Base64 with progress tracking
            const reader = new FileReader();
            
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentLoaded = Math.round((event.loaded / event.total) * 50); // Reading takes first 50%
                    setUploadProgress(percentLoaded);
                }
            };

            reader.readAsDataURL(selectedFile);
            
            reader.onload = async () => {
                const base64Data = reader.result;
                setUploadProgress(60); // Reading done, starting DB save

                const fileData = {
                    title: newFile.title || 'Untitled Presentation',
                    type: newFile.type,
                    date: new Date().toISOString().split('T')[0],
                    url: base64Data
                };

                // Simulate network latency for the DB part so user sees progress moving from 60 to 100
                const interval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(interval);
                            return 90;
                        }
                        return prev + 5;
                    });
                }, 200);

                try {
                    // Create a promise that rejects after 30 seconds
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Upload timed out. Please try a smaller file or check your connection.')), 30000)
                    );

                    // Race the DB add against the timeout
                    const savedFile = await Promise.race([
                        DB.add(DB_TABLES.PPT, fileData),
                        timeoutPromise
                    ]);

                    clearInterval(interval);
                    setUploadProgress(100);
                    
                    // Small delay to let user see 100%
                    setTimeout(() => {
                        setFiles(prev => [savedFile, ...prev]);
                        setIsUploading(false);
                        setUploadProgress(0);
                        setNewFile({ title: '', type: 'pdf' });
                        setSelectedFile(null);
                    }, 500);
                } catch (err) {
                    console.error("Upload failed:", err);
                    clearInterval(interval);
                    
                    const errorMessage = err.message || 'Unknown error';
                    setUploadError(`Upload failed: ${errorMessage}`);
                    setIsUploading(false);
                }
            };

            reader.onerror = () => {
                setUploadError('Error reading file from disk.');
                setIsUploading(false);
            };

        } catch (error) {
            console.error(error);
            setUploadError('Failed to upload file.');
            setIsUploading(false);
        }
    };

    const getIconForType = (type) => {
        switch(type) {
            case 'pdf': return 'icon-file-text text-red-500';
            case 'pptx': 
            case 'ppt': return 'icon-presentation text-orange-500';
            default: return 'icon-file text-slate-500';
        }
    };

    return (
        <div className="max-w-5xl mx-auto" data-name="tab-ppt">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 font-serif">Course Materials</h2>
                    <p className="text-slate-300 text-lg">Access lectures, slides, and reference documents.</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setIsUploading(!isUploading)}
                        className="btn-primary"
                    >
                        <div className="icon-cloud-upload"></div> {isUploading && selectedFile ? 'Uploading...' : 'Upload New'}
                    </button>
                )}
            </div>

            {isAdmin && isUploading && (
                <div className="card mb-8 animate-fade-in border-emerald-500/30 bg-emerald-900/20 backdrop-blur-sm">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-emerald-100">
                        <div className="p-1 bg-emerald-500/20 rounded text-emerald-400"><div className="icon-upload text-sm"></div></div>
                        Upload Document
                    </h3>
                    <form onSubmit={handleUpload} className="space-y-5">
                        {uploadError && (
                             <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-3 rounded-lg text-sm flex items-center gap-2">
                                <div className="icon-circle-alert"></div>
                                {uploadError}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Document Title</label>
                            <input 
                                required
                                type="text" 
                                className="input-field" 
                                placeholder="e.g. Lecture 3: Wing Shapes"
                                value={newFile.title}
                                onChange={(e) => setNewFile({...newFile, title: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">File Type</label>
                                <select 
                                    className="input-field bg-black/40 text-slate-200"
                                    value={newFile.type}
                                    onChange={(e) => setNewFile({...newFile, type: e.target.value})}
                                >
                                    <option value="pdf">PDF Document</option>
                                    <option value="pptx">PowerPoint (PPTX)</option>
                                    <option value="ppt">PowerPoint (PPT)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    File Attachment <span className="text-xs font-normal text-slate-400">(Max 3MB)</span>
                                </label>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept=".pdf,.ppt,.pptx"
                                    onChange={handleFileSelect}
                                />
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-3 text-center transition-all flex flex-col items-center justify-center gap-2 min-h-[50px] cursor-pointer ${
                                        selectedFile 
                                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' 
                                        : 'border-emerald-500/30 bg-emerald-900/10 text-slate-400 hover:bg-emerald-900/20 hover:border-emerald-500'
                                    }`}
                                >
                                    {selectedFile ? (
                                        <>
                                            <div className="icon-circle-check text-xl"></div>
                                            <span className="font-medium truncate max-w-full px-2">{selectedFile.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="icon-folder-open text-xl opacity-50"></div>
                                            <span className="font-medium">Click to browse files</span>
                                            <span className="text-xs text-slate-500">Supports PDF, PPTX (Max 3MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isUploading && uploadProgress > 0 && (
                            <div className="w-full bg-black/40 rounded-full h-4 overflow-hidden border border-white/10 relative">
                                <div 
                                    className="bg-gradient-to-r from-emerald-600 to-lime-500 h-full transition-all duration-300 relative"
                                    style={{ width: `${uploadProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-black drop-shadow-md">
                                    {uploadProgress}%
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            {!isUploading && (
                                <button type="button" onClick={() => setIsUploading(false)} className="btn-secondary text-sm">Cancel</button>
                            )}
                            <button 
                                type="submit" 
                                className={`btn-primary text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Processing...' : 'Save & Upload'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10 text-slate-400">Loading materials...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {files.map(file => (
                        <div key={file._id} className="card flex items-center gap-5 hover:bg-emerald-950/40 transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500">
                            <div className={`w-14 h-14 rounded-2xl bg-black/30 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                                <div className={`${getIconForType(file.type)} text-2xl`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-100 truncate text-lg group-hover:text-emerald-400 transition-colors">{file.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 mb-2">
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-emerald-100 font-medium uppercase tracking-wide">{file.type}</span>
                                    <span>•</span>
                                    <span>{file.date}</span>
                                </div>
                                <div className="flex gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {file.url && (
                                        <>
                                            <a 
                                                href={file.url} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                                            >
                                                <div className="icon-eye text-sm"></div> Preview
                                            </a>
                                            <a 
                                                href={file.url} 
                                                download={file.title + '.' + file.type}
                                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                                            >
                                                <div className="icon-download text-sm"></div> Download
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                            {isAdmin && (
                                <button 
                                    onClick={() => handleDelete(file._id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                >
                                    <div className="icon-trash-2 text-sm"></div>
                                </button>
                            )}
                        </div>
                    ))}

                    {files.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-300 bg-black/20 rounded-3xl border border-dashed border-slate-600/50">
                            <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <div className="icon-folder-open text-4xl"></div>
                            </div>
                            <h3 className="text-lg font-medium text-slate-200">No materials yet</h3>
                            <p className="text-slate-400">Upload your first presentation to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}