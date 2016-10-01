import { HomeCtrl } from './controller'

export const CONTROLLERS = [ HomeCtrl ]

export const ROUTES = [
  { path: '/', controller: 'HomeCtrl', controllerAs: '$$', template: 'view.html'}
]