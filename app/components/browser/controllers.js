import { installChromeExtension } from './chrome'
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