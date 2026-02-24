/**
 * Centralized logging utility to control console output verbosity.
 * Set VITE_DEBUG=true in .env to enable detailed logs.
 */

const isDebug = import.meta.env.VITE_DEBUG === 'true';

export const logger = {
    log: (...args) => {
        if (isDebug) console.log(...args);
    },
    warn: (...args) => {
        if (isDebug) console.warn(...args);
    },
    error: (...args) => {
        // We always log errors that reach this level, but we can make them 
        // less "scary" for the user by prefixing them.
        // If debug is on, we show the full error details.
        if (isDebug) {
            console.error(...args);
        } else {
            const firstArg = args[0];
            const message = typeof firstArg === 'string' ? firstArg : (firstArg?.message || 'An unexpected mystical error occurred');
            console.error(`[MysticError] ${message}`);
        }
    },
    info: (...args) => {
        if (isDebug) console.info(...args);
    },
    debug: (...args) => {
        if (isDebug) console.debug(...args);
    }
};
Kinder
