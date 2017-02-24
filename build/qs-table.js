/**
 * qs-table - angular smart table directive
 * @version v0.2.2
 * @author Yauheni Kokatau
 * @license MIT
 */
"use strict";angular.module("qsTable",[]).directive("contenteditable",function(){return{restrict:"A",require:["ngModel","^qsTable"],link:function(e,t,n,r){var a=r[0],i=r[1];a.$render=function(){t.html(a.$viewValue||"")},t.bind("change blur",function(){if(null!=a.$viewValue)var n=a.$viewValue.toString();else var n="";var r=t.text();n!==r&&(e.$apply(function(){a.$setViewValue(r)}),i.onEdit&&"function"==typeof i.onEdit&&i.onEdit({$oldValue:n,$newValue:r}))})}}}),angular.module("qsTable").directive("allowDrag",function(){return{restrict:"A",controller:function(){},compile:function(e,t){function n(e,t){var n=e[0].parentNode.querySelector("."+t);n&&n.classList.remove(t)}return function(e,t,r,a){t.attr("draggable",!0),t.bind("dragstart",function(e){a.target=this,this.classList.add("dragged");var t=e.originalEvent||e;t.dataTransfer.setData("text",a.target.cellIndex)}),t.bind("dragend",function(e){this.classList.contains("dragged")&&this.classList.remove("dragged"),e.preventDefault()}),t.bind("dragover",function(e){e.preventDefault()}),t.bind("dragenter",function(e){a.toTarget=this,this.classList.contains("draggedOver")||this.classList.contains("dragged")||this.classList.add("draggedOver"),e.preventDefault(),e.stopPropagation()}),t.bind("dragleave",function(e){this.classList.remove("draggedOver")}),t.bind("drop",function(e){var r=a.toTarget.cellIndex,i=e.originalEvent||e,d=parseInt(i.dataTransfer.getData("text"),10);n(t,"dragged"),n(t,"draggedOver"),t.parent().controller("qsTable").changeColumnsOrder(r,d),e.preventDefault()})}}}}),angular.module("qsTable").controller("QsTableCtrl",["$scope","$timeout","$element","$attrs","$http","$compile","$controller","QsTableUtilService",function(e,t,n,r,a,i,d,l){d("QsTableSortingCtrl",{$scope:e}),d("QsTableResizeCtrl",{$scope:e});var o=this,c=!0;this._init=function(){e.headers=[],e.fields=[],e.itemsPerPage=e.itemsPerPage||5,e.paging=!angular.isDefined(e.paging)||e.paging,e.sortingType=e.sortingType||"simple",e.currentPage=1,e.customHeader=!1,e.pageGroup=["10","20","50"],"separate"==r.search?(e.search="separate",e.columnSearch=[]):e.search="undefined"!=typeof r.search&&"true"===r.search,e.headers=l.getArrayFromParams(r.headers,"headers"),e.fields=l.getArrayFromParams(r.fields,"fields"),r.fromUrl&&this._loadExternalData(r.fromUrl),e.onEdit&&(this.onEdit=e.onEdit),e.selectedModel=[]},this.onEdit=e.onEdit,this._loadExternalData=function(t){e.dataIsLoading=!0,a.get(t).then(function(t){e.data=t.data,e.dataIsLoading=!1})},this.changeColumnsOrder=function(t,r){var a=t,d=r,l=t,s=r;"multiply"===e.select&&(e.findHead||e.findBody?e.findHead&&!e.findBody?(l-=1,s-=1):!e.findHead&&e.findBody?(a-=1,d-=1):e.findHead&&e.findBody:(a-=1,d-=1,l-=1,s-=1)),e.$apply(function(){e.fields.swap(l,s);var t=e.headers.slice();if(e.headers.swap(a,d),e.onDrag&&"function"==typeof e.onDrag&&e.onDrag({$oldOrder:t,$newOrder:e.headers}),t=null,e.columnSearch&&e.columnSearch.swap(a,d),o.bodyTemplate){var r=angular.element(o.bodyTemplate).children(),u=document.createElement("tr"),f=document.createElement("tbody"),h=n.find("tbody").find("tr")[0].attributes;if([].forEach.call(h,function(e,t){u.setAttribute(e.name,e.value)}),"multiply"===e.select&&!0===c){c=!1;var p=document.createElement("td"),g=document.createElement("input");g.setAttribute("type","checkbox"),g.setAttribute("ng-checked","isSelected(item)"),angular.element(p).append(g),u.appendChild(p),Array.prototype.swap.apply(r,[l-1,s-1])}else Array.prototype.swap.apply(r,[l,s]);for(var m=0,b=r.length;m<b;m++)u.appendChild(r[m]);f.appendChild(u),n.find("tbody").replaceWith(f),o.bodyTemplate=f.innerHTML,i(n.find("tbody"))(e)}if(e.customHeader){var v=n.find("th"),u=document.createElement("tr"),k=document.createElement("thead");Array.prototype.swap.apply(v,[a,d]);for(var m=0,b=v.length;m<b;m++)u.appendChild(v[m]);k.appendChild(u),n.find("thead").replaceWith(k)}e.jumpToPage(1)})},this._addHeaderPattern=function(t){if(e.customHeader=!0,Array.prototype.forEach.call(t.querySelectorAll("[allow-drag]"),function(e,t){e.setAttribute("index",t)}),t.removeAttribute("ng-non-bindable"),n.find("table").prepend(t),"multiply"===e.select){if("undefined"!=typeof n.find("thead").children()[0]){var r="<th><i class='fa' ng-class=\"{'fa-square-o':'unchecked'==isCheckedModel, 'fa-check-square-o':'checked'==isCheckedModel,  'fa-minus-square-o':'indeterminate'==isCheckedModel}\"  ng-click='clickThead()'></i></th>";angular.element(n.find("thead").children()[0]).prepend(r)}"undefined"!=typeof n.find("thead").children()[1]&&angular.element(n.find("thead").children()[1]).prepend("<th></th>"),i(n.find("table"))(e)}},this._addFooterPattern=function(e){n.find("table").prepend(e)},this._addRowPattern=function(t,r,a){if(this._checkEditableContent(t),this._addRepeatToRow(t,r,a),t.removeAttribute("ng-non-bindable"),n.find("table").append(t.outerHTML),this.bodyTemplate=t.innerHTML,"multiply"===e.select){var d="<td><i class='fa' ng-click='setMulSelected(item, $index, $event)' ng-class=\"{'fa-square-o':'unchecked'==item.isCheckedModel,'fa-square-o ':undefined==item.isCheckedModel, 'fa-check-square-o':'checked'==item.isCheckedModel,  'fa-minus-square-o':'indeterminate'==item.isCheckedModel}\"></i></td>";angular.element(n.find("tbody").children()[0]).prepend(d)}i(n.find("tbody"))(e)},this._checkEditableContent=function(e){var t,n=/\{\{:*:*(.*?)\}\}/g;Array.prototype.forEach.call(e.querySelectorAll("[editable]"),function(e){t=e.innerHTML.replace(n,"$1"),e.innerHTML="<div contentEditable ng-model='"+t+"'>{{"+t+"}}</div>"})},this._addRepeatToRow=function(e,t,n){var r=angular.element(e).find("tr"),a=angular.element(r[0]);if(1==r.length)a.attr("ng-repeat","item in $filtered = (data"+t+")"+n),a.attr("ng-click")||a.attr("ng-click","setSelected(item, $index)"),a.attr("ng-class","{'selected-row':isSelected(item)}");else{var i=angular.element(r[1]);a.attr("ng-repeat-start","item in $filtered = (data"+t+")"+n),a.attr("ng-click")||a.attr("ng-click","setSelected(item, $index)"),a.attr("ng-class","{'selected-row':isSelected(item)}"),i.attr("ng-repeat-end","")}},e.$on("ngRepeatFinished",function(){}),e.isCheckedModel="unchecked",e.clickThead=function(){if("checked"==e.isCheckedModel?e.isCheckedModel="unchecked":"unchecked"==e.isCheckedModel?e.isCheckedModel="checked":"indeterminate"==e.isCheckedModel&&(e.isCheckedModel="checked"),o.toggleSelectAllFunc(),"true"==e.parentTable&&e.$broadcast("parentTableAllSelected",e.isCheckedModel),"true"==e.childTable){var t=n.find("table").parent().parent().parent().parent()[0].rowIndex;e.$emit("childTableAllSelected",t,e.isCheckedModel)}},this.toggleSelectAllFunc=function(){"checked"==e.isCheckedModel?(e.selectedModel=[],angular.forEach(e.$filtered,function(t){t.isCheckedModel="checked",e.selectedModel.push(t)})):(e.selectedModel=[],angular.forEach(e.$filtered,function(e){e.isCheckedModel="unchecked"})),angular.isFunction(e.setSelect)&&t(function(){e.setSelect()})},e.setMulSelected=function(n,r,a){a.preventDefault(),a.stopPropagation(),o._containsInSelectArray(n)?e.selectedModel.splice(e.selectedModel.indexOf(n),1):e.selectedModel.push(n),o.clickTr(n,r),angular.isFunction(e.setSelect)&&t(function(){e.setSelect()})},e.setSelected=function(n,r){e.selectedModel=[],angular.forEach(e.$filtered,function(e){e.isCheckedModel="unchecked"}),e.selectedModel.push(n),o.clickTr(n,r),angular.isFunction(e.setSelect)&&t(function(){e.setSelect()})},this._containsInSelectArray=function(t){if(e.selectedModel.length)return e.selectedModel.filter(function(e){if("undefined"!=typeof e&&"undefined"!=typeof t)return e.$$hashKey==t.$$hashKey}).length>0},this.clickTr=function(t,r){if("checked"==t.isCheckedModel?t.isCheckedModel="unchecked":"unchecked"==t.isCheckedModel?t.isCheckedModel="checked":"indeterminate"==t.isCheckedModel?t.isCheckedModel="checked":void 0==t.isCheckedModel&&(t.isCheckedModel="checked"),1==o.isAllSelected()?e.isCheckedModel="checked":e.selectedModel.length>0&&e.selectedModel.length<e.$filtered.length?e.isCheckedModel="indeterminate":e.isCheckedModel="unchecked","true"==e.parentTable&&e.$broadcast("parentTableRowSelected",r,t.isCheckedModel),"true"==e.childTable){var a=n.find("table").parent().parent().parent().parent()[0].rowIndex;e.$emit("childTableRowSelected",a,e.isCheckedModel)}},this.isAllSelected=function(){return e.selectedModel.length===e.$filtered.length},e.isSelected=function(t){return!!e.selectedModel&&o._containsInSelectArray(t)},e.$on("parentTableRowSelected",function(t,r,a){"true"==e.childTable&&2*(r+1)==n.find("table").parent().parent().parent().parent()[0].rowIndex&&("checked"==a?e.isCheckedModel="checked":e.isCheckedModel="unchecked",o.toggleSelectAllFunc())}),e.$on("parentTableAllSelected",function(t,r){if("true"==e.childTable)for(var a=n.find("table").parent().parent().parent().parent().parent().children().length,i=0;i<a;i++)e.$broadcast("parentTableRowSelected",i,r)}),this.setParentRowStatus=function(n,r){"checked"==r?(n.isCheckedModel="checked",o._containsInSelectArray(n)||e.selectedModel.push(n)):"unchecked"==r?(n.isCheckedModel="unchecked",o._containsInSelectArray(n)&&e.selectedModel.splice(e.selectedModel.indexOf(n),1)):"indeterminate"==r&&(n.isCheckedModel="indeterminate",o._containsInSelectArray(n)&&e.selectedModel.splice(e.selectedModel.indexOf(n),1)),1==o.isAllSelected()?e.isCheckedModel="checked":e.selectedModel.length>0&&e.selectedModel.length<e.$filtered.length?e.isCheckedModel="indeterminate":e.isCheckedModel="unchecked",angular.isFunction(e.setSelect)&&t(function(){e.setSelect()})},e.$on("childTableRowSelected",function(t,n,r){"true"==e.parentTable&&o.setParentRowStatus(e.$filtered[n/2-1],r)}),e.$on("childTableAllSelected",function(t,n,r){"true"==e.parentTable&&e.setSelected(e.$filtered[n/2-1],n/2-1)}),e.curPage=1,e.jumpToPage=function(n){return"undefined"==typeof n?void swal.swal("请输入合适页码!"):(e.currentPage=n,void(angular.isFunction(e.reload)&&t(function(){e.reload()})))},e.pageChanged=function(){angular.isFunction(e.reload)&&t(function(){e.reload()})},e.itemsPerPageChanged=function(){angular.isFunction(e.reload)&&t(function(){e.reload()})}}]),angular.module("qsTable").directive("qsTable",["$compile","$interpolate",function(e,t){return{restrict:"A",replace:!0,templateUrl:"/src/templates/common.html",controller:"QsTableCtrl",controllerAs:"ctrl",transclude:!0,scope:{data:"=",currentPage:"=?",itemsPerPage:"=?",totalItems:"=?",resize:"=?",paging:"=?",fromUrl:"@",dynamicHeaders:"@headers",dynamicFields:"@fields",dynamicTable:"@",parentTable:"@",childTable:"@",setSelect:"&?",reload:"&?",sortingType:"@?sorting",editable:"&?",select:"@?",selectedModel:"=?",dragColumns:"=?",onEdit:"&?",onDrag:"&?"},compile:function(e,t){var n="",r="";if(t.addFilter&&(n+=t.addFilter),"false"!==t.sorting&&(n+="| orderBy:sortingArray"),t.dragColumns){e.find("th").attr("allow-drag","");var a=e.find("th");angular.forEach(a,function(e){e.hasAttribute("ng-if")&&e.removeAttribute("allow-drag")})}return"separate"===t.search?t.fields.split(",").forEach(function(e,t){n+="| filter:{'"+e.trim()+"':columnSearch['"+e.trim()+"']}"}):"undefined"!=typeof t.search&&"true"===t.search&&(n+="| filter:globalSearch"),r+=" | offset: currentPage:itemsPerPage |limitTo: itemsPerPage",e[0].querySelector("#rowTr").setAttribute("ng-repeat","item in $parent.$filtered = (data"+n+")"+r),e.find("paging").attr("count","$filtered.length"),function(e,t,a,i,d){i._init(),d(e,function(t,a){e.$owner=a.$parent;for(var d in t)if(t.hasOwnProperty(d))switch(t[d].tagName){case"THEAD":e.findHead=!0,i._addHeaderPattern(t[d]);break;case"TBODY":e.findBody=!0,i._addRowPattern(t[d],n,r);break;case"TFOOT":i._addFooterPattern(t[d])}})}}}}]),angular.module("qsTable").filter("offset",function(){return function(e,t,n){if(e){t=parseInt(t,10),n=parseInt(n,10);var r=(t-1)*n;return e.slice(r,r+n)}}}),angular.module("qsTable").controller("QsTableResizeCtrl",["$scope",function(e){function t(e){i&&(n.width=a+(e.pageX-r))}var n,r,a,i=!1,d=!1;e.resizeStart=function(e){var d=e.target?e.target:e.srcElement;d.classList.contains("resize")&&(n=d.parentNode,i=!0,r=e.pageX,a=d.parentNode.offsetWidth,document.addEventListener("mousemove",t),e.stopPropagation(),e.preventDefault())},e.resizeEnd=function(e){i&&(document.removeEventListener("mousemove",t),e.stopPropagation(),e.preventDefault(),i=!1,d=!0)},e.getResizePressEnd=function(){return d},e.setResizePressEnd=function(e){d=e}}]),angular.module("qsTable").controller("QsTableSortingCtrl",["$scope",function(e){e.sort={fields:[],reverse:[]},e.sortingArray=[],e.sortBy=function(t){if(e.getResizePressEnd())return void e.setResizePressEnd(!1);if(e.data.length){var n=e.headers[e.fields.indexOf(t)];"compound"==e.sortingType?e.sort.fields.indexOf(n)==-1?(e.sort.fields.push(n),e.sortingArray.push(t),e.sort.reverse.push(!1)):e.changeReversing(t,e.sort.fields.indexOf(n)):"simple"==e.sortingType&&(e.sort.fields=[n],e.changeReversing(t))}},e.changeReversing=function(t,n){"compound"==e.sortingType?(e.sort.reverse[n]=!e.sort.reverse[n],e.sortingArray[n]=e.sort.reverse[n]?"-"+t:t):"simple"==e.sortingType&&(e.sort.reverse[0]=!e.sort.reverse[0],e.sortingArray=e.sort.reverse[0]?[t]:["-"+t])},e.headerIsSortedClass=function(t){if(e.sortingArray.length)if("simple"==e.sortingType){if(t==e.sort.fields[0]||"-"+t==e.sort.fields[0])return e.sort.reverse[0]?"table-sort-down":"table-sort-up"}else if("compound"==e.sortingType){var n=e.sort.fields.indexOf(t);if(n!=-1)return e.sort.reverse[n]?"table-sort-down":"table-sort-up"}},e.removeSorting=function(){var t=e.sort.fields.indexOf(this.sortField);t>-1&&(e.sort.fields.splice(t,1),e.sort.reverse.splice(t,1),e.sortingArray.splice(t,1)),t=null}}]),angular.module("qsTable").service("QsTableUtilService",[function(){return Array.prototype.swap=function(e,t){if(e>=this.length)for(var n=e-this.length;n--+1;)this.push(void 0);return this.splice(e,0,this.splice(t,1)[0]),this},{getArrayFromParams:function(e,t){if(!e)throw"Required '"+t+"' attribute is not found!";for(var n=[],r=e.split(","),a=0,i=r.length;a<i;a++)n.push(r[a].trim());return n}}}]);
angular.module("qsTable").run(["$templateCache", function($templateCache) {$templateCache.put("/src/templates/common.html","<div class=\"qs-table-module\"><div class=\"col-xs-12 col-sm-6 col-md-8 sorting-container\"><div ng-if=\"sortingType && sort.fields.length\">排序:<div ng-repeat=\"sortField in sort.fields\" class=\"sorting-badge\"><span class=\"glyphicon\" ng-class=\"{\'glyphicon-chevron-down\':sort.reverse[$index], \'glyphicon-chevron-up\':!sort.reverse[$index]}\"></span> {{::sortField}} <span class=\"glyphicon glyphicon-remove close\" ng-click=\"removeSorting()\"></span></div></div></div><div class=\"form-group col-xs-12 col-sm-6 col-md-4\" ng-if=\"search && \'separate\'!=search\"><input type=\"text\" placeholder=\"Search\" ng-model=\"$parent.globalSearch\" class=\"row pull-right form-control search\" ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 500, \'blur\': 0 } }\" ng-change=\"jumpToPage(1)\"> <i class=\"glyphicon glyphicon-search search_icon\"></i></div><div class=\"clearfix\"></div><div class=\"back-cover\"><table class=\"table table-responsive table-bordered qs-table\" ng-mousedown=\"resizeStart($event)\" ng-mouseup=\"resizeEnd($event)\"><thead ng-if=\"!customHeader\"><!-- 无自定义thead --><tr><th ng-if=\"select===\'multiply\'\"><i class=\"fa\" ng-class=\"{\'fa-square-o\':\'unchecked\'==isCheckedModel, \'fa-check-square-o\':\'checked\'==isCheckedModel,  \'fa-minus-square-o\':\'indeterminate\'==isCheckedModel}\" ng-click=\"clickThead()\"></i></th><th ng-repeat=\"head in headers track by $index\" ng-click=\"sortBy(fields[$index])\" ng-class=\"headerIsSortedClass(head)\" class=\"sortable\">{{head}}<div ng-if=\"resize\" class=\"resize\"></div></th></tr></thead><thead ng-if=\"!customHeader && \'separate\'===search\"><!-- 无自定义列且有单列搜索栏 --><tr><th ng-if=\"select===\'multiply\'\"></th><!-- thead中的checkbox --><th ng-repeat=\"head in headers track by $index\" class=\"separate\"><i class=\"glyphicon glyphicon-search search_icon separate\"></i> <input type=\"text\" ng-model=\"columnSearch[fields[$index]]\" placeholder=\"{{head}}...\" class=\"form-control search separate\" ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 500, \'blur\': 0 } }\" ng-change=\"jumpToPage(1)\"></th></tr></thead><tbody ng-if=\"!findBody\"><!-- 无自定义行 --><tr id=\"rowTr\" ng-click=\"setSelected(item, $index)\" ng-class=\"{\'selected-row\':isSelected(item)}\"><!-- <= will inject ng-repeat --><!-- params: headers and fields --><td ng-if=\"select===\'multiply\'\"><i class=\"fa\" ng-click=\"setMulSelected(item, $index, $event)\" ng-class=\"{\'fa-square-o\':\'unchecked\'==item.isCheckedModel, \'fa-check-square-o\':\'checked\'==item.isCheckedModel, \'fa-minus-square-o\':\'indeterminate\'==item.isCheckedModel, \'fa-square-o \':undefined==item.isCheckedModel}\"></i></td><td ng-if=\"!editable\" ng-repeat=\"field in fields\">{{item[field]}}</td><td ng-if=\"editable\" editable ng-repeat=\"field in fields\"><div contenteditable ng-model=\"item[field]\">{{item[field]}}</div></td></tr></tbody></table></div><div class=\"loading\" ng-show=\"dataIsLoading\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span> Loading Data...</div><div ng-if=\"paging\" style=\"text-align: right\"><ul uib-pagination total-items=\"totalItems\" items-per-page=\"itemsPerPage\" ng-model=\"$parent.currentPage\" ng-change=\"pageChanged()\" max-size=\"8\" boundary-links=\"true\" rotate=\"false\" first-text=\"首页\" previous-text=\"上一页\" next-text=\"下一页\" last-text=\"尾页\"></ul><input class=\"form-control\" max=\"{{((totalItems/itemsPerPage+0.499999)|number:0)==0?currentPage:((totalItems/itemsPerPage+0.499999)|number:0)}}\" min=\"1\" ng-model=\"curPage\" style=\"vertical-align: top; margin: 20px 20px; display: inline-block; width: 70px\" type=\"number\" placeholder=\"请输入数字\"> <button class=\"btn btn-outline btn-default\" style=\"vertical-align: top; margin: 20px 20px; display: inline-block; width: 50px\" ng-click=\"jumpToPage(curPage)\">GO</button></div><div class=\"clearfix\"></div></div>");}]);