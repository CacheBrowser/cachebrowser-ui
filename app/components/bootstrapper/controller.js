export function BootstrapperCtrl($scope, ipc) {
    $scope.hosts = []
    $scope.currentPage = 0
    $scope.numPerPage = 8

    $scope.subPage = 'host-list'

    function loadHosts() {
        var params = {
            page: $scope.currentPage,
            num_per_page: $scope.numPerPage
        }

        ipc.request('/hosts', params).then(function(response) {
            $scope.hosts = response
        })
    }
    $scope.$watch('currentPage', loadHosts)

    $scope.deleteHost = function(host) {
        ipc.request('/hosts/delete', {host: host.hostname}).then(loadHosts)
    }

    $scope.$on('bootstrapper-add-complete', function() {
        $scope.subPage = 'host-list'
        loadHosts()
    })

    // loadHosts()
}

export function BootstrapperAddHostCtrl($scope, ipc) {
    function clearForm() {
        $scope.form = {
            hostname: '',
            cdn: '',
            ssl: true
        }
    }

    $scope.submitForm = function() {
        ipc.request('/hosts/add', $scope.form).then(function() {
            $scope.$emit("bootstrapper-add-complete")
            clearForm()
        })
    }

    $scope.cancel = function() {
        clearForm()
        $scope.$emit("bootstrapper-add-complete")
    }

    clearForm()
}

export function BootstrapperAddCDNCtrl($scope, ipc) {
    function clearForm() {
        $scope.form = {
            id: '',
            name: '',
            edge_server: ''
        }
    }

    $scope.submitForm = function() {
        ipc.request('/cdns/add', $scope.form).then(function() {
            $scope.$emit("bootstrapper-add-complete")
            clearForm()
        })
    }

    $scope.cancel = function() {
        clearForm()
        $scope.$emit("bootstrapper-add-complete")
    }

    clearForm()
}
