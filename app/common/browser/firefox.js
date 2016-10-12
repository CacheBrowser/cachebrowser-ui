import {isPlatform, WINDOWS, OSX, LINUX} from '../../common/platform'
import * as jetpack from 'fs-jetpack'
import * as https from 'https'
import * as temp from 'temp'
import * as child_process from 'child_process'
import { EventEmitter } from 'events'

export function installFirefoxExtension() {
    const tmpPath = temp.path({suffix: '.xpi'})
    const eventEmitter = new EventEmitter()

    downloadAddOn(eventEmitter, tmpPath, () => {
        eventEmitter.emit('downloadComplete')
        if (isPlatform(WINDOWS)) {
            installOnWindows(eventEmitter, tmpPath)
        } else if (isPlatform(LINUX)) {
            installOnLinux(eventEmitter, tmpPath)
        } else if (isPlatform(OSX)) {
            installOnMac(eventEmitter, tmpPath)
        }
    })
    return eventEmitter
}

function downloadAddOn(eventEmitter, tmpPath, callback) {
    var file = jetpack.createWriteStream(tmpPath)
    https.get("https://cachebrowser.net/download/cachebrowser-firefox-latest.xpi", function(response) {
        response.pipe(file)
        response.on('end', () => {
            callback()
        })
    }).on('error', err => {
        eventEmitter.emit('error', `Downloading CacheBrowser Add-On failed: ${err}`)
    })
}

function installOnMac(eventEmitter, xpiFile) {
    const firefoxPath = '/Applications/Firefox.app'
    if (!jetpack.exists(firefoxPath)) {
        throw "Couldn't find Firefox installation"
    }
    let child = child_process.spawn('open', ['-a', '/Applications/Firefox.app', xpiFile])
    child.on('error', err => {
        eventEmitter.emit('error', err)
    })
    eventEmitter.emit('firefoxOpened')
}

function installOnLinux() {
    throw "Linux firefox extension install not implemented"
}

function installOnWindows() {
    // TODO Implement
    throw "Windows firefox extension install not implemented"
}