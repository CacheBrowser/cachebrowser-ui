import { spawn } from 'child_process'
import { info, warn } from 'loglevel'

import env from '../env'
import * as path from 'path'
import * as platform from '../common/platform'

class ProcessManager {
    constructor(ipc, $rootScope) {
        this.rootScope = $rootScope
        this.ipc = ipc
        this.running = false

        this.ipc.ping().then(() => {
            if (!this.running) {
                this.running = true
                this.emit('start')
            }
        })

        this.rootScope.$on('ipc/connect', () => {
            this.running = true
            this.emit('start')
        })

        this.rootScope.$on('ipc/disconnect', () => {
            this.running = false
            this.emit('stop')
        })
    }

    startProcess() {
        /**
         * Must be detached(?) and stdio ignored or redirected to file
         * to keep valid process after exiting GUI
         */


        var cbpath = env.cachebrowserPath
        if (typeof(cbpath) == 'object') {
            cbpath = cbpath[process.platform]
        }

        cbpath = cbpath || 'cachebrowser'

        // If path is relative
        if (cbpath.startsWith('./') || cbpath.startsWith('../')) {
            cbpath = path.join(platform.projectRoot(), cbpath)
        }

        warn(cbpath)
        this.process = spawn(cbpath, [], {
            stdio: ['ignore', 'ignore', 'ignore'],
            detached: true
        })
        this.process.unref()

        this.running = true

        this.process.stderr.on('data', function(data) {
            info(data.toString())
        })

        this.process.on('error', err => {
            warn(`Process Error ${err}`)
        })

        // TODO 'exit' for Windows
        this.process.on('close', (code, signal) => {
            warn(`Process Closed ${code} ${signal}`)
            this.running = false

            this.process = null
        })

        this.ipc.refreshDelay()
        setTimeout(()=>{this.ipc.ping()}, 1000)
    }

    stopProcess() {
        info("Killing cachebrowser daemon")
        // // Dont know why this doesn't work
        // this.process.kill('SIGHUP')
        this.ipc.request('/close').then((message) => {
            info(message)
        })
    }

    isRunning() {
        return this.running
    }

    emit(event) {
        var args = ['process/' + event]
        args = args.concat(Array.prototype.slice.call(arguments))
        this.rootScope.$broadcast.apply(this.rootScope, args)
    }
}

export var SERVICE_NAME = "processManager"
export var SERVICE = ProcessManager
