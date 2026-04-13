const DB_TABLES = {
    INTRO: 'aerobio_intro',
    PPT: 'aerobio_ppt',
    SIM: 'aerobio_sim',
    REAL_LIFE: 'aerobio_real_life',
    TEAM: 'aerobio_team'
};

// Map DB tables to LocalStorage keys for fallback
// Using string literals for keys to avoid ReferenceError if STORAGE_KEYS is not yet defined
const TABLE_TO_STORAGE = {
    'aerobio_intro': 'ab_intro_data',
    'aerobio_ppt': 'ab_ppt_data',
    'aerobio_sim': 'ab_sim_data',
    'aerobio_real_life': 'ab_real_life_data',
    'aerobio_team': 'ab_team_data'
};

const DB = {
    // Fetch all items from a table
    getAll: async (tableName) => {
        try {
            // Check if API exists
            if (typeof trickleListObjects !== 'function') {
                throw new Error('API_MISSING');
            }
            // Using a large limit to get all items for this demo
            const result = await trickleListObjects(tableName, 100, true);
            return result.items.map(item => ({
                ...item.objectData,
                _id: item.objectId // Keep internal ID for updates/deletes
            }));
        } catch (error) {
            // Detect network/fetch errors and log quietly to avoid alarming users
            const isNetworkError = error.message && (
                error.message.includes('Failed to fetch') || 
                error.message.includes('NetworkError') ||
                error.toString().includes('Failed to fetch')
            );

            if (isNetworkError) {
                console.info(`[DB] Offline/Fallback mode active for ${tableName}`);
            } else {
                console.warn(`DB Fetch Error (${tableName}) - Using Fallback:`, error.message || error);
            }
            
            const storageKey = TABLE_TO_STORAGE[tableName];
            if (storageKey && window.AppStorage) {
                // For Intro, getAll expects an array, but storage might have object
                const data = window.AppStorage.get(storageKey);
                if (tableName === DB_TABLES.INTRO && !Array.isArray(data)) {
                    // Wrap single intro object in array to mimic DB list
                    return [{ ...data, _id: 'local_intro' }];
                }
                return Array.isArray(data) ? data : [];
            }
            return [];
        }
    },

    // Add a new item
    add: async (tableName, data) => {
        try {
             if (typeof trickleCreateObject !== 'function') {
                throw new Error('API_MISSING');
            }
            const result = await trickleCreateObject(tableName, data);
            return {
                ...result.objectData,
                _id: result.objectId
            };
        } catch (error) {
            const isNetworkError = error.message && (
                error.message.includes('Failed to fetch') || 
                error.toString().includes('Failed to fetch')
            );
            
            if (!isNetworkError) {
                console.warn(`DB Add Error (${tableName}) - Using Fallback:`, error.message || error);
            }

            const storageKey = TABLE_TO_STORAGE[tableName];
            if (storageKey && window.AppStorage) {
                // For Intro, add means overwrite/set
                if (tableName === DB_TABLES.INTRO) {
                    window.AppStorage.set(storageKey, data);
                    return { ...data, _id: 'local_intro' };
                }
                return window.AppStorage.add(storageKey, data);
            }
            // Return a mock object if storage fails too, to prevent crash
            return { ...data, _id: 'temp_' + Date.now() };
        }
    },

    // Update an item
    update: async (tableName, id, data) => {
        try {
             if (typeof trickleUpdateObject !== 'function') {
                throw new Error('API_MISSING');
            }
            const result = await trickleUpdateObject(tableName, id, data);
            return {
                ...result.objectData,
                _id: result.objectId
            };
        } catch (error) {
            const isNetworkError = error.message && (
                error.message.includes('Failed to fetch') || 
                error.toString().includes('Failed to fetch')
            );

            if (!isNetworkError) {
                console.warn(`DB Update Error (${tableName}) - Using Fallback:`, error.message || error);
            }

            const storageKey = TABLE_TO_STORAGE[tableName];
            if (storageKey && window.AppStorage) {
                 if (tableName === DB_TABLES.INTRO) {
                    window.AppStorage.set(storageKey, data);
                    return { ...data, _id: 'local_intro' };
                }
                return window.AppStorage.update(storageKey, id, data);
            }
            return { ...data, _id: id };
        }
    },

    // Delete an item
    delete: async (tableName, id) => {
        try {
             if (typeof trickleDeleteObject !== 'function') {
                throw new Error('API_MISSING');
            }
            await trickleDeleteObject(tableName, id);
            return true;
        } catch (error) {
            const isNetworkError = error.message && (
                error.message.includes('Failed to fetch') || 
                error.toString().includes('Failed to fetch')
            );

            if (!isNetworkError) {
                console.warn(`DB Delete Error (${tableName}) - Using Fallback:`, error.message || error);
            }

            const storageKey = TABLE_TO_STORAGE[tableName];
            if (storageKey && window.AppStorage) {
                return window.AppStorage.delete(storageKey, id);
            }
            return false;
        }
    },
    
    // Seed default data if empty (helper for Intro)
    initIntro: async () => {
        // Fallback default
        const defaultIntro = {
            title: "The Design of Nature & Flight",
            content: "Nature has been the ultimate engineer for millions of years. From the silent flight of owls to the efficient swimming of sharks, biology offers masterclasses in aerodynamics and fluid dynamics. By studying these natural marvels, we unlock the secrets to more efficient, quieter, and faster human-made vehicles."
        };

        try {
            // First try to get existing
            const items = await DB.getAll(DB_TABLES.INTRO);
            if (items && items.length > 0) {
                // Validate item structure
                const item = items[0];
                if (!item || (!item.title && !item.content)) {
                    throw new Error("Invalid data structure");
                }
                return item;
            }

            // If empty, try to seed
            try {
                return await DB.add(DB_TABLES.INTRO, defaultIntro);
            } catch (addError) {
                 // Silent fallback
                 return { ...defaultIntro, _id: 'temp_fallback' };
            }
        } catch (e) {
            console.warn("initIntro failed completely, using default", e);
            return { ...defaultIntro, _id: 'temp_fallback' };
        }
    }
};

window.DB = DB;