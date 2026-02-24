import { FORTUNE_POOL } from './fortunePool';

const RECENT_FORTUNES_KEY = 'fortune_recent_cache';
const MAX_CACHE_SIZE = 50;

class FallbackManager {
    constructor() {
        this.recentCache = this._loadCache();
    }

    _loadCache() {
        try {
            const saved = localStorage.getItem(RECENT_FORTUNES_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    _saveCache() {
        localStorage.setItem(RECENT_FORTUNES_KEY, JSON.stringify(this.recentCache));
    }

    getFallback(lang, type) {
        const pool = FORTUNE_POOL[lang] || FORTUNE_POOL.en;
        const category = type && pool[type] ? type : 'daily';
        const mainList = pool[category] || pool.daily;
        const ambiguityList = pool.ambiguity;

        // Layer 2: Category specific or general daily pool
        let available = mainList.filter(f => !this.recentCache.includes(f));

        // If we've used everything, clear a bit of cache or just pick a random one
        if (available.length === 0) {
            available = mainList;
            this.recentCache = this.recentCache.slice(-10); // Clear some cache
        }

        const selection = available[Math.floor(Math.random() * available.length)];
        this._updateCache(selection);
        return selection;
    }

    getAmbiguity(lang) {
        const pool = FORTUNE_POOL[lang] || FORTUNE_POOL.en;
        const list = pool.ambiguity;
        return list[Math.floor(Math.random() * list.length)];
    }

    _updateCache(fortune) {
        this.recentCache.push(fortune);
        if (this.recentCache.length > MAX_CACHE_SIZE) {
            this.recentCache.shift();
        }
        this._saveCache();
    }
}

export const fallbackManager = new FallbackManager();
