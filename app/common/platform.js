import * as path from 'path'

export const WINDOWS = "win32"
export const LINUX = "linux"
export const OSX = "darwin"

export function projectRoot() {
    if (process.platform == 'darwin' || process.platform == 'win32') {
        return path.join(__dirname, '../../..')
    }
}


export function isPlatform() {
    for (let i = 0; i < arguments.length; i++) {
        if (process.platform == arguments[i]) {
            return true;
        }
    }
    return false;
}

export function UnsupportedPlatform() {

}