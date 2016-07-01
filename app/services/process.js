import { spawn } from 'child_process';
import EventEmitter from 'events';

class ProcessManager {
    constructor(ipc, $rootScope) {
        this.rootScope = $rootScope;
        this.ipc = ipc;
        this.running = false;

        this.ipc.ping().then(() => {
            if (!this.running) {
                this.running = true;
                this.emit('start');
            }
        });

        this.rootScope.$on('ipc/connect', () => {
            this.running = true;
            this.emit('start');
        });

        this.rootScope.$on('ipc/disconnect', () => {
            this.running = false;
            this.emit('stop');
        });
    }

    startProcess() {
        /**
         * Must be detached(?) and stdio ignored or redirected to file
         * to keep valid process after exiting GUI
         */
        this.process = spawn('cachebrowser', [], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']}
        );
        this.process.unref();

        this.running = true;

        this.process.on('error', err => {
            console.log(`Process Error ${err}`);
        });

        // TODO 'exit' for Windows
        this.process.on('close', (code, signal) => {
            console.log(`Process Closed ${code}`);
            this.running = false;

            this.process = null;
        });

        this.ipc.refreshDelay();
        setTimeout(()=>{this.ipc.ping()}, 1000);
    }

    stopProcess() {
        console.log("Killing");
        // // Dont know why this doesn't work
        // this.process.kill('SIGHUP');
        this.ipc.request('/close').then((message) => {
                console.log(message);
        });
    }

    isRunning() {
        return this.running;
    }

    emit(event) {
        var args = ['process/' + event];
        args = args.concat(Array.prototype.slice.call(arguments));
        this.rootScope.$broadcast.apply(this.rootScope, args);
    }
}

export var SERVICE_NAME = "processManager";
export var SERVICE = ProcessManager;
