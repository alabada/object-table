Display JSON in Table with AngularJS
=================

## Desription
将在object-table基础上对功能进行扩展

Requirements
=================
Angular v. 1.3.x
Bootstrap 3 CSS 

Feature List
------------
- loading data from URL
- column-specific filtering
- column sorting
- compound sorting (sorting by few fields)
- live editing (editable cells)
- custom row templates
- custom header templates
- column highlighting
- column resizing
- draggable columns
- multiply selection
- external filtering
- pagination
- search (by all fields)
- column searching (by each column)
- display aggregate information in footer (like, total ,sum)
- support server pagination
- themes!


## Run examples
Just run http server form root folder and open in browser example directory: http://localhost:8080/example/

## Using

```
<link rel="stylesheet" type="text/css" href="{path to library}/build/qs-table-style.css">

<script type="text/javascript" src="{path to library}/build/qs-table.js"></script>

<link rel="stylesheet" type="text/css" href="http://getbootstrap.com/dist/css/bootstrap.min.css">
```
Add dependency:
```
angular.module('yourModule', ['qsTable'])
```

Example of HTML-markup :
```
<table qs-table 
       from-url="http://some-url.com/getData" 
       data="exportDataVariable" 
       display="2" 
       headers="Name, Age" 
       fields="name, age"
       sorting="false"
       editable="true" 
></table>
```

## Atributes

Here is a file list for possible attributes for stable version:

Atribute             | required | Description
---------------------|----------|-------------------------
data                 | yes      | Data source (array of objects) in your Controller. Note: If 'fromUrl' is present, 'data' attribute contains controller link to empty array (will be fill up after receiving data). Example: data="exportDataVariable"
fromUrl				 | no       | Load data from external URL. 
display     		 | no       | *default: 5*. Displays count. Using with 'paging' displays items per page
search               | no       | *default: true*. Display search input. Value search="separate" is allows you search by columns.
paging				 | no       | *default: true*. Use paging to present data.
headers              | yes      | Table header names array. Example: headers = "HeaderName1,HeaderName2".
fields  			 | yes      | Array of displayed properties of object. This option allows to display only certain fields of the object. Number of fields must be equal number of headers. Example: fields=propertyName1,propertyName1".
sorting				 | no       | *default: simple*. Value "simple" is used to sort by single column,  "compound" - to order by multiple fields.
editable     		 | no       | Allows to edit content inside cells. Editing updates your angular model. 
select               | no       | select="multiply" allows to select more than one row. Selected rows are accessible.
selected-model		 | no		| It exports selected model to controller variable. selected-model="yourModel"
resize		 		 | no		| *default: true*. Use column resizing.
drag-columns		 | no		| *default: false*. It allows to reorder your columns using drag-n-drop.

## Tests (Karma + Jasmine)
```
karma start tests/karma.conf.js
```
## install
``npm install

```