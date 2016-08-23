import * as _ from 'lodash'

export function MonitorCtrl($scope, ipc) {
    $scope.logMap = {}

    $scope.context = {
        selectedLog: null,
        monitoring: true
    }

    var ipcHandler = ipc.subscribe('request-log', function (message) {
        if (!$scope.context.monitoring) {
            return
        }

        var fId = message.id
        var log = $scope.logMap[fId]
        var isNew = false
        if (log == undefined) {
            log = {id:fId}
            $scope.logMap[fId] = log
            isNew = true
        }

        _.extend(log, message)

        if (log.url && log.url.length > 40) {
            log.shortUrl = log.url.substr(0,40) + '...'
        } else {
            log.shortUrl = log.url
        }
        $scope.$broadcast('monitor-log', log, isNew)
    })
    $scope.$on('$destroy', ipcHandler)

    $scope.toggleMonitoring = function() {
        $scope.context.monitoring = !$scope.context.monitoring
        if ($scope.context.monitoring) {
            $scope.$broadcast("monitor-resume")
        } else {
            $scope.$broadcast("monitor-pause")
        }
    }

    $scope.refresh = function() {
        $scope.$broadcast("monitor-refresh")
        $scope.context.selectedLog = null
    }
}

export function MonitorLogCtrl($scope) {
    $scope.logs = []
    $scope.filteredLogs = $scope.logs

    $scope.currentPage = 0
    $scope.numPerPage = 6

    $scope.pageChanged = function() {
        if ($scope.currentPage == 1) {
            $scope.filteredLogs = $scope.logs
        } else {
            var begin = ((-$scope.currentPage) * $scope.numPerPage)
                , end = begin + $scope.numPerPage
            $scope.filteredLogs = $scope.logs.slice(begin, end)
        }
    }

    $scope.statusCodeColor = function(code) {
        if (code >= 200 && code < 300) {
            return 'success'
        } else if (code >= 300 && code < 400) {
            return 'warning'
        } else if (code >= 400 ) {
            return 'danger'
        }
    }

    $scope.$on("monitor-log", function(event, log, isNew) {
        if (isNew) {
            $scope.logs.push(log)
            $scope.$apply()
        }
    })

    $scope.$on("monitor-refresh", function() {
        $scope.logs = []
        $scope.filteredLogs = $scope.logs
        $scope.currentPage = 0
    })
}

export function MonitorChartCtrl($scope, $interval) {
    const ChartWidth = 50
    const ChartUpdateInterval = 1000

    var logs = []
    var logIdSet = new Set()
    var recording = true
    var lastLabel = ChartWidth

    $scope.chart = {
        data: [new Array(ChartWidth).fill(0), new Array(ChartWidth).fill(0)],
        labels: Array.from(Array(ChartWidth).keys()),
        options: {
           responsive: false,
           maintainAspectRatio: false,
           animationSteps: 15,
           tooltips: {
               enabled: false
           }
       },
       instance: null,
    }


    function buildChart() {
        if ($scope.chart.instance) {
            $scope.chart.instance.destroy()
        }

        var canvas = document.getElementById('monitor-chart')
        var ctx = canvas.getContext('2d')

        /* global Chart */
        var chart = new Chart(ctx).Line({
                labels: $scope.chart.labels,
                datasets: [
                    {
                        fillColor: "rgba(151,187,205,0.4)",
                        strokeColor: "rgba(151,187,205,0)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        data: $scope.chart.data[1]
                    },
                    {
                        fillColor: "rgba(205,121,121,0.4)",
                        strokeColor: "rgba(205,121,121,0)",
                        pointColor: "rgba(205,187,151,1)",
                        pointStrokeColor: "#fff",
                        data: $scope.chart.data[0]
                    }
                ]


        }, $scope.chart.options)
        $scope.chart.instance = chart
    }

    function UpdateChart() {
        if (!recording) {
            return
        }

        var normalTraffic = { upstream: 0, downstream: 0 }
        var cbTraffic = { upstream: 0, downstream: 0 }

        // Get Traffic Data
        _.each(logs, function(log) {
            if(log.cachebrowsed) {
                cbTraffic.upstream += log.request_size || 0
                cbTraffic.downstream += log.response_size || 0
            } else {
                normalTraffic.upstream += log.request_size || 0
                normalTraffic.downstream += log.response_size || 0
            }
        })

        // Reset Logs
        logs = []

        var normalValue = normalTraffic.downstream + normalTraffic.upstream
        var cbValue = cbTraffic.downstream + cbTraffic.upstream

        // Check if graph needs updating (we don't update if is all zeroes)
        var totalData = _.sumBy($scope.chart.instance.datasets[0].points, 'value') +
                        _.sumBy($scope.chart.instance.datasets[1].points, 'value') +
                        normalValue + cbValue

        if (totalData) {
            $scope.chart.instance.addData([normalValue, cbValue], ++lastLabel)
            $scope.chart.instance.removeData()
        }

    }

    $scope.$on('monitor-log', function(event, log) {
        if (!logIdSet.has(log.id) && log.response_size) {
            logs.push(log)
        }
    })

    $scope.$on('monitor-pause', function() {
        recording = false
    })

    $scope.$on('monitor-resume', function() {
        recording = true
    })

    $scope.$on('monitor-refresh', function() {
        buildChart()
    })

    var renderInterval = $interval(UpdateChart, ChartUpdateInterval)
    $scope.$on('$destroy', function() {
        $interval.cancel(renderInterval)
    })

    buildChart()
}
