import { spawn } from 'child_process'
import EventEmitter from 'events'
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


        var cbpath = env.cachebrowserPath;
        if (typeof(cbpath) == 'object') {
            cbpath = cbpath[process.platform]
        }

        cbpath = cbpath || 'cachebrowser'

        console.log(cbpath)

        // If path is relative
        if (path.resolve(cbpath) !== path.normalize(cbpath)) {
            cbpath = path.join(platform.projectRoot(), cbpath)
        }
        console.log(cbpath)
    
        this.process = spawn(cbpath, [], {
            stdio: ['ignore', 'ignore', 'ignore'],
            detached: true
        });
        this.process.unref()

        this.running = true

        this.process.stderr.on('data', function(data) {
            console.log(data.toString());
        })

        // this.process.on('error', err => {
        //     console.log(`Process Error ${err}`)
        // })

        // TODO 'exit' for Windows
        this.process.on('close', (code, signal) => {
            console.log(`Process Closed ${code}`)
            this.running = false

            this.process = null
        })

        this.ipc.refreshDelay();
        setTimeout(()=>{this.ipc.ping()}, 1000)
    }

    stopProcess() {
        console.log("Killing")
        // // Dont know why this doesn't work
        // this.process.kill('SIGHUP')
        this.ipc.request('/close').then((message) => {
                console.log(message)
        });
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
