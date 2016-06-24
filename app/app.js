var Application = angular.module('cbgui', ['ngRoute', 'ui.bootstrap', 'chart.js']);

import * as _ from 'lodash';
import async from 'async';

import prettyBytes from 'pretty-bytes';

import { Routes } from './app.routes';
import { COMPONENTS } from './app.config';


function bootstrapComponent(component) {
    var pageCtrl = component.PAGE_CONTROLLER;
    var ctrls = component.CONTROLLERS;

    Application.controller(pageCtrl.name, pageCtrl);
    _.each(ctrls, (ctrl) => {
        Application.controller(ctrl.name, ctrl);
    });
}

_.each(COMPONENTS, (componentName) => {
    var component = require(componentName);
    console.log("Loading Component: " + componentName);
    bootstrapComponent(component);
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

Application.service('ipc', function() {
    var sock = new WebSocket("ws://127.0.0.1:9000");
    var self = this;

    self.sock = sock;
    self.listeners = [];

    sock.onopen = function () {
       console.log("connected");
    }
    sock.onclose = function (evt) {
       console.log("connection lost", evt.reason);
       sock = null;
    }
    sock.onmessage = function (evt) {
       var message = JSON.parse(evt.data);
       for (var i = 0; i < self.listeners.length; i++) {
           self.listeners[i](message.data);
       }
    }

    // TODO handle removing to avoid memory leaks
    this.subscribe = function(handler) {
        self.listeners.push(handler);
    }
});

Application.controller('MainCtrl', function($scope) {
    $scope.cbStatus = 'stopped';
});
