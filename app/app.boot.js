var Application = angular.module('cbgui', ['ngRoute', 'ui.bootstrap', 'chart.js']);

import * as _ from 'lodash';
import async from 'async';

import prettyBytes from 'pretty-bytes';

import { Routes } from './app.routes';
import { COMPONENTS, SERVICES } from './app.config';

import { ApplicationCtrl } from './app.controller';

function bootstrapComponent(component) {
    var pageCtrl = component.PAGE_CONTROLLER;
    var ctrls = component.CONTROLLERS;

    Application.controller(pageCtrl.name, pageCtrl);
    _.each(ctrls, (ctrl) => {
        Application.controller(ctrl.name, ctrl);
    });
}

function bootstrapService(service) {
    var serviceName = service.SERVICE_NAME;
    var service = service.SERVICE;
    Application.service(serviceName, service);
}

_.each(COMPONENTS, (componentName) => {
    var component = require(componentName);
    console.log("Loading Component: " + componentName);
    bootstrapComponent(component);
});

_.each(SERVICES, (serviceName) => {
    var service = require(serviceName);
    console.log("Loading Service: " + serviceName);
    bootstrapService(service);
});

Application.config(function($routeProvider) {
    _.each(Routes, function(route) {
        $routeProvider.when(route.path, {
            templateUrl: route.template,
            controller: route.controller
        })
    });
});

Application.config(function(ChartJsProvider) {
    Chart.defaults.global.showScale = false;
    Chart.defaults.Line.pointDotRadius = 0;
    Chart.defaults.global.responsive = false;
    Chart.defaults.global.maintainAspectRatio = false;
    Chart.defaults.global.showTooltips = false;
});

Application.filter('prettyBytes', function() {
    return function(input) {
        if (isNaN(input)) {
            return input;
        }
        return prettyBytes(input);
    };
});

Application.controller('ApplicationCtrl', ApplicationCtrl);
