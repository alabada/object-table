'use strict';

/**
 * @Author 温枝达
 * @Email alabadazi@gmail.com
 * @Date 2017/2/23 20:01
 * @Description 自定义分页过滤器
 */
angular.module('qsTable').filter('offset', function () {

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