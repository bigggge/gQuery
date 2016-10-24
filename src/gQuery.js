/**
 * gQuery.js
 *
 * 参考 jQuery.js 和 zepto.js
 *
 * v 0.2.1
 *
 * Created by xiepan on 2016/10/19 11:13.
 */

//IIFE  立即执行函数表达式 模拟块作用域 立即执行 独立模块，防止命名冲突，解耦。
(function (global, factory) {
    /**
     * @link https://segmentfault.com/a/1190000003732752
     * AMD 规范中，define 函数同样有一个公有属性 define.amd。
     * AMD 中的参数便是这个模块的依赖。那么如何在 AMD 中提供接口呢？
     * 它是返回一个对象，这个对象就作为这个模块的接口
     */
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(global)
        });
    } else {
        factory(global)
    }
})(this, function (window) {

    var VERSION = 'v0.2.0';

    /**
     * @deprecated
     */
    function logNoSupportedOld(arg) {
        console.log(arg + ' is not supported in ' + VERSION);
    }

    /**
     * 更优雅的 log
     */
    function logNoSupported() {
        //将类似数组转换成数组，返回的结果是真正的Array，这样就可以应用Array下的所有方法了
        var args = Array.prototype.slice.call(arguments);
        args.push(' is not supported in ' + VERSION);
        console.log.apply(console, args);
    }

    // IIFE http://weizhifeng.net/immediately-invoked-function-expression.html
    var gQuery = (function () {
        var core = {};
        var $,
            document = window.document,
            emptyArray = [],
            class2type = {},
            toString = class2type.toString,
            slice = emptyArray.slice,
            concat = emptyArray.concat,
            /**
             *  @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
             */
            isArray = Array.isArray,
            simpleSelectorRE = /^[\w-]*$/,
            readyRE = /complete|loaded|interactive/
            ;

        // core.Z = function (dom, selector) {
        //     return new Z(dom, selector)
        // };
        //
        // function Z(dom, selector) {
        //     var i, len = dom ? dom.length : 0;
        //     for (i = 0; i < len; i++) this[i] = dom[i];
        //     this.length = len;
        //     this.selector = selector || '';
        //     console.logNoSupported('function Z(dom, selector) {...}:\n  length: ' + this.length + ' selector: ' + this.selector);
        // }
        core.Z = function (dom, selector) {
            dom = dom || [];
            // 通过给 dom 设置__proto__属性指向$.fn来达到继承$.fn上所有方法的目的
            dom.__proto__ = $.fn;
            dom.selector = selector || '';
            return dom;
        };

        core.isZ = function (object) {
            return object instanceof core.Z
        };


        // 查询选择器
        core.querySelector = function (element, selector) {
            var found,
                // 是否是 id选择器
                maybeID = selector[0] == '#',
                // 是否是 class选择器
                maybeClass = !maybeID && selector[0] == '.',
                // 去掉选择器前的符号，并确保一个 1个字符的标签名 仍被检查
                nameOnly = (maybeID || maybeClass) ? selector.slice(1) : selector,
                // 是否是 简单选择器
                isSimple = simpleSelectorRE.test(nameOnly);

            console.log('querySelector: maybeID: ' + maybeID + ', maybeClass: ' + maybeClass + ', nameOnly: ' + nameOnly + ', isSimple: ' + isSimple);
            // Safari DocumentFragment doesn't have getElementById
            return (element.getElementById && isSimple && maybeID) ?
                // 如果是 id选择器
                ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
                //1Element元素节点 9Document文档节点 11DocumentFragment节点
                (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :                    // 将 NodeList转成数组
                    // 将 NodeList转成数组
                    slice.call(
                        // DocumentFragment doesn't have getElementsByClassName/TagName
                        (isSimple && !maybeID && element.getElementsByClassName ) ?
                            // If it's simple, it could be a class 如果是 class选择器
                            (maybeClass ? element.getElementsByClassName(nameOnly) :
                                // Or a tag 如果是标签
                                element.getElementsByTagName(selector)) :
                            // Or it's not simple, and we need to query all
                            // 返回当前文档中匹配一个特定选择器的所有的元素(使用深度优先，前序遍历规则这样的规则遍历所有文档节点)
                            // 返回的对象类型是 NodeList.
                            element.querySelectorAll(selector)
                    )
        };


        core.init = function (selector, context) {
            var dom;
            if (typeof selector == 'string') {
                selector = selector.trim();

                if (context !== undefined) {
                    //TODO
                    logNoSupported('context');
                }
                // If it's a CSS selector, use it to select nodes.
                else dom = core.querySelector(document, selector)
            }
            console.log('dom: ');
            console.log(dom);
            return core.Z(dom, selector)
            // return 'example';
        };

        $ = function (selector, context) {
            return core.init(selector, context)
        };

        /**
         * TODO
         * 检查父节点是否包含给定的dom节点，如果两者是相同的节点，则返回 false
         */
        $.contains = document.documentElement.contains ?
            function (parent, node) {
                return parent !== node && parent.contains(node)
            } : console.log("Error: Your browser not support '$.contains' method");

        /**
         * @link https://segmentfault.com/a/1190000002670622
         * 如果参数obj是undefined或null，则通过String(obj)转换为对应的原始字符串“undefined”或“null”，
         * 否则调用 class2type[toString.call(obj)]
         * 使用Object的原型方法 toString()来获取obj的字符串表示，形式是 [object class]，
         * 然后从对象 class2type中取出[object class]对应的小写字符串并返回，未取到则返回“object
         * @param obj
         * @returns {*}
         */
        function type(obj) {
            return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
        }

        function isFunction(value) {
            return type(value) == "function"
        }

        function isWindow(obj) {
            return obj != null && obj == obj.window
        }

        function isDocument(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE
        }

        function isObject(obj) {
            return type(obj) == "object"
        }

        function isPlainObject(obj) {
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
        }

        /**
         * 判断 类数组
         * @param obj
         * @returns {boolean}
         */
        function likeArray(obj) {
            // !!强制转换成 boolean类型
            // false、0、""、null、undefined 和 NaN 为 false
            // 如果指定的属性存在于指定的对象中，则 in 运算符会返回 true
            var length = !!obj && 'length' in obj && obj.length,
                type = $.type(obj);

            if (type === "function" || isWindow(obj)) {
                return false;
            }

            return type === "array" || length === 0 ||
                (typeof length === "number" && length > 0 && ( length - 1 ) in obj);

        }

        /**
         * Flatten any nested arrays
         * 优雅的数组降维
         * @link http://www.cnblogs.com/front-end-ralph/p/4871332.html
         */
        function flatten(array) {
            return array.length > 0 ? $.fn.concat.apply([], array) : array;
        }

        /**
         * 获取JavaScript 对象的类型。可能的类型有：
         * null undefined boolean number string function array date regexp object error
         */
        $.type = type;

        /**
         * 如果object是function，则返回ture
         */
        $.isFunction = isFunction;

        /**
         * 如果object参数是否为一个window对象，那么返回true。这在处理iframe时非常有用，因为每个iframe都有它们自己的window对象，
         * 使用常规方法obj === window校验这些objects的时候会失败
         */
        $.isWindow = isWindow;
        $.isArray = isArray;

        /**
         * 测试对象是否是“纯粹”的对象，这个对象是通过 对象常量（"{}"） 或者 new Object 创建的，如果是，则返回true
         */
        $.isPlainObject = isPlainObject

        /**
         * 是否是空对象
         */
        $.isEmptyObject = function (obj) {
            var name;
            for (name in obj)return false;
            return true;
        };

        /**
         * 如果该值为有限数值或一个字符串表示的数字，则返回ture
         */
        $.isNumeric = function () {
            logNoSupported('isNumeric');
        };

        /**
         * 返回给定元素能找在数组中找到的第一个索引值
         * @param element
         * @param array
         * @param [fromIndex]
         * @returns {*}
         */
        $.inArray = function (element, array, fromIndex) {
            return emptyArray.indexOf.call(array, element, fromIndex)
        };
        /**
         * 接受一个标准格式的 JSON 字符串，并返回解析后的 JavaScript 对象
         */
        $.parseJSON = JSON.parse;

        /**
         * 删除字符串首尾的空白符
         */
        $.trim = function (str) {
            return str == null ? "" : String.prototype.trim.call(str)
        };

        $.map = function (elements, callback) {
            var value, values = [], i, key;
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++) {
                    value = callback(elements[i], i);
                    if (value != null) {
                        values.push(value);
                    }
                }
            } else {
                for (key in elements) {
                    value = callback(elements[key], key);
                    if (value != null) {
                        values.push(value);
                    }
                }
            }
            console.log('Before flatten: ');
            console.log(values);
            return flatten(values);
        };

        $.each = function (elements, callback) {
            var i, key;
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++) {
                    // 使用 call可以在外部通过 this调用
                    if (callback.call(elements[i], i, elements[i]) === false) {
                        break;
                    }
                }
            } else {
                for (key in elements) {
                    if (callback.call(elements[key], key, elements[key]) === false) {
                        break;
                    }
                }
            }

            return elements
        };

        $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase()
        });

        $.fn = {
            // constructor: core.Z,
            length: 0,

            // Because a collection acts like an array
            // copy over these useful array functions.
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            splice: emptyArray.splice,
            indexOf: emptyArray.indexOf,
            size: function () {
                return this.length
            },
            ready: function (callback) {
                if (readyRE.test(document.readyState) && document.body) {
                    callback($);
                } else {
                    //js 高程p390
                    document.addEventListener('DOMContentLoaded', function () {
                        callback($)
                    }, false);
                }
                return this;
            },
            get: function (idx) {
                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
            },
            toArray: function () {
                return this.get()
            },
            concat: function () {
                var i, value, args = [];
                for (i = 0; i < arguments.length; i++) {
                    value = arguments[i];
                    args[i] = core.isZ(value) ? value.toArray() : value;
                }
                return concat.apply(core.isZ(this) ? this.toArray() : this, args)
            },
            map: function (fn) {

            },
            slice: function () {

            }

        };

        // core.Z.prototype = Z.prototype = $.fn;

        return $;
    }());


    window.gQuery = gQuery;
    // 如果未定义 $ 则赋值为gQuery,防止冲突
    window.$ === undefined && (window.$ = gQuery);
});