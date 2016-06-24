import * as _ from 'lodash';

class IPCService {
    constructor($rootScope, $q) {
        this.rootScope = $rootScope;
        this.Q = $q;

        this.sock = new WebSocket("ws://127.0.0.1:9000");

        this.listeners = {};
        this.nextListenerId = 1;

        this.pendingRequests = {};
        this.nextRequestId = 1;

        this.sock.onopen = () => {
           console.log("connected");
        };

        this.sock.onclose = (evt) => {
            console.log("connection lost", evt.reason);
            this.sock = null;
        };

        this.sock.onmessage = (evt) => {
            var message = JSON.parse(evt.data);
            this.onmessage(message)
        };
    }

    onmessage(message) {
        var messageType = message.message_type;

        if (messageType == 'publish') {
            var data = message.data;
            var channel = message.channel;
            this.publish(channel, data);

        } else if (messageType == 'response') {
            this.onresponse(message);
        }
    }

    subscribe(channel, callback) {
        if (!this.listeners[channel]) {
            this.listeners[channel] = {};
        }

        var id = this.nextListenerId++;
        this._subscribe(channel, id, callback);

        var handler = () => {
            this._unsubscribe(channel, id);
        }

        return handler;
    }

    unsubscribe(handler) {
        handler();
    }

    _subscribe(channel, id, callback) {
        console.log("Subscribed to " + channel);
        this.listeners[channel][id] = callback;
        this.request('/subscribe', {
            channel: channel,
            subscribtion_id: id
        })
    }

    _unsubscribe(channel, id) {
        console.log("Unsubscribed from " + channel);
        delete this.listeners[channel][id];
        this.request('/unsubscribe', {
            channel: channel,
            subscribtion_id: id
        })
    }

    publish(channel, message) {
        _.each(this.listeners[channel], function(callback) {
            callback(message, channel);
        });
    }

    request(method, data) {
        var defered = this.Q.defer();

        var id = this.nextRequestId++;

        var message = {
            method: method,
            params: data,
            request_id: id
        };

        this.pendingRequests[id] = {
            message: message,
            promise: defered.promise
        }

        this.sock.send(JSON.stringify(message));

        return defered.promise;
    }

    onresponse(request, response) {
        var id = message.request_id;
        var response = message.response;

        var request = this.pendingRequests[id];
        delete this.pendingRequests[id];

        var promise = request.promise;

        promise.resolve(response);
    }
}

export var SERVICE_NAME = "ipc";
export var SERVICE = IPCService;
