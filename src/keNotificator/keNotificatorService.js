/**
 * Created by erez on 29/11/14.
 */
angular.module('voterApp')
    .constant('NOTIF_MESSAGES_PARAM', 'notifMessages')
    .service('keNotificatorService', function($q, $rootScope, $timeout, NOTIF_MESSAGES_PARAM){

        /**A message quque collection that hold all messages in the system*/
        var msgQueue = {};

        /**
         * A constructor of the message object that will be used to hold the message data model
         */
        var Message = function(id, scope, deferred, type, title, msg, timeout, onOk, onCancel, onNotify){
            if(!id)
                throw new Error('Message must contain id');
            this.id = id;
            this.deferred = deferred;
            this.scope = scope || $rootScope;
            this.timeout = timeout;
            switch(type){
                case 'error':
                    if(!title)
                        title = 'Error';
                    if(!msg)
                        msg = 'Error occur!';
                    break;
                case 'warn':
                    if(!title)
                        title = 'Warning';
                    if(!msg)
                        msg = 'Warning occur!';
                    break;
                case 'info':
                    if(!title)
                        title = 'Information';
                    break;
                case 'progress':
                    if(!title)
                        title = 'Progress';
                    if(!msg)
                        msg = 'In progress!';
                    break;
                default: //default is 'wait'
                    if(!title)
                        title = 'Waiting...';
                    type = 'wait';
                    //onCancel = defaultCancel;
            }
            this.type = type;
            this.title = title;
            this.msg = msg;
            this.onOk = onOk;
            this.onCancel = onCancel;
            this.onNotify = onNotify;
        };

        Message.prototype.defaultCancel = function(){
            if(this.onCancel)
                return onCancel();
            throw new Error('Notification, ' + this.id + ' was canceled');
        };

        Message.prototype.defaultOk = function(){
            if(this.onOk)
                return onOk();
            if(this.deferred){
                this.deferred.resolve(this.id);
            }
        };

        /**
         * When start, the message will save the message in the scope provided on construction with the message's id as the key
         */
        Message.prototype.start = function(){
            if(!this.scope[NOTIF_MESSAGES_PARAM]){
                this.scope[NOTIF_MESSAGES_PARAM] = {};
            }

            this.scope[NOTIF_MESSAGES_PARAM][this.id] = this;
            var self = this;
            if(this.timeout){
                $timeout(function(){
                    self.stop();
                    console.log('Timeout called');
                }, this.timeout, true);
            }
        };

        /**
         * When stop, the message is removed from the scope and from the msgQueue. If it is the last message on the scope
         *  then the messages object on the scope is also undefined
         */
        Message.prototype.stop = function(){
            if(this.scope[NOTIF_MESSAGES_PARAM]) {
                if (this.scope[NOTIF_MESSAGES_PARAM][this.id]) {
                    delete this.scope[NOTIF_MESSAGES_PARAM][this.id];
                }
                if(Object.keys(this.scope[NOTIF_MESSAGES_PARAM]).length <= 0){
                    this.scope[NOTIF_MESSAGES_PARAM] = undefined;
                }
            }
        };

        /**
         * This method start a global message which means it use the directive on the index.html and it
         *  use the $rootScope as the scope of use by default.
         *  You can put the directive under inner dom element and provide the dom element's scope or the rootscope if
         *  not provided.
         *
         * @param type - Can be 'error'/'warn'/'info'/'wait'/'progress'.
         *  if not defined then 'wait' is the default (known also as loading...).
         * @param title - The title of the notification message to show.
         * @param msg - The notification message body.
         * @param onOk - If included then we show OK button and invoke this method on OK.
         * @param onCancel - If included then we show the cancel button and invoke this method on cancel.
         * @return promise that is resolved with the message id or rejected with error.
         */
        this.startMessage = function(scope, type, title, msg, timeout, onOk, onCancel){
            var id = new Date();
            id = id.getTime();
            while(msgQueue[id]){
                id++;
            }
            msgQueue[id] = new Message(id, scope, deferred, type, title, msg, timeout, onOk, onCancel);
            msgQueue[id].start();
            return msgQueue[id];
        }

        /**
         * Call the startMessage method in async way and return a promise immediatly.
         * The message itself is returned when the promise is resolved.
         * @param scope
         * @param type
         * @param title
         * @param msg
         * @param timeout
         * @param onOk
         * @param onCancel
         * @return {*}
         */
        this.startMessageAsync = function(scope, type, title, msg, timeout, onOk, onCancel){
            var self = this;
            var deferred = $q.defer();
            $timeout(function(){
                var message = self.startMessage(scope, type, title, msg, timeout, onOk, onCancel);
                deferred.resolve(message);
            }, 1);
            return deferred.promise;
        }

        /**
         * This method is used for clean close of the message when the action specified by the message is done (for example
         *  the end of a waiting operation). Note that if you want to cancel the message and the operation you should use
         *  the Message's defaultCancel() function;
         * @param id
         */
        this.endMessage = function(id){
            if(msgQueue[id]){
                msgQueue[id].stop();
                msgQueue[id] = undefined;
                delete msgQueue[id];
            }
        }
    });