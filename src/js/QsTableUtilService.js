'use strict';

/**
 * @Author 温枝达
 * @Email alabadazi@gmail.com
 * @Date 2017/2/23 20:02
 * @Description 工具方法
 */
angular.module('qsTable').service('QsTableUtilService', [function () {
  // 扩展 Array [+swap]
  Array.prototype.swap = function (newIndex, oldIndex) {

    if (newIndex >= this.length) {
      var k = newIndex - this.length;
      while ((k--) + 1) {
        this.push(undefined);
      }
    }
    this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
    return this; // for testing purposes
  };

  return {
    // 切割字符串
    getArrayFromParams: function (string, attrName) {
      if (!string) {
        throw "Required '" + attrName + "' attribute is not found!";
      }
      var tempArray = [];
      var preArray = string.split(',');
      for (var i = 0, length = preArray.length; i < length; i++) {
        tempArray.push(preArray[i].trim());
      }
      return tempArray;
    }
  };

}]);