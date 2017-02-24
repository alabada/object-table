#QsTable使用指南

## 定义与作用

qstable是一套基于angularjs的表格组件，提供查找，过滤，分页，拖拽，单元格编辑，高亮显示等功能。

Display JSON in Table with AngularJS
## 使用该组件的前提

Angular v. 1.3.x+
Bootstrap 3 CSS 

## 功能点 

- 基于列数据的排序

- 混合排序（基于多个字段的排序）

- 支持单元格编辑功能

- 自定义行数据格式

- 自定义表头数据格式

- 高亮显示列与行

- 列宽度自适应

- 列拖拽

- 多选

- 表格外部对数据过滤

- 对表格分页

- 通过字段查找

- 嵌在表格内部的对表格数据的查询

- 表格底部的统计功能

- 表格主题多样化

## 安装

```
bower install angular-object-table
```

## 使用指南

### 表格属性

| 属性             | 会否必须 | 默认值    | 描述                                       |
| -------------- | ---- | ------ | ---------------------------------------- |
| data           | 是    | 无      | 展示表格的基础数据。                               |
| interface      | 是    | 无      | 与指令交互的字段。                                |
| items-per-page | 否    | 5      | 每页显示行数配置                                 |
| search         | 否    | true   | 用于配置是否显示查找框. 若设置search="separate" 将允许你只根据字段值进行查找 |
| paging         | 否    | true   | 是否使用分页                                   |
| headers        | 是    | 无      | 表头字段数组                                   |
| fields         | 是    | 无      | 表格中各字段数据显示属性名                            |
| sorting        | 否    | simple | 排序功能，“simple”用于对单列进行排序；“compound”用于排序多列。 |
| editable       | 否    | false  | 是否需要支持对单元格数据进行编辑。                        |
| select         | 否    | 无      | 设置select值为multiply，允许你多选。                |
| resize         | 否    | true   | 列尺寸调整                                    |
| drag-columns   | 否    | false  | 表格列拖拽                                    |

### 控制器

使用该组件，需要定义好控制器，引入该组件；因为拖拽组件，被分开，若表格使用到了拖拽组件，需要将拖拽组件一并引入。一下所有的表格案例将共用这一个控制器

```javascript
define([
    "js/directive/table/qsTableDirective",
    "js/directive/table/draggableDirective"
], function () {
    return ['$scope', function ($scope) {

        $scope.interface = {};

        $scope.fresh = function(){
            $scope.data = [
                {name: "Moroni", age: 50, money: -10},
                {name: "Tiancum", age: 43, money: 120},
                {name: "Jacob", age: 27, money: 5.5},
                {name: "Nephi", age: 29, money: -54},
                {name: "Enos", age: 34, money: 110},
                {name: "Tiancum", age: 43, money: 1000},
                {name: "Jacob", age: 27, money: -201},
                {name: "Nephi", age: 29, money: 100},
                {name: "Enos", age: 34, money: -52.5},
                {name: "Tiancum", age: 43, money: 52.1},
                {name: "Jacob", age: 27, money: 110},
                {name: "Nephi", age: 29, money: -55},
                {name: "Enos", age: 34, money: 551},
                {name: "Tiancum", age: 43, money: 1000},
                {name: "Jacob", age: 27, money: -201},
                {name: "Nephi", age: 29, money: 100},
                {name: "Enos", age: 34, money: -52.5},
                {name: "Tiancum", age: 43, money: 52.1},
                {name: "Jacob", age: 27, money: 110},
                {name: "Nephi", age: 29, money: -55},
                {name: "Enos", age: 34, money: 551},
                {name: "Tiancum", age: 43, money: -1410},
                {name: "Jacob", age: 27, money: 410},
                {name: "Nephi", age: 29, money: 100},
                {name: "Enos", age: 34, money: -100}];
            $scope.totalItems = $scope.data.length;
        }

        $scope.fresh();

        $scope.data1 = [
            {
                name: "Moroni",
                eyeColor: "green",
                age: 50,
                balance: "111111.0989",
                company: "启尚科技",
                address: "福建省厦门市湖里区望海路203-205",
                "friends": [{"name":"Grace Hanson","id":0},{"name":"Carlene Whitley","id":1},{"name":"Cassandra Parsons","id":2}],
                favoriteFruit: "food"
            },
            {
                name: "sss",
                eyeColor: "blue",
                age: 33,
                balance: "110901.0989",
                company: "尚科技",
                address: "福建省厦门市湖里区望海路209-205",
                "friends": [{"name":"Marta Crane","id":0},{"name":"Lela Pearson","id":1},{"name":"Casandra Finley","id":2}],
                favoriteFruit: "汉堡king"
            },
            {
                name: "发方法是",
                eyeColor: "blue",
                age: 13,
                balance: "1101.0989",
                company: "科技",
                address: "福建省厦门市湖里区望海路209-05",
                "friends": [{"name":"Celina Hopper","id":0},{"name":"Janet Huffman","id":1},{"name":"Decker Moody","id":2}],
                favoriteFruit: "hhhh"
            }
        ];
        $scope.totalItems1 = $scope.data1.length;

        $scope.report = {
            selectedPerson: null
        };

        $scope.test = function (e) {
            alert('Alert from controller method!');
        };

        $scope.showItem = function (item) {
            alert(JSON.stringify(item));
        };

        $scope.getTotalBalance = function (data) {
            //return if empty or not ready
            if (!data || !data.length) return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].money);
            }

            return Math.round(totalNumber);

        };

        // this variable will contains all data after loading
        $scope.dataFromUrl = [];

        /*codemirror*/

        $scope.editorOptions = {
            lineNumbers: true,
            readOnly: 'nocursor'
        };

        $scope.editorOptionsJS = {
            lineNumbers: true,
            readOnly: 'nocursor',
            mode: "javascript"
        };

        $scope.interface.reLoadData = function() {
            console.log("data reload");
        }
    }]
})
```

在该控制器中定义了表格的json数据，以及一些测试方法。下面分别介绍各类型表格的使用。

### 基础表格

最基础的表格案例，无分页，无自定义行、列，无拖拽，无查找。

```html
<table qs-table
       interface="interface"
       data="data"
       items-per-page="10"
       total-items="totalItems"
       headers="Age, full Name"
       fields="age, name"
       paging="false"
       sorting="simple"
       search="false"
></table>
```

### 排序

这边将sorting设置为compound，支持对多列进行排序。

```html
<table qs-table
       interface="interface"
       data="data"
       items-per-page="10"
       total-items="totalItems"
       headers="Full Name,Money, Age"
       fields="name,money,age"
       paging="false"
       sorting="compound"
></table>
```

### 分页

默认是支持分页的。

```html
<table qs-table
       interface="func",
       data="data"
       items-per-page="10"
       total-items="totalItems"
       headers="Age, full Name"
       fields="age,name"
       sorting="simple"
       search="false"
></table>
```

### 查找

将在表头下增加一行查找行。

```html
<table qs-table
       interface="interface"
       data="data"
       items-per-page="10"
       total-items="totalItems"
       data="data"
       headers="Name, Age"
       fields="name, age"
       search="separate"
></table>
```

### 自定义表头

自定义表头需要引入`thead`标签，在该标签下，自定义表头功能及样式。

```html

<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Address,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,address,favoriteFruit">
    <thead>
    <tr>
        <th colspan="3" class="_personal_inf">Personal information</th>
        <th colspan="4" class="additional_inf">Additional information</th>
    </tr>
    <tr>
        <th ng-click="sortBy('name')" ng-class="headerIsSortedClass('Name')" class="sortable _personal_inf">Name</th>
        <th ng-click="sortBy('eyeColor')" ng-class="headerIsSortedClass('Eye color')" class="sortable  _personal_inf">
            Eye color
        </th>
        <th ng-click="sortBy('age')" ng-class="headerIsSortedClass('Age')" class="sortable  _personal_inf">Age</th>
        <th ng-click="sortBy('balance')" ng-class="headerIsSortedClass('Balance')" class="sortable">Balance</th>
        <th ng-click="sortBy('company')" ng-class="headerIsSortedClass('Company')" class="sortable">Company</th>
        <th ng-click="sortBy('address')" ng-class="headerIsSortedClass('Address')" class="sortable">Address</th>
        <th ng-click="sortBy('favoriteFruit')" ng-class="headerIsSortedClass('Favorite Fruit')" class="sortable">
            Favorite Fruit
        </th>
    </tr>
    </thead>
</table>
```

### 自定义行

自定义行需要添加`tbody`标签，在该标签下添加自定义行的样式。

```html
<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Home address, Friends"
       fields="name,eyeColor,address,friends">
    <tbody ng-non-bindable>
    <tr>
        <td>{{::item.name}}</td>
        <td>
            <div class="{{::item.eyeColor}} eye"></div>
            {{::item.eyeColor}}
        </td>
        <td>{{::item.address}}</td>
        <td>
				<span ng-if="item.eyeColor=='blue'" ng-repeat="friend in item.friends" class="label label-info friend">
					{{::friend.name}}
				</span>
        </td>
    </tr>
    </tbody>
</table>
```

### 过滤器

```html

<div class="col-sm-3">
    <select name="name" id="nameSelect" ng-model="eyeColor" class="form-control">
        <option value='' disabled selected style='display:none;'>Please Choose eye color</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="brown">brown</option>
    </select>
</div>

<div class="col-sm-3">
    <input type="text" ng-model="name" class="form-control" placeholder="Name">
</div>

<div class="col-sm-3">
    <input type="text" ng-model="all" class="form-control" placeholder="All fields">
</div>

<br><br>

<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Home address,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,address,favoriteFruit"
       add-filter="| filter:{'name':$owner.name} |filter:{'eyeColor':$owner.eyeColor} | filter:$owner.all"
       search="false"
       select="multiply"
></table>
```

### 单元格可编辑

```html

<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Home address,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,address,favoriteFruit"
       sorting="compound"
       select="multiply"
       editable="true">
</table>
<hr>

<h2>Editable duble column (Eye color,age)</h2>

<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age, Balance, Company, Home address, Favorite Fruit"
       fields="name, eyeColor, age, balance, company, address, favoriteFruit"
       sorting="compound">
    <tbody>
    <tr>
        <td>{{::item.name}}</td>
        <td editable>{{item.eyeColor}}</td>
        <td editable>{{::item.age}}</td>
        <td>{{::item.balance}}</td>
        <td>{{::item.company}}</td>
        <td>{{::item.address}}</td>
        <td>{{::item.favoriteFruit}}</td>
    </tr>
    </tbody>
</table>
```

### 多选

```html
<table qs-table
       interface="interface"
       data="data"
       items-per-page="10"
       total-items="totalItems"
       headers="Age, full Name"
       fields="age,name"
       sorting="simple"
       search="false"
       select="multiply"
       selected-model="report.selectedPerson"
></table>
```

### 高亮显示行列

```html
<table qs-table class="hover-column"
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Home address,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,address,favoriteFruit"
       sorting="compound"
       editable="true">
</table>
```

可以看到，达到这个效果，主要是要在样式上去做控制。

### 拖拽列

```html
<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,favoriteFruit"
       search="separate"
       resize="true"
       select="multiply"
       drag-columns="true">
</table>
```

以下对特定列支持支队特定某些列设定拖拽功能。

```html
<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       select="multiply"
       headers="Name, Eye color, Age, Balance, Company, Favorite Fruit"
       fields="name, eyeColor, age, balance, company, favoriteFruit">
    <thead>
    <tr>
        <th ng-click="sortBy('name')" ng-class="headerIsSortedClass('Name')" class="sortable">Name</th>
        <th ng-click="sortBy('eyeColor')" ng-class="headerIsSortedClass('Eye color')" class="sortable">Eye
            color
        </th>
        <th ng-click="sortBy('age')" ng-class="headerIsSortedClass('Age')" class="sortable" allow-drag>Age</th>
        <th ng-click="sortBy('balance')" ng-class="headerIsSortedClass('Balance')" class="sortable" allow-drag>Balance
        </th>
        <th ng-click="sortBy('company')" ng-class="headerIsSortedClass('Company')" class="sortable" allow-drag>Company
        </th>
        <th ng-click="sortBy('favoriteFruit')" ng-class="headerIsSortedClass('Favorite Fruit')" class="sortable"
            allow-drag>Favorite Fruit
        </th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>{{::item.name}}</td>
        <td>
            <div class="{{::item.eyeColor}} eye"></div>
            {{::item.eyeColor}}
        </td>
        <td>{{::item.age}}</td>
        <td style="background-color:rgb(212, 255, 227)">{{::item.balance}}</td>
        <td>{{::item.company}}</td>
        <td>{{::item.favoriteFruit}}</td>
    </tr>
    </tbody>
</table>
```

### 通过拖拽调整列宽

```html

<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Home address,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,address,favoriteFruit"
       resize="true">
</table>
<hr>

<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age"
       fields="name,eyeColor,age"
       select="multiply"
       resize="true">
    <thead ng-mousedown="resizeStart($event)" ng-mouseup="resizeEnd($event)">
    <tr>
        <th>
            <span class="glyphicon glyphicon-user"></span>
            Name of Person
            <div class="resize"></div>
        </th>
        <th>
            <span class="glyphicon glyphicon-eye-open"></span>
            Eye
            <div class="resize"></div>
        </th>
        <th>
            <span class="glyphicon glyphicon-gift"></span>
            Age
            <div class="resize"></div>
        </th>
    </tr>
    </thead>
</table>
```

### 表footer增加统计说明

```html

<table qs-table
       data="data"
       items-per-page="10"
       total-items="totalItems"
       headers="Name, Age,Money"
       fields="name,age,money"
       search="separate"
       selected-model="report.selectedUser"
>
    <tfoot>
    <tr>
        <td>Total users:{{$filtered.length}}</td>
        <td></td>
        <td>Total balance:{{ $owner.getTotalBalance($filtered) }} $</td>
    </tr>
    </tfoot>
    <tbody>
    <tr>
        <td>{{::item.name}}</td>
        <td>{{::item.age}}</td>
        <td editable>{{item.money}}</td>
    </tr>
    </tbody>
</table>
```

可以看到，只需加上`tfoot`标签，并在该标签中，处理自定义统计行即可。

### 自定义不需要表头

```html
<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Home address,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,address,favoriteFruit">
    <thead></thead>
    <tbody>
    <tr>
        <td>{{::item.name}}</td>
        <td editable>{{item.eyeColor}}</td>
        <td>{{::item.age}}</td>
        <td>{{::item.balance}}</td>
        <td>{{::item.company}}</td>
        <td>{{::item.address}}</td>
        <td>{{::item.favoriteFruit}}</td>
    </tr>
    </tbody>
</table>
```

### 给表格自定义样式

```html
<table qs-table
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,favoriteFruit"
       search="separate"
></table>
<hr>

<h3 class="blue_dust_theme">Blue Dust</h3>
<p>class="blue-dust"</p>

<table qs-table class="blue-dust hover-column"
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,favoriteFruit"
       search="separate"
></table>
<hr>

<h3 class="blue_dust_theme">Dark sky</h3>
<p>class="dark-sky"</p>

<table qs-table class="dark-sky hover-column"
       interface="interface"
       data="data1"
       items-per-page="10"
       total-items="totalItems1"
       headers="Name, Eye color, Age,Balance,Company,Favorite Fruit"
       fields="name,eyeColor,age,balance,company,favoriteFruit"
       search="separate"
></table>
```

这里提供了三种不同的表格样式风格。


http://svn.geoext.org/ext/3.4.1/examples/grid/grid-plugins.html

## 功能统计
- 1、表格当行展开功能
- 2、垂直滚动条、水平滚动条（表格内可滚动）
- 3、单击当行checkbox，实现复选功能
- 4、复选后，单击任一行，变成单选功能
- 5、按shift键实现多选（对按checkbox复选框，该功能无效；多选的行从上一次单击到本次单击之间的所有行）
- 6、右键菜单 实现编辑功能
- 7、double click 暴露一个方法。




