import { shell } from 'electron'
import * as url from 'url'

export class HomeCtrl {
    constructor($scope, ipc, processManager, storage, $location, SupportedWebsitesAPI) {
      const self = this
      this.supportedWebsitesAPI = SupportedWebsitesAPI
      this.featuredWebsites = []

      this.ipc = ipc

      if (processManager.isRunning()) {
        $scope.cbStatus = 'running'
      } else {
        $scope.cbStatus = 'stopped'
      }

      storage.get('gettingStartedCompleted', val => {
        if (!val) {
          $location.path('/getting_started')
        }
      })

      $scope.$on('process/start', () => {
        $scope.cbStatus = 'running'
        $scope.$apply()
      })

      $scope.$on('process/stop', () => {
        $scope.cbStatus = 'stopped'
        $scope.$apply()
      })

      self.runningStatus = {
        _pick: function(running, stopped, dunno) {
          if ($scope.cbStatus == 'running') {
            return running
          } else if ($scope.cbStatus == 'stopped') {
            return stopped
          } else {
            return dunno
          }
        },
        color: function () {
          return this._pick('success', 'danger', 'warning')
        },
        invertedColor: function () {
          return this._pick('danger', 'success', 'warning')
        },
        message: function() {
          return this._pick('Running', 'Stopped', 'No Idea')
        },
        actionMessage: function () {
          return this._pick('Stop', 'Start', 'Start')
        }
      }


      self.toggleProcess = function() {
        if (!processManager.isRunning()) {
          processManager.startProcess()
        } else {
          processManager.stopProcess()
        }
      }


      this.loadFeaturedWebsites()
    }

    loadFeaturedWebsites() {
      const self = this
      this.supportedWebsitesAPI.getFeaturedWebsites()
        .then(results => {
          self.featuredWebsites = results
        })
    }

    openSite(site) {
      const self = this
      var hostname = url.parse(site.url).hostname
      this.ipc.request('/website/enable', {website: hostname})
        .then(() => {
          self.ipc.request('/browser/open', {url: site.url})
        }).catch(() => {
          shell.openExternal(site.url)
        })
    }
}
