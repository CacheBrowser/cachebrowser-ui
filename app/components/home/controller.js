export function HomeCtrl($scope, processManager) {
    if (processManager.isRunning()) {
        $scope.cbStatus = 'running';
    } else {
        $scope.cbStatus = 'stopped';
    }

    $scope.$on('process/start', () => {
        $scope.cbStatus = 'running';
        $scope.$apply();
    });

    $scope.$on('process/stop', () => {
        $scope.cbStatus = 'stopped';
        $scope.$apply();
    });

    $scope.runningStatus = {
        _pick: function(running, stopped, dunno) {
            if ($scope.cbStatus == 'running') {
                return running;
            } else if ($scope.cbStatus == 'stopped') {
                return stopped;
            } else {
                return dunno;
            }
        },
        color: function () {
            return this._pick('success', 'danger', 'warning');
        },
        invertedColor: function () {
            return this._pick('danger', 'success', 'warning');
        },
        message: function() {
            return this._pick('Running', 'Stopped', 'No Idea');
        },
        actionMessage: function () {
            return this._pick('Stop', 'Start', 'Start');
        }
    };

    $scope.toggleProcess = function() {
        if (!processManager.isRunning()) {
            processManager.startProcess();
        } else {
            processManager.stopProcess();
        }
    };
}
