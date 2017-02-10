## CORE

### $.contains 
`$.contains(parent, node)   ⇒ boolean`

检查父节点是否包含给定的dom节点，如果两者是相同的节点，则返回 false

### $.each
`$.each(collection, function(index, item){ ... })   ⇒ collection`           

遍历数组元素或以key-value值对方式遍历对象。回调函数返回 false 时停止遍历
         
### $.extend
`$.extend(true, target, [source, ...])   ⇒ target`          

通过源对象扩展目标对象的属性，源对象属性将覆盖目标对象属性。默认情况下为，复制为浅拷贝（浅复制）。如果第一个参数为true表示深度拷贝（深度复制）          

### $.fn 

$.fn是一个对象，在这个对象添加一个方法，所有的 gQuery 对象上都能用到该方法。

### $.inArray         
`$.inArray(element, array, [fromIndex])   ⇒ number`

返回数组中指定元素的索引值，如果没有找到该元素则返回-1

### $.isArray         
`$.isArray(object)   ⇒ boolean`

如果object是array，则返回ture

### $.isFunction      
`$.isFunction(object)   ⇒ boolean`

如果object是function，则返回ture

### $.isNumeric       
`$.isNumeric(value)   ⇒ boolean`

如果该值为有限数值或一个字符串表示的数字，则返回ture

### $.isPlainObject   
`$.isPlainObject(object)   ⇒ boolean`

测试对象是否是“纯粹”的对象，这个对象是通过 对象常量（"{}"） 或者 new Object 创建的，如果是，则返回true

### $.isWindow        
`$.isWindow(object)   ⇒ boolean`

如果object参数是否为一个window对象，那么返回true。这在处理iframe时非常有用，因为每个iframe都有它们自己的window对象，使用常规方法obj === window校验这些objects的时候会失败

### $.map             
`$.map(collection, function(item, index){ ... })   ⇒ collection`

通过遍历集合中的元素，返回通过迭代函数的全部结果，null 和 undefined 将被过滤掉

### $.parseJSON       
`$.parseJSON(string)   ⇒ object`

原生JSON.parse方法的别名

### $.trim            
`$.trim(string)   ⇒ string`

删除字符串首尾的空白符

### $.type            
`$.type(object)   ⇒ string`

获取JavaScript 对象的类型。可能的类型有： null undefined boolean number string function array date regexp object error。

对于其它对象，它只是简单报告为“object”，如果你想知道一个对象是否是一个javascript普通对象，使用 isPlainObject

### $.isEmptyObject   
`$.isEmptyObject(object)   ⇒ boolean`

测试对象是否是“空”的对象