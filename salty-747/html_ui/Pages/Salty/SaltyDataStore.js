Include.addScript("/JS/dataStorage.js");

class SaltyDataStore {
    static get listener() {
        if (this.mListener === undefined) {
            this.mListener = RegisterViewListener("JS_LISTENER_SIMVARS", null, true);
        }
        return this.mListener;
    }

    /**
     * Reads a value from persistent storage
     * @param key The property key
     * @param defaultVal The default value if the property is not set
     */
    static get(key, defaultVal) {
        const val = GetStoredData(`74S_${key}`);
        // GetStoredData returns null on error, or empty string for keys that don't exist (why isn't that an error??)
        // We could use SearchStoredData, but that spams the console with every key (somebody left their debug print in)
        if (val === null || val.length === 0) {
            return defaultVal;
        }
        return val;
    }

    /**
     * Sets a value in persistent storage
     *
     * @param key The property key
     * @param val The value to assign to the property
     */
    static set(key, val) {
        SetStoredData(`74S_${key}`, val);
        this.listener.triggerToAllSubscribers("74S_SALTYDATASTORE_UPDATE", key, val);
    }

    static subscribe(key, callback) {
        return Coherent.on("74S_SALTYDATASTORE_UPDATE", (updatedKey, value) => {
            if (key === "*" || key === updatedKey) {
                callback(updatedKey, value);
            }
        }).clear;
    }

    static getAndSubscribe(key, callback, defaultVal) {
        callback(key, SaltyDataStore.get(key, defaultVal));
        return SaltyDataStore.subscribe(key, callback);
    }
}
