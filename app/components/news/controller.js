
export function NewsCtrl($scope) {
    $scope.currentTab = "sup-web"

    $scope.isTab = (tab) => {return $scope.currentTab == tab}
    $scope.changeTab = (tab) => {$scope.currentTab = tab}

}

export function SupportedWebsitesCtrl($scope, storage) {
    $scope.showHelp = false
    storage.get('supported-websites-show-help', result => {
        $scope.showHelp = result || false
    })

    $scope.hideHelp = function() {
        storage.set('supported-websites-show-help', true)
        $scope.showHelp = false
    }
}