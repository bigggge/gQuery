// http://chaijs.com/
// http://www.jianshu.com/p/f200a75a15d2
var should = chai.should();
var expect = chai.expect;

var $ = window.gQuery

// $.contains        √
// $.each            √
// $.extend          √
// $.fn              √
// $.inArray         √   借助于indexOf方法
// $.isArray         √   原生方法
// $.isFunction      √   借助于type方法
// $.isNumeric       √
// $.isPlainObject   √
// $.isWindow        √
// $.map             √
// $.parseJSON       √   借助于JSON.parse
// $.trim            √
// $.type            √
// $.isEmptyObject   √

describe('CORE$', function () {
    describe('$.type()', function () {
        it("string", function () {
            $.type('string').should.equal('string');

        });
        it("number", function () {
            $.type(1.2).should.equal('number');
            $.type(Number(1.2)).should.equal('number');
        });
        it("boolean", function () {
            $.type(true).should.equal('boolean')
            $.type(Boolean(false)).should.equal('boolean')
        })
        it("others", function () {
            var undefined
            $.type(new Date()).should.equal('date')
            $.type(new Error()).should.equal('error')
            $.type([]).should.equal('array')
            $.type(Function()).should.equal('function')
            $.type(new RegExp('ggg')).should.equal('regexp')
            $.type(/abc/g).should.equal('regexp')
            $.type({}).should.equal('object')
            $.type(null).should.equal('null')
            $.type(undefined).should.equal('undefined')
        })
    });

    describe('$.isFunction()', function () {
        it("isFunction", function () {
            expect($.isFunction(Function())).to.equal(true)
            $.isFunction(true).should.equal(false)
        })
    });

    describe('$.isWindow()', function () {
        it("isWindow", function () {
            expect($.isWindow(window)).to.equal(true)
        })
    });

    describe('$.isPlainObject()', function () {
        it("isPlainObject", function () {
            expect($.isPlainObject({})).to.equal(true)
            expect($.isPlainObject(new Object())).to.equal(true)
            expect($.isPlainObject({a: 1})).to.equal(true)
            expect($.isPlainObject([])).to.equal(false)
            expect($.isPlainObject(Array)).to.equal(false)
        })
    });

    describe('$.isEmptyObject()', function () {
        it("isEmptyObject", function () {
            expect($.isEmptyObject({})).to.equal(true)
            expect($.isEmptyObject({a: 1})).to.equal(false)
        })
    });

    describe('$.isArray()', function () {
        it("isArray", function () {
            expect($.isArray([])).to.equal(true)
            expect($.isArray([1, 2, 3])).to.equal(true)
            expect($.isArray(Array())).to.equal(true)
        })
    });

    describe('$.isNumeric()', function () {
        it("isNumeric", function () {
            expect($.isNumeric(1)).to.equal(true)
            expect($.isNumeric('1')).to.equal(true)
            expect($.isNumeric('a')).to.equal(false)
        })
    });

    describe('$.inArray()', function () {
        it("inArray", function () {
            expect($.inArray("abc", ["bcd", "abc", "edf", "aaa"])).to.equal(1)
            expect($.inArray("abc", ["bcd", "abc", "edf", "aaa"], 1)).to.equal(1)
            expect($.inArray("abc", ["bcd", "abc", "edf", "aaa"], 2)).to.equal(-1)
        })
    });

    describe('$.parseJSON()', function () {
        it("parseJSON", function () {
            expect($.parseJSON('{"x": 1, "y": 2}'))
                .to.deep.equal({x: 1, y: 2})
            expect($.parseJSON('[{"x": 1, "y": 2}, {"x": 1, "y": 2}]'))
                .to.deep.equal([{x: 1, y: 2}, {x: 1, y: 2}])
        })
    });

    describe('$.trim()', function () {
        it("trim", function () {
            expect($.trim(' 12 3 ')).to.equal('12 3')
            expect($.trim(123)).to.equal('123')
        })
    });

    describe('$.map()', function () {
        it("map", function () {
            expect(
                $.map([1, 2, 3], function (item, index) {
                    return item + 10;
                })
            ).to.eql([11, 12, 13])
            expect(
                $.map({a: 1, b: 2, c: 3}, function (item, index) {
                    return item + 10;
                })
            ).to.eql([11, 12, 13])
        })
    });

    describe('$.each()', function () {
        it("each", function () {
            var arr = [];
            $.each(['a', 'b', 'c'], function (index, item) {
                arr.push(index + item);
            });
            arr.should.eql(['0a', '1b', '2c'])

            var indexes = [];
            var items = [];
            $.each({name: 'gQuery.js', author: 'bigggge'}, function (index, item) {
                indexes.push(index);
                items.push(item);
            });
            indexes.should.eql(['name', 'author'])
            items.should.eql(['gQuery.js', 'bigggge'])
        })
    });

    describe('$.contains()', function () {
        it('contains', function () {
            var el1 = $('#li1')
            expect($.contains(el1.get(0), $('#li2').get(0))).to.equal(true);
            expect($.contains(el1.get(0), $('#parents').get(0))).to.equal(false);
            expect($.contains(el1.get(0), el1.get(0))).to.equal(false);
        })
    })

    describe('$.fn()', function () {
        it('fn', function () {
            $.fn.empty = function () {
                return this.each(function () {
                    this.innerHTML = ''
                })
            }
            var $empty = $('#empty');
            $empty.empty();
            expect($empty.innerHTML).to.be.empty;
        })
    })

    describe('$.extend()', function () {
        it('extend', function () {
            var target = {one: 'one'},
                source = {two: 'two', three: [1, 2]},
                source2 = {x: "x"}
            expect($.extend(true, target, source, source2)).to.eql({one: 'one', two: 'two', three: [1, 2], x: 'x'})

        })
    })
})

