
/* global localStorage */

class StorageService {
    constructor() {
    }

    set(key, value) {
        localStorage.setItem(key, value)
    }

    get(key, callback) {
        if (callback) {
            callback(localStorage.getItem(key))
        }
    }
}

export var SERVICE_NAME = "storage"
export var SERVICE = StorageService
