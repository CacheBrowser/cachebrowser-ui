import { installChromeExtension } from './chrome'
import { installFirefoxExtension } from './firefox'
import { error } from 'loglevel'

export function ChromeCtrl ($scope) {
    $scope.state = 'none'

    $scope.install = () => {
        $scope.state = 'loading'

        installChromeExtension()
            .then(() => {
                $scope.state = 'install-success'
                $scope.$apply()
            }).catch((err) => {
                $scope.state = 'install-error'
                $scope.$apply()
                error(err)
            })
    }
}

export function FirefoxCtrl ($scope) {
    $scope.state = 'none'

    $scope.install = () => {
        $scope.state = 'downloading'

        let install = installFirefoxExtension()
        install.on('downloadComplete', () => {
            $scope.state = 'running-firefox'
            $scope.$apply()
        })
        install.on('firefoxOpened', () => {
            $scope.state = 'firefox-opened'
            $scope.$apply()

        })
        install.on('error', err => {
            $scope.state = 'install-error'
            $scope.$apply()
            error(err)
        })
    }
}