'use strict';

describe('Directive: keNotificator', function () {

  // load the directive's module and view
  beforeEach(module('voterApp'));
  beforeEach(module('componenets/keNotificator/keNotificator.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ke-notificator></ke-notificator>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the keNotificator directive');
  }));

    it('Should do something', function(){
        expect(true).toBe(true);
    });
});