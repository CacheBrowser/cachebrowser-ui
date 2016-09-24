import { info } from 'loglevel'
import { shell } from 'electron'

export function NewsCtrl($scope) {
    $scope.currentTab = "sup-web"

    $scope.isTab = (tab) => {return $scope.currentTab == tab}
    $scope.changeTab = (tab) => {$scope.currentTab = tab}

}

export function SupportedWebsitesCtrl($scope, storage, SupportedWebsitesAPI) {
    $scope.mediaUrl = SupportedWebsitesAPI.apiUrl
    $scope.state = {
        showFeatured: false
    }

    $scope.searchQuery = ''

    $scope.page = 0
    $scope.pageSize = 10

    $scope.sites = []
    $scope.featuredSites = []

    $scope.showHelp = false
    storage.get('supported-websites-show-help', result => {
        $scope.showHelp = result || false
    })

    $scope.hideHelp = function() {
        storage.set('supported-websites-show-help', true)
        $scope.showHelp = false
    }

    // $scope.getSupportedWebsite = function() {
    //     $http.get('https://admin.cachebrowser.net/')
    //         .then((resp) => {
    //
    //         });
    // }

    $scope.searchSites = function() {
        SupportedWebsitesAPI.searchSupportedWebsites($scope.searchQuery, $scope.page, $scope.pageSize)
          .then(sites => {
              $scope.sites = sites
          })
    }

    $scope.closeFeatured = function() {
        $scope.showFeatured = false
    }

    $scope.openSite = function(site) {
        info("opening site")
        shell.openExternal(site.url)
    }

    SupportedWebsitesAPI.getFeaturedWebsites()
      .then(sites => {
          $scope.featuredSites = sites
          info(sites)
      })

    $scope.searchSites()

    $scope.$watch('searchQuery', () => {
        $scope.searchSites()
    })
}