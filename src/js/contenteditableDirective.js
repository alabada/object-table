'use strict'

/**
 * @Author 温枝达
 * @Email alabadazi@gmail.com
 * @Date 2017/2/23 19:59
 * @Description 表格cell编辑功能指令
 */
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
