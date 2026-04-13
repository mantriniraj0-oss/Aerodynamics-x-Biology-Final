const STORAGE_KEYS = {
    INTRO: 'ab_intro_data',
    PPT: 'ab_ppt_data',
    SIM: 'ab_sim_data',
    REAL_LIFE: 'ab_real_life_data',
    TEAM: 'ab_team_data',
    AUTH: 'ab_auth_session'
};

// Expose keys globally
window.STORAGE_KEYS = STORAGE_KEYS;

const defaultData = {
    intro: {
        title: "The Design of Nature & Flight",
        content: "Nature has been the ultimate engineer for millions of years. From the silent flight of owls to the efficient swimming of sharks, biology offers masterclasses in aerodynamics and fluid dynamics. By studying these natural marvels, we unlock the secrets to more efficient, quieter, and faster human-made vehicles."
    },
    ppt: [
        { _id: '1', title: "Course Introduction", fileName: "lecture_01.pdf", type: "pdf", date: "2024-01-15" },
        { _id: '2', title: "Bird Wing Mechanics", fileName: "wing_mechanics.pptx", type: "pptx", date: "2024-01-20" }
    ],
    sim: [
        { _id: '1', title: "Airfoil Simulation", type: "iframe", url: "https://www.youtube.com/embed/5ltjznPbCbs", description: "Visualization of airflow over a cambered airfoil." }
    ],
    realLife: [
        { 
            _id: '1', 
            title: "The Kingfisher & The Bullet Train", 
            image: "https://images.unsplash.com/photo-1544600869-425ebdb45447?auto=format&fit=crop&q=80&w=800",
            content: "The Shinkansen bullet train's nose was redesigned to mimic the beak of a Kingfisher bird to reduce the sonic boom effect when exiting tunnels."
        },
        { 
            _id: '2', 
            title: "Shark Skin & Drag Reduction", 
            image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&q=80&w=800",
            content: "Shark skin is covered in tiny scales called dermal denticles that reduce drag and prevent biofouling. This texture has inspired swimsuits and ship hull coatings."
        }
    ],
    team: [
        { _id: '1', name: 'Prof. Pravin Patil', title: 'Project Guide', category: 'guide', image: 'https://drive.google.com/uc?export=view&id=1J9sBRdjs3UNEj8djy6b8vf71fQzrtv2h', linkedin: '#' },
        { _id: '2', name: 'Niraj Mantri', title: 'B.tech AI', category: 'developer', image: 'https://drive.google.com/uc?export=view&id=1CWtUT3snCLOl7okjoa1WzT_wPsiTLwgO', linkedin: '#' },
        { _id: '3', name: 'Mohil Gosar', title: 'B.tech AI', category: 'developer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', linkedin: '#' },
        { _id: '4', name: 'Shubham Belose', title: 'B.tech AI', category: 'developer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', linkedin: '#' },
        { _id: '5', name: 'Kevin Gajjar', title: 'B.tech AI', category: 'developer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', linkedin: '#' }
    ]
};

// Renamed to AppStorage to avoid conflict with window.Storage interface
const AppStorage = {
    get: (key, fallback) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.error("Storage Read Error", e);
            return fallback;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("Storage Write Error", e);
        }
    },
    // Helper to simulate DB-like operations
    getAll: (key) => {
        return AppStorage.get(key, []);
    },
    add: (key, item) => {
        const current = AppStorage.get(key, []);
        const newItem = { ...item, _id: Date.now().toString() };
        const updated = [newItem, ...current];
        AppStorage.set(key, updated);
        return newItem;
    },
    update: (key, id, data) => {
        const current = AppStorage.get(key, []);
        // Handle single object (Intro) vs array
        if (!Array.isArray(current)) {
            const updated = { ...current, ...data };
            AppStorage.set(key, updated);
            return updated;
        }
        const updated = current.map(item => item._id === id ? { ...item, ...data } : item);
        AppStorage.set(key, updated);
        return updated.find(i => i._id === id);
    },
    delete: (key, id) => {
        const current = AppStorage.get(key, []);
        if (Array.isArray(current)) {
            const updated = current.filter(item => item._id !== id);
            AppStorage.set(key, updated);
        }
        return true;
    },
    
    // Initialize defaults if empty
    init: () => {
        if (!localStorage.getItem(STORAGE_KEYS.INTRO)) AppStorage.set(STORAGE_KEYS.INTRO, defaultData.intro);
        if (!localStorage.getItem(STORAGE_KEYS.PPT)) AppStorage.set(STORAGE_KEYS.PPT, defaultData.ppt);
        if (!localStorage.getItem(STORAGE_KEYS.SIM)) AppStorage.set(STORAGE_KEYS.SIM, defaultData.sim);
        if (!localStorage.getItem(STORAGE_KEYS.REAL_LIFE)) AppStorage.set(STORAGE_KEYS.REAL_LIFE, defaultData.realLife);
        if (!localStorage.getItem(STORAGE_KEYS.TEAM)) AppStorage.set(STORAGE_KEYS.TEAM, defaultData.team);
    }
};

// Expose to window to ensure accessibility in other scripts
window.AppStorage = AppStorage;

// Run init immediately
AppStorage.init();