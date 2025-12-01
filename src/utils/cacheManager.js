/**
 * Gestionnaire de cache pour optimiser les appels API
 * Stockage en mémoire avec expiration automatique
 */

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes par défaut
    }

    /**
     * Générer une clé de cache à partir d'une URL et des paramètres
     */
    generateKey(url, params = {}) {
        const paramStr = Object.keys(params)
            .sort()
            .map(key => `${key}=${JSON.stringify(params[key])}`)
            .join('&');
        return paramStr ? `${url}?${paramStr}` : url;
    }

    /**
     * Récupérer une valeur du cache
     */
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        // Vérifier si le cache a expiré
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }

    /**
     * Stocker une valeur dans le cache
     */
    set(key, data, ttl = this.defaultTTL) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl,
            timestamp: Date.now()
        });
    }

    /**
     * Supprimer une entrée du cache
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * Invalider toutes les entrées qui correspondent à un pattern
     */
    invalidatePattern(pattern) {
        const regex = new RegExp(pattern);
        const keysToDelete = [];
        
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
        return keysToDelete.length;
    }

    /**
     * Vider complètement le cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Obtenir la taille du cache
     */
    size() {
        return this.cache.size;
    }

    /**
     * Nettoyer les entrées expirées
     */
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
        return keysToDelete.length;
    }
}

// Instance singleton
const cacheManager = new CacheManager();

// Nettoyer le cache toutes les 5 minutes
setInterval(() => {
    const cleaned = cacheManager.cleanup();
    if (cleaned > 0) {
        console.log(`[Cache] Nettoyé ${cleaned} entrées expirées`);
    }
}, 5 * 60 * 1000);

export default cacheManager;

