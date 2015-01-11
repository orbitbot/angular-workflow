(function() {
  'use strict';

  angular.module('angular-workflow', ['templates', 'ui.router']);

  angular.module('angular-workflow').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('hello', {
        url: '/',
        controller: 'HelloCtrl',
        templateUrl: 'hello/hello.html'
      });

    $urlRouterProvider
      .when('', '/')
      .otherwise('/');
  }]);
})();