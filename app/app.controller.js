import { remote } from 'electron'

export function ApplicationCtrl($scope) {
    $scope.cbStatus = 'stopped'

    $scope.toggleDevTools = () => {
        remote.getCurrentWindow().toggleDevTools()
    }
}
