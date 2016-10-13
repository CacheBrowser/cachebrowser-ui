import { SettingsCtrl } from './controller'
import SettingsScramblerCtrl from './pages/scrambler'
import SettingsBootstrapperCtrl from './pages/bootstrapper'

export const CONTROLLERS = [
  SettingsCtrl,
  SettingsScramblerCtrl,
  SettingsBootstrapperCtrl
]

export const SERVICES = [
]

export const ROUTES = [
  { path: '/settings', controller: 'SettingsCtrl', controllerAs: '$$', template: 'view.html'}
]