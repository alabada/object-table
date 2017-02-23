'use strict'

angular.module('qsTable', []).directive('contenteditable', function () {

  return {
    restrict: 'A',
    require: ['ngModel', '^qsTable'],
    link: function (scope, element, attrs, ctrls) {
      var ngModel = ctrls[0], qsTableCtrl = ctrls[1];
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };

      element.bind('change blur', function () {
        if (null != ngModel.$viewValue) {
          var oldValue = ngModel.$viewValue.toString();
        } else {
          var oldValue = '';
        }
        var newValue = element.text();
        if (oldValue !== newValue) {
          scope.$apply(function () {
            ngModel.$setViewValue(newValue);
          });
          if (!!qsTableCtrl.onEdit && typeof qsTableCtrl.onEdit === 'function')
            qsTableCtrl.onEdit({$oldValue: oldValue, $newValue: newValue});
        }
      })
    }
  }

});
