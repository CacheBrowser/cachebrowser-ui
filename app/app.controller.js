import { remote } from 'electron'

export class ApplicationCtrl {
    constructor(processManager) {
        this.toggleDevTools = () => {
            remote.getCurrentWindow().toggleDevTools()
        }

        processManager.startProcess()
    }

}
