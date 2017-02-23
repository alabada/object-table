'use strict';

angular.module('qsTable').filter('offset', function () {
  /**
   * 自定义过滤器，实现分页过滤
   */
  return function (input, curPage, itemsPerPage) {
    if (!input) {
      return;
    }
    curPage = parseInt(curPage, 10);
    itemsPerPage = parseInt(itemsPerPage, 10);
    var offset = (curPage - 1) * itemsPerPage;

    return input.slice(offset, offset + itemsPerPage);
  };
});