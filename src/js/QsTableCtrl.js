'use strict'

/**
 * @Author 温枝达
 * @Email alabadazi@gmail.com
 * @Date 2017/2/23 20:00
 * @Description qsTable指令住控制器
 */
angular.module('qsTable').controller('QsTableCtrl', ['$scope', '$timeout', '$element', '$attrs', '$http', '$compile', '$controller', 'QsTableUtilService',
  function ($scope, $timeout, $element, $attrs, $http, $compile, $controller, Util) {

    $controller('QsTableSortingCtrl', {$scope: $scope});
    $controller('QsTableResizeCtrl', {$scope: $scope});
    var ctrl = this;
    var flag = true;

    var ctrlFlag = false;
    var shiftFlag = false;
    var lastSelectedItem;

    // ctrl:17  shift: 16
    document.addEventListener('keydown', function (event) {
      if (17 == event.keyCode) {
        ctrlFlag = true;
      } else if (16 == event.keyCode) {
        shiftFlag = true;
      }
    });

    document.addEventListener('keyup', function (event) {
      if (17 == event.keyCode) {
        ctrlFlag = false;
      } else if (16 == event.keyCode) {
        shiftFlag = false;
      }
    });

    // 初始化一些基本参数
    this._init = function () {
      $scope.headers = [];
      $scope.fields = [];
      $scope.itemsPerPage = $scope.itemsPerPage || 5;
      $scope.paging = angular.isDefined($scope.paging) ? $scope.paging : true;
      $scope.sortingType = $scope.sortingType || 'simple';
      $scope.currentPage = 1;
      $scope.customHeader = false;
      $scope.pageGroup = ["10", "20", "50"];

      // 查找
      if ($attrs.search == 'separate') {
        $scope.search = 'separate';
        $scope.columnSearch = [];
        /* ## after changing search model - clear currentPage ##*/
      } else {
        /* 'separate' or 'true' or 'false '*/
        $scope.search = typeof($attrs.search) !== 'undefined' && $attrs.search === 'true';
      }

      // 获取header数组
      $scope.headers = Util.getArrayFromParams($attrs.headers, 'headers');

      // 获取属性数组
      $scope.fields = Util.getArrayFromParams($attrs.fields, 'fields');

      // 通过远程路径名获取数据
      if (!!$attrs.fromUrl) {
        this._loadExternalData($attrs.fromUrl);
      }

      // 字段编辑
      if (!!$scope.onEdit) {
        this.onEdit = $scope.onEdit;
      }
      // 初始化存放被选中条目的模型(是否支持多选)
      $scope.selectedModel = [];

    };

    this.onEdit = $scope.onEdit;

    // 加载远程数据
    this._loadExternalData = function (url) {
      $scope.dataIsLoading = true;
      $http.get(url).then(function (response) {
        $scope.data = response.data;
        $scope.dataIsLoading = false;
      });
    };

    /* drag n drop [START]*/

    // 因拖拽改变列顺序
    this.changeColumnsOrder = function (newIndex, oldIndex) {
      var newHeaderIndex = newIndex;
      var oldHeaderIndex = oldIndex;
      var newFieldIndex = newIndex;
      var oldFieldIndex = oldIndex;
      if ($scope.select === 'multiply') {
        if (!$scope.findHead && !$scope.findBody) {
          newHeaderIndex -= 1;
          oldHeaderIndex -= 1;
          newFieldIndex -= 1;
          oldFieldIndex -= 1;
        } else if ($scope.findHead && !$scope.findBody) {
          //newHeaderIndex -= 1;
          //oldHeaderIndex -= 1;
          newFieldIndex -= 1;
          oldFieldIndex -= 1;
        } else if (!$scope.findHead && $scope.findBody) {
          newHeaderIndex -= 1;
          oldHeaderIndex -= 1;
          //newFieldIndex -= 1;
          //oldFieldIndex -= 1;
        } else if ($scope.findHead && $scope.findBody) {
          //newHeaderIndex -= 1;
          //oldHeaderIndex -= 1;
          //newFieldIndex -= 1;
          //oldFieldIndex -= 1;
        }
      }

      $scope.$apply(function () {
        $scope.fields.swap(newFieldIndex, oldFieldIndex);
        var headersBackup = $scope.headers.slice();
        $scope.headers.swap(newHeaderIndex, oldHeaderIndex);
        if (!!$scope.onDrag && typeof $scope.onDrag === 'function') {
          $scope.onDrag({$oldOrder: headersBackup, $newOrder: $scope.headers});
        }
        headersBackup = null;
        if (!!$scope.columnSearch) {
          $scope.columnSearch.swap(newHeaderIndex, oldHeaderIndex);
        }
        if (!!ctrl.bodyTemplate) {
          var tds = angular.element(ctrl.bodyTemplate).children(),
            html = '',
            tr = document.createElement('tr'),
            tbody = document.createElement('tbody'),
            attributes = $element.find('tbody').find('tr')[0].attributes;

          [].forEach.call(attributes, function (attr, index) {
            tr.setAttribute(attr.name, attr.value);
          });

          if ($scope.select === 'multiply' && true === flag) {
            flag = false;
            var td = document.createElement('td');
            var input = document.createElement('input');
            input.setAttribute("type", "checkbox");
            input.setAttribute("ng-checked", "isSelected(item)");

            angular.element(td).append(input);
            tr.appendChild(td);
            Array.prototype.swap.apply(tds, [newFieldIndex - 1, oldFieldIndex - 1]);
          } else {
            Array.prototype.swap.apply(tds, [newFieldIndex, oldFieldIndex]);
          }

          for (var i = 0, length = tds.length; i < length; i++) {
            tr.appendChild(tds[i]);
          }

          tbody.appendChild(tr);

          $element.find('tbody').replaceWith(tbody);
          ctrl.bodyTemplate = tbody.innerHTML;
          $compile($element.find('tbody'))($scope);
        }
        if ($scope.customHeader) {
          var ths = $element.find('th'),
            tr = document.createElement('tr'),
            thead = document.createElement('thead');

          Array.prototype.swap.apply(ths, [newHeaderIndex, oldHeaderIndex]);

          for (var i = 0, length = ths.length; i < length; i++) {
            tr.appendChild(ths[i]);
          }

          thead.appendChild(tr);
          $element.find('thead').replaceWith(thead);
        }

        $scope.jumpToPage(1);
      });
    };

    /* drag n drop [END]*/

    /* table add [START]*/

    /**
     * 自定义header添加
     * @param node
     * @private
     */
    this._addHeaderPattern = function (node) {
      $scope.customHeader = true;
      // add Index to drag
      Array.prototype.forEach.call(node.querySelectorAll('[allow-drag]'), function (th, index) {
        th.setAttribute('index', index);
      });
      node.removeAttribute('ng-non-bindable');
      $element.find('table').prepend(node);

      if ($scope.select === 'multiply') {
        if (typeof $element.find('thead').children()[0] != 'undefined') {
          var customTh = "<th><i class='fa' ng-class=\"{'fa-square-o':'unchecked'==isCheckedModel, 'fa-check-square-o':'checked'==isCheckedModel,  'fa-minus-square-o':'indeterminate'==isCheckedModel}\"  ng-click='clickThead()'></i></th>"
          angular.element($element.find('thead').children()[0]).prepend(customTh);
        }
        if (typeof $element.find('thead').children()[1] != 'undefined') {
          angular.element($element.find('thead').children()[1]).prepend("<th></th>");
        }
        $compile($element.find('table'))($scope);
      }
    };

    /**
     * 自定义footer添加
     * @param node
     * @private
     */
    this._addFooterPattern = function (node) {
      $element.find('table').prepend(node);
    };

    /**
     * 自定义行添加
     * @param node
     * @param rowFilter
     * @param paggingFilter
     * @private
     */
    this._addRowPattern = function (node, rowFilter, paggingFilter) {
      this._checkEditableContent(node);

      this._addRepeatToRow(node, rowFilter, paggingFilter);
      node.removeAttribute('ng-non-bindable');

      $element.find('table').append(node.outerHTML);
      this.bodyTemplate = node.innerHTML;

      if ($scope.select === 'multiply') {
        var customTd = "<td><i class='fa' ng-click='setMulSelected(item, $index, $event)' ng-class=\"{'fa-square-o':'unchecked'==item.isCheckedModel,'fa-square-o ':undefined==item.isCheckedModel, 'fa-check-square-o':'checked'==item.isCheckedModel,  'fa-minus-square-o':'indeterminate'==item.isCheckedModel}\"></i></td>";
        // angular.element($element.find('table tbody tr')[0]).prepend(customTr);
        angular.element($element.find('tbody').children()[0]).prepend(customTd);
      }

      //编译 TBODY
      $compile($element.find('tbody'))($scope);
    };

    this._checkEditableContent = function (node) {
      var innerModel, findModelRegex = /\{\{:*:*(.*?)\}\}/g;
      Array.prototype.forEach.call(node.querySelectorAll('[editable]'), function (td) {
        innerModel = td.innerHTML.replace(findModelRegex, '$1');
        td.innerHTML = '<div contentEditable ng-model=\'' + innerModel + '\'>{{' + innerModel + '}}</div>';
      });
    };

    this._addRepeatToRow = function (node, rowFilter, paggingFilter) {
      var trs = angular.element(node).find('tr');
      var trStart = angular.element(trs[0]);
      if (1 == trs.length) {
        trStart.attr('ng-repeat', 'item in $filtered = (data' + rowFilter + ')' + paggingFilter);
        if (!trStart.attr('ng-click')) {
          trStart.attr('ng-click', 'setSelected(item, $index)');
        }
        trStart.attr('ng-class', '{\'selected-row\':isSelected(item)}');
        // trStart.attr('on-finish-render', '');
      } else { // 嵌套子表格
        var trEnd = angular.element(trs[1]);

        trStart.attr('ng-repeat-start', 'item in $filtered = (data' + rowFilter + ')' + paggingFilter);
        if (!trStart.attr('ng-click')) {
          trStart.attr('ng-click', 'setSelected(item, $index)');
        }
        trStart.attr('ng-class', '{\'selected-row\':isSelected(item)}');
        // trStart.attr('on-finish-render', '');

        trEnd.attr('ng-repeat-end', ''); // 子表格增加
      }

    };

    // 监听列表数据渲染完成
    $scope.$on('ngRepeatFinished', function () {

    });

    /* table add [end]*/

    /* select [START]*/
    /**
     * 所有复选框model值
     * 可选值：checked unchecked indeterminate
     * @type {string}
     */
    $scope.isCheckedModel = "unchecked";

    /**
     * 绑定前端界面的单击thead
     */
    $scope.clickThead = function () {
      if ("checked" == $scope.isCheckedModel) {
        $scope.isCheckedModel = "unchecked";
      } else if ("unchecked" == $scope.isCheckedModel) {
        $scope.isCheckedModel = "checked";
      } else if ("indeterminate" == $scope.isCheckedModel) {
        $scope.isCheckedModel = "checked";
      }
      ctrl.toggleSelectAllFunc();

      if ("true" == $scope.parentTable) {
        $scope.$broadcast('parentTableAllSelected', $scope.isCheckedModel);
      }
      if ("true" == $scope.childTable) {
        var parentRowIndex = $element.find('table').parent().parent().parent().parent()[0].rowIndex;
        $scope.$emit('childTableAllSelected', parentRowIndex, $scope.isCheckedModel);
      }
    }

    /**
     *  切换全选操作
     */
    this.toggleSelectAllFunc = function () {
      if ("checked" == $scope.isCheckedModel) {
        $scope.selectedModel = [];
        angular.forEach($scope.$filtered, function (item) {
          item.isCheckedModel = "checked";
          $scope.selectedModel.push(item);
        });
      } else {
        $scope.selectedModel = [];
        angular.forEach($scope.$filtered, function (item) {
          item.isCheckedModel = "unchecked";
        });
      }

      if (angular.isFunction($scope.setSelect)) { // 执行业务层回调方法
        $timeout(function () {
          $scope.setSelect();
        })
      }
    }

    /**
     * 绑定前端界面的单击checkbox
     * @param item
     */
    $scope.setMulSelected = function (item, rowIndex, e) {

      e.preventDefault();
      e.stopPropagation();

      if (!ctrl._containsInSelectArray(item)) {
        $scope.selectedModel.push(item);
      } else {
        $scope.selectedModel.splice($scope.selectedModel.indexOf(item), 1);
      }

      ctrl.clickTr(item, rowIndex);

      if (angular.isFunction($scope.setSelect)) { // 执行业务层回调方法
        $timeout(function () {
          $scope.setSelect();
        })
      }
    };

    /**
     * 绑定前端界面的单击单行
     * @param item
     */
    $scope.setSelected = function (item, rowIndex) {

      if (true == ctrlFlag) { // ctrl按键按下
        if (!ctrl._containsInSelectArray(item)) {
          $scope.selectedModel.push(item);
        } else {
          $scope.selectedModel.splice($scope.selectedModel.indexOf(item), 1);
        }

        ctrl.clickTr(item, rowIndex);
        lastSelectedItem = item;
      } else if (true == shiftFlag) { // shift按键按下

        var lastSelectedItemIndex = ctrl._indexInFiltered(lastSelectedItem);
        var itemIndex = ctrl._indexInFiltered(item);

        if (-1 == lastSelectedItemIndex || -1 == itemIndex) {
          $scope.selectedModel = [];
          angular.forEach($scope.$filtered, function (item) {
            item.isCheckedModel = "unchecked";
          });
          $scope.selectedModel.push(item);

          ctrl.clickTr(item, rowIndex);
          lastSelectedItem = item;
        } else {
          var start, end;
          if (lastSelectedItemIndex < itemIndex) {
            start = lastSelectedItemIndex;
            end = itemIndex;
          } else {
            start = itemIndex;
            end = lastSelectedItemIndex;
          }

          $scope.selectedModel = [];
          for (var i = 0; i < $scope.$filtered.length; i++) {
            $scope.$filtered[i].isCheckedModel = "unchecked";
          }
          for (var j = start; j <= end; j++) { // 选中两次shift之间的条目
            var item = $scope.$filtered[j];
            item.isCheckedModel = "checked";
            $scope.selectedModel.push(item);
          }
        }
      } else { // 正常单击
        $scope.selectedModel = [];
        angular.forEach($scope.$filtered, function (item) {
          item.isCheckedModel = "unchecked";
        });
        $scope.selectedModel.push(item);

        ctrl.clickTr(item, rowIndex);
        lastSelectedItem = item;
      }

      if (angular.isFunction($scope.setSelect)) { // 执行业务层回调方法
        $timeout(function () {
          $scope.setSelect();
        })
      }
    };

    this._indexInFiltered = function (obj) {
      for (var i = 0; i < $scope.$filtered.length; i++) {
        var item = $scope.$filtered[i];
        if (typeof item !== 'undefined' && typeof obj !== 'undefined') {
          if (item.$$hashKey === obj.$$hashKey) {
            return i;
          }
        }
      }
      return -1;
    };

    /**
     * 检查是否已被选中
     * @param obj
     * @returns {boolean}
     * @private
     */
    this._containsInSelectArray = function (obj) {
      if ($scope.selectedModel.length) {
        return $scope.selectedModel.filter(function (listItem) {
            if (typeof listItem !== 'undefined' && typeof obj !== 'undefined') {
              return listItem.$$hashKey == obj.$$hashKey;
            }
          }).length > 0;
      }
    };

    this.clickTr = function (item, rowIndex) {
      if ("checked" == item.isCheckedModel) {
        item.isCheckedModel = "unchecked";
      } else if ("unchecked" == item.isCheckedModel) {
        item.isCheckedModel = "checked";
      } else if ("indeterminate" == item.isCheckedModel) {
        item.isCheckedModel = "checked";
      } else if (undefined == item.isCheckedModel) {
        item.isCheckedModel = "checked";
      }

      if (true == ctrl.isAllSelected()) {
        $scope.isCheckedModel = "checked";
      } else if ($scope.selectedModel.length > 0 && $scope.selectedModel.length < $scope.$filtered.length) {
        $scope.isCheckedModel = "indeterminate";
      } else {
        $scope.isCheckedModel = "unchecked";
      }

      if ("true" == $scope.parentTable) {
        $scope.$broadcast('parentTableRowSelected', rowIndex, item.isCheckedModel);
      }
      if ("true" == $scope.childTable) {
        var parentRowIndex = $element.find('table').parent().parent().parent().parent()[0].rowIndex;
        $scope.$emit('childTableRowSelected', parentRowIndex, $scope.isCheckedModel);
      }
    }

    /**
     *  是否被全部选中
     * @returns {boolean}
     */
    this.isAllSelected = function () {
      return $scope.selectedModel.length === $scope.$filtered.length;
    };

    /**
     * 单行是否被选中
     * @param item
     * @returns {boolean}
     */
    $scope.isSelected = function (item) {
      if (!!$scope.selectedModel) {
        return ctrl._containsInSelectArray(item);
      }
      return false;
    };

    // 监听父表格选中行事件
    $scope.$on('parentTableRowSelected', function (event, rowIndex, selectedValue) {
      if ("true" == $scope.childTable) {
        if ((rowIndex + 1) * 2 == $element.find('table').parent().parent().parent().parent()[0].rowIndex) {

          if ('checked' == selectedValue) {
            $scope.isCheckedModel = "checked";
          } else {
            $scope.isCheckedModel = "unchecked";
          }
          ctrl.toggleSelectAllFunc();
        }
      }
    });

    // 监听父表格选中所有事件
    $scope.$on('parentTableAllSelected', function (event, selectedValue) {
      if ("true" == $scope.childTable) {
        var trLen = $element.find('table').parent().parent().parent().parent().parent().children().length;
        for (var i = 0; i < trLen; i++) {
          $scope.$broadcast('parentTableRowSelected', i, selectedValue);
        }
      }
    });

    this.setParentRowStatus = function (item, selectedValue) {
      if ("checked" == selectedValue) {
        item.isCheckedModel = "checked";

        if (!ctrl._containsInSelectArray(item)) {
          $scope.selectedModel.push(item);
        } else {
          // $scope.selectedModel.splice($scope.selectedModel.indexOf(item), 1);
        }
      } else if ("unchecked" == selectedValue) {
        item.isCheckedModel = "unchecked";

        if (!ctrl._containsInSelectArray(item)) {
          // $scope.selectedModel.push(item);
        } else {
          $scope.selectedModel.splice($scope.selectedModel.indexOf(item), 1);
        }
      } else if ("indeterminate" == selectedValue) {
        item.isCheckedModel = "indeterminate";
        if (!ctrl._containsInSelectArray(item)) {
          // $scope.selectedModel.push(item);
        } else {
          $scope.selectedModel.splice($scope.selectedModel.indexOf(item), 1);
        }
      }

      if (true == ctrl.isAllSelected()) {
        $scope.isCheckedModel = "checked";
      } else if ($scope.selectedModel.length > 0 && $scope.selectedModel.length < $scope.$filtered.length) {
        $scope.isCheckedModel = "indeterminate";
      } else {
        $scope.isCheckedModel = "unchecked";
      }

      if (angular.isFunction($scope.setSelect)) { // 执行业务层回调方法
        $timeout(function () {
          $scope.setSelect();
        })
      }

    };

    // 监听子表格选中行事件
    $scope.$on('childTableRowSelected', function (event, parentRowIndex, selectedValue) {
      if ("true" == $scope.parentTable) {
        ctrl.setParentRowStatus($scope.$filtered[parentRowIndex / 2 - 1], selectedValue);
      }
    });

    // 监听子表格选中所有事件
    $scope.$on('childTableAllSelected', function (event, parentRowIndex, selectedValue) {
      if ("true" == $scope.parentTable) {
        $scope.setSelected($scope.$filtered[parentRowIndex / 2 - 1], parentRowIndex / 2 - 1);
      }
    });
    /* select [END]*/

    /* paging [START]*/

    $scope.curPage = 1;
    $scope.jumpToPage = function (curPage) {
      if (typeof curPage == "undefined") {
        swal.swal('请输入合适页码!');
        return;
      }
      $scope.currentPage = curPage;
      if (angular.isFunction($scope.reload)) { // 执行业务层重新加载数据方法
        $timeout(function () {
          $scope.reload();
        })
      }
    }

    // 监听页码变化
    $scope.pageChanged = function () {
      if (angular.isFunction($scope.reload)) { // 执行业务层重新加载数据方法
        $timeout(function () {
          $scope.reload();
        })
      }
    }

    // 监听每页显示数量变化
    $scope.itemsPerPageChanged = function () {
      if (angular.isFunction($scope.reload)) { // 执行业务层重新加载数据方法
        $timeout(function () {
          $scope.reload();
        })
      }
    }

    /* paging [END]*/


    /* 右键菜单 [END]*/

    $scope.menuOptions =[
      ['编辑', function ($itemScope) {
        console.log($itemScope.item);
      }],
      null,
      ['删除', function ($itemScope) {
        console.log($itemScope.item);
      }],
      null,
      ['查看', function ($itemScope) {
        console.log($itemScope.item);
      }]
    ]

    /* 右键菜单 [END]*/



  }]);
