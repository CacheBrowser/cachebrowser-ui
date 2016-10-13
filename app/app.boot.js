var Application = angular.module('cbgui', ['ngRoute', 'ui.bootstrap', 'chart.js', 'NgSwitchery', 'ui-rangeSlider'])

import prettyBytes from 'pretty-bytes'
import { info, debug } from 'loglevel'
import * as path from 'path'

import { Routes } from './app.routes'
import { COMPONENTS, SERVICES } from './app.config'

import { ApplicationCtrl } from './app.controller'


function bootstrapComponent(componentName, component) {
    var ctrls = component.CONTROLLERS || []
    var services = component.SERVICES || []
    var routes = component.ROUTES || []

    debug(ctrls)
    ctrls.forEach(ctrl => {
        debug(`Adding controller ${ctrl.name}`)
        Application.controller(ctrl.name, ctrl)
    })

    services.forEach(service => {
        debug(`Adding service ${service.name}`)
        let name = service.serviceName ? service.serviceName() : null
        name = name || service.name
        Application.service(name, service)
    })

    routes.forEach(route => {
        const templatePath = path.join(componentName, route.template)
        debug(`Adding route ${route.path} -> ${templatePath}`)
        Application.config($routeProvider => {
            $routeProvider.when(route.path, {
                templateUrl: templatePath,
                controller: route.controller,
                controllerAs: route.controllerAs
            })
        })
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
    bootstrapComponent(componentName, component)
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
