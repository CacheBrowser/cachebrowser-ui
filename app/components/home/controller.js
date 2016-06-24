export function HomeCtrl($scope) {
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
    }
}
