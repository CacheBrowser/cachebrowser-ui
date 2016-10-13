
/* global localStorage */

class StorageService {
    constructor() {
    }

    set(key, value) {
        if (typeof value == 'object') {
            value = '$@O@$' + JSON.stringify(value)
        } else if (typeof value == 'number') {
            value = '$@N@$' + JSON.stringify(value)
        }

        localStorage.setItem(key, value)
    }

    get(key, callback) {
        if (callback) {
            var value = localStorage.getItem(key)
            if (value && value.startsWith('$@O@$')) {
                value = JSON.parse(value.substr(5))
            } else if (value && value.startsWith('$@N@$')) {
                value = JSON.parse(value.substr(5))
            }
            callback(value)
        }
    }

    remove(key, callback) {
        localStorage.removeItem(key)
        if (callback) {
            callback()
        }
    }
}

export var SERVICE_NAME = "storage"
export var SERVICE = StorageService
