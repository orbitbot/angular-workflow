describe('HelloCtrl', function() {
  
  beforeEach(function() {
    module('angular-workflow');
  });

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('HelloCtrl', {
      $scope: scope
    });
  }));

  it('greets everyone', function() {
    expect(scope.name).to.equal('World');
  });

});