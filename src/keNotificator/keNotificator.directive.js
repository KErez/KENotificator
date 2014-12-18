'use strict';

angular.module('voterApp')
  .directive('keNotificator', function (keNotificatorService, NOTIF_MESSAGES_PARAM) {
        var sc = {};
        sc[NOTIF_MESSAGES_PARAM]= '=';
    return {
      templateUrl: function(){
          if(keNotificatorService.directiveHtml)
            return keNotificatorService.directiveHtml;
          return 'components/keNotificator/keNotificator.html';
      },
      restrict: 'EA',
        //Should it be isolated with two way binding with parent scope???
        // for example a loading message will ...???
        scope:sc,
      link: function (scope, element, attrs) {
      }
    };
  });