/* eslint-disable */
import {isPlatform, WINDOWS, OSX, LINUX} from '../platform'
import * as jetpack from 'fs-jetpack'
import { info, warn } from 'loglevel'
import * as path from 'path'
import * as _ from 'lodash'

const CHROME_EXTENSION_ID = "dimjobhopkpfnbojomeldpkmdekchboh"

export function installChromeExtension() {
    if (isPlatform(WINDOWS)) {
        return installOnWindows()
    } else {
        return installOnLinuxOrMac()
    }
}

function installOnLinuxOrMac() {
    const homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    const prefDir = isPlatform(OSX)
        ? path.join(homeDir, 'Library/Application Support/Google/Chrome/External Extensions/')
        : '/usr/share/google-chrome/extensions/'

    const prefPath = path.join(prefDir, `${CHROME_EXTENSION_ID}.json`)

    const preferences = {
        external_update_url: 'https://clients2.google.com/service/update2/crx'
    }

    return jetpack.writeAsync(prefPath, preferences, { jsonIndent: 4 })
        .then(() => {
            info(`Chrome plugin installed in ${prefPath}`)
            return jetpack.readAsync(prefPath, 'json')
        }).then(content => {
            if (!content) {
                throw "Saving extension configuration file failed"
            } else if (!_.isEqual(content, preferences)) {
                throw "Saving extension configuration file failed, validation failed"
            }
        })
}

function installOnWindows() {
    // TODO Implement
    throw "Windows chrome extension install not implemented"
}