var Application = angular.module('cbgui', ['ngRoute', 'ui.bootstrap', 'chart.js'])

import * as _ from 'lodash'
import prettyBytes from 'pretty-bytes'
import { info } from 'loglevel'

import { Routes } from './app.routes'
import { COMPONENTS, SERVICES } from './app.config'

import { ApplicationCtrl } from './app.controller'


function bootstrapComponent(component) {
    var pageCtrl = component.PAGE_CONTROLLER
    var ctrls = component.CONTROLLERS

    Application.controller(pageCtrl.name, pageCtrl)
    _.each(ctrls, (ctrl) => {
        Application.controller(ctrl.name, ctrl)
    })
}

function bootstrapService(serviceOptions) {
    var serviceName = serviceOptions.SERVICE_NAME
    var service = serviceOptions.SERVICE
    Application.service(serviceName, service)
}

COMPONENTS.forEach(componentName => {
    // eslint-disable-next-line no-undef
    var component = require(componentName)

    info("Loading Component: " + componentName)
    bootstrapComponent(component)
})

SERVICES.forEach(serviceName => {
    // eslint-disable-next-line no-undef
    var service = require(serviceName)

    info("Loading Service: " + serviceName)
    bootstrapService(service)
})

Application.config($routeProvider => {
    Routes.forEach(route => {
        $routeProvider.when(route.path, {
            templateUrl: route.template,
            controller: route.controller
        })
    })
})

Application.config( () => {
    /* global Chart */
    Chart.defaults.global.showScale = false
    Chart.defaults.Line.pointDotRadius = 0
    Chart.defaults.global.responsive = false
    Chart.defaults.global.maintainAspectRatio = false
    Chart.defaults.global.showTooltips = false
})

Application.filter('prettyBytes', () => {
    return input => {
        if (isNaN(input)) {
            return input
        }
        return prettyBytes(input)
    }
})

Application.controller('ApplicationCtrl', ApplicationCtrl)
