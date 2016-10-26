/**
 * gQuery.js
 *
 * 参考 jQuery.js 和 zepto.js
 *
 * v 0.2.2
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

    var VERSION = 'v0.2.2';
    var printLog = false;
    var printNoSupportedLog = true;


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
        if (printNoSupportedLog) {
            //将类似数组转换成数组，返回的结果是真正的Array，这样就可以应用Array下的所有方法了
            var args = Array.prototype.slice.call(arguments);
            args.push(' is not supported in ' + VERSION);
            // log(args);
            console.log.apply(console, args);
        }
    }

    function log() {
        if (printLog) console.log.apply(console, arguments);
    }

    // IIFE http://weizhifeng.net/immediately-invoked-function-expression.html
    var gQuery = (function () {
            var core = {};
            var $,
                undefined,
                document = window.document,
                emptyArray = [],
                class2type = {},
                unique,
                toString = class2type.toString,
                slice = emptyArray.slice,
                concat = emptyArray.concat,
                /**
                 *  @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
                 */
                isArray = Array.isArray,
                filter = emptyArray.filter,
                simpleSelectorRE = /^[\w-]*$/,
                readyRE = /complete|loaded|interactive/,
                tempParent = document.createElement('div');

            ////////////////////////
            //function
            ////////////////////////

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
                return array.length > 0 ? concat.apply([], array) : array;
            }


            function funcArg(context, arg, idx, payload) {
                return isFunction(arg) ? arg.call(context, idx, payload) : arg
            }

            function compact(array) {
                return filter.call(array, function (item) {
                    return item != null
                })
            }

            // 数组去重，如果该条数据在数组中的位置与循环的索引值不相同，
            // 则说明数组中有与其相同的值
            unique = function (array) {
                return filter.call(array, function (item, index) {
                    return array.indexOf(item) == index;
                })
            };


            ////////////////////////
            //core
            ////////////////////////

            // core.G = function (dom, selector) {
            //     return new G(dom, selector)
            // };
            //
            // function G(dom, selector) {
            //     var i, len = dom ? dom.length : 0;
            //     for (i = 0; i < len; i++) this[i] = dom[i];
            //     this.length = len;
            //     this.selector = selector || '';
            //     logNoSupported('function G(dom, selector) {...}:\n  length: ' + this.length + ' selector: ' + this.selector);
            // }
            core.G = function (dom, selector) {
                dom = dom || [];
                // 通过给 dom 设置__proto__属性指向$.fn来达到继承$.fn上所有方法的目的
                dom.__proto__ = $.fn;
                dom.selector = selector || '';
                log('dom core.G: ');
                log(dom);
                return dom;
            };

            /**
             * 是否是 core.G gQuery对象
             */
            core.isG = function (object) {
                log('isG:');
                log(object instanceof core.G);
                return object instanceof core.G
            };
            /**
             * 元素是否匹配选择器
             *
             * 如果当前元素能被指定的css选择器查找到,则返回true,否则返回false.
             * @link https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches
             *
             * $.matches(document.getElementsByClassName('qwe')[0],'h3') =>true
             */
            core.matches = function (element, selector) {
                if (!selector || !element || element.nodeType !== 1) {
                    return false;
                }
                // 如果浏览器支持 matchesSelector ,直接调用
                var matchesSelector = element.matches || element.webkitMatchesSelector ||
                    element.mozMatchesSelector || element.oMatchesSelector ||
                    element.matchesSelector;
                if (matchesSelector) {
                    return matchesSelector.call(element, selector);
                }
                // 如果浏览器不支持 matchesSelector, 则将节点放入一个临时div节点，
                // 再通过selector来查找这个div下的节点集，
                // 再判断给定的element是否在节点集中，如果在，则返回一个非零(即非false)的数字
                var match,
                    parent = element.parentNode,
                    temp = !parent;
                // 当 element没有父节点,那么将其插入一个临时的 div里面
                if (temp) {
                    (parent = tempParent).appendChild(element);
                }
                // 0 会被转换为false,而indexOf()没有匹配时会返回 -1
                // ~-1 === 0  [-1] = [10000001]原 = [11111110]反 = [11111111]补
                match = ~core.querySelector(parent, selector).indexOf(element);
                // 将插入的节点删掉
                temp && tempParent.removeChild(element);
                return match;

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

                log('querySelector: maybeID: ' + maybeID + ', maybeClass: ' + maybeClass + ', nameOnly: ' + nameOnly + ', isSimple: ' + isSimple);
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
                } else if (core.isG(selector)) {
                    return selector;
                } else if (isArray(selector)) {
                    dom = compact(selector);
                }
                log('dom core.init:');
                log(dom);
                return core.G(dom, selector)
                // return 'example';
            };

            ////////////////////////
            // $
            ////////////////////////

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
                } : log("Error: Your browser not support '$.contains' method");

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
                log('Before flatten: ');
                log(values);
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
            /**
             * 如果当前元素能被指定的css选择器查找到,则返回true,否则返回false
             */
            $.matches = core.matches;


            $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
                class2type["[object " + name + "]"] = name.toLowerCase()
            });


            ////////////////////////
            //fn
            ////////////////////////

            $.fn = {
                // constructor: core.G,
                length: 0,

                // Because a collection acts like an array
                // copy over these useful array functions.
                forEach: emptyArray.forEach,
                reduce: emptyArray.reduce,
                push: emptyArray.push,
                sort: emptyArray.sort,
                splice: emptyArray.splice,
                indexOf: emptyArray.indexOf,

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
                /**
                 * 从当前对象集合中获取所有元素或单个元素。当 index参数不存在的时，以普通数组的方式返回所有的元素。
                 * 当指定 index时，只返回该置的元素。该方法返回的是 DOM节点。
                 */
                get: function (idx) {
                    return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
                },
                toArray: function () {
                    return this.get()
                },
                size: function () {
                    return this.length
                },
                concat: emptyArray.concat,
                // concat: function () {
                //     var i, value, args = []
                //     for (i = 0; i < arguments.length; i++) {
                //         value = arguments[i]
                //         args[i] = core.isG(value) ? value.toArray() : value
                //     }
                //     return concat.apply(core.isG(this) ? this.toArray() : this, args)
                // },
                //遍历对象/数组 在每个元素上执行回调，并将返回结果用 $封装
                map: function (fn) {
                    //TODO
                    logNoSupported('map');
                    // return $($.map(this, function (element, i) {
                    //     return fn.call(element, i, element);
                    // }))
                },
                // 使用数组的 slice方法，并将返回结果用 $封装
                // @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
                slice: function () {
                    return $(slice.apply(this, arguments))
                },
                // 遍历一个对象集合每个元素。
                // 在迭代函数中，this关键字指向当前项(作为函数的第二个参数传递)。
                // 如果迭代函数返回 false，遍历结束。
                each: function (callback) {
                    /**
                     * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every
                     */
                    emptyArray.every.call(this, function (element, i) {
                        return callback.call(element, i, element) !== false;
                    });
                    return this;
                },
                // 从其父节点中删除当前集合中的元素
                // @link https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild
                remove: function () {
                    return this.each(function () {
                        if (this.parentNode != null) {
                            this.parentNode.removeChild(this);
                        }
                    })
                },
                // 添加元素到当前匹配的元素集合中。
                // 如果给定content参数，将只在content元素中进行查找，
                // 否则在整个document中查找 TODO
                // add: function (selector, context) {
                //     return $(unique(this.concat($(selector, context))))
                // },

                // 过滤对象集合，返回对象集合中满足css选择器的项。
                // 如果参数为一个函数，函数返回有实际值得时候，元素才会被返回。
                // 在函数中， this 关键字指向当前的元素。
                // @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                filter: function (selector) {
                    if (isFunction(selector)) {
                        // 两次取反
                        return this.not(this.not(selector));
                    }
                    return $(filter.call(this, function (element) {
                        return core.matches(element, selector);
                    }))

                },

                //判断当前元素集合中的第一个元素是否符css选择器。
                is: function (selector) {
                    return this.length > 0 && core.matches(this[0], selector)
                },
                // 过滤当前对象集合，获取一个新的对象集合，它里面的元素不能匹配css选择器。
                // 如果另一个参数为 gQuery对象集合，那么返回的新 gQuery对象中的元素都不包含在该参数对象中。
                // 如果参数是一个函数 ,仅仅包含函数执行为false值得时候的元素，
                // 函数的 this关键字指向当前循环元素
                not: function (selector) {
                    var nodes = [];
                    // 如果为函数时，safari 下的typeof NodeList也是function?[经测试 Safari10 返回 object]
                    // 所以这里需要再加一个判断selector.call !== undefined
                    if (isFunction(selector) && selector.call !== undefined) {
                        this.each(function (index) {
                            if (!selector.call(this, index)) {
                                nodes.push(this)
                            }
                        })
                    } else {
                        // 如果为字符串,调用 filter
                        var excludes = typeof selector == 'string' ? this.filter(selector) :
                            ((likeArray(selector) && isFunction(selector.item)) ?
                                slice.call(selector) : $(selector));

                        this.forEach(function (element) {
                            if (excludes.indexOf(element) < 0) {
                                nodes.push(element);
                            }
                        })
                    }
                    return $(nodes);
                },


                // 获取对象集合中每一个元素的属性值。返回值为 null或 undefined值得过滤掉
                pluck: function (property) {
                    return $.map(this, function (el) {
                        return el[property]
                    })
                },


            }
            ;

            core.G.prototype = $.fn;

            return $;
        }()
    );


    window.gQuery = gQuery;
    // 如果未定义 $ 则赋值为gQuery,防止冲突
    window.$ === undefined && (window.$ = gQuery);
});