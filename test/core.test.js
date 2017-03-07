/**
 * core.test.js
 *
 * Created by xiepan on 2017/2/10 上午9:26.
 */

// add
// addClass
// after
// append
// appendTo
// attr
// before
// children
// clone
// closest
// concat
// contents
// css
// data
// each          √
// empty         √
// eq            √
// filter        ×
// find          ×
// first         √
// forEach       √
// get           √
// has           ×
// hasClass
// height
// hide
// html
// index
// indexOf       √
// insertAfter
// insertBefore
// is            √
// last          √
// map           ×
// next
// not           ×
// offset
// offsetParent
// parent
// parents
// pluck         √
// position
// prepend
// prependTo
// prev
// prop
// push          √


describe('CORE', function () {

    describe('each', function () {
        it("each", function () {
            var index
            $('#eachtest > *').each(function (idx, el) {
                index = idx
                expect(el).to.equal(this)
            })
            expect(index).to.equal(2)
        })
    });

    describe('empty', function () {
        it('empty', function () {
            $('#emptytest').empty()

            expect(document.getElementById('empty1')).to.be.null
            expect(document.getElementById('empty2')).to.be.null
            expect(document.getElementById('empty3')).to.be.null
        })
    })

    describe('eq', function () {
        it('eq', function () {
            expect($('#eqtest li').eq(-1)[0].className).to.equal('eq2')// last item
            expect($('#eqtest li').eq(0)[0].tagName.toLowerCase()).to.equal('li')// first item
            expect($('#eqtest li').eq(1)[0].className).to.equal('eq2')
        })
    })

    describe('first', function () {
        it('first', function () {
            expect($('#nested li').first().get(0).textContent).to.equal('one')
            expect($('#nested li').first().length).to.equal(1)
        })
    })
    describe('forEach', function () {
        it('forEach', function () {
            var index
            $('#nested li').forEach(function (el, idx, array) {
                index = idx
                expect(el.tagName.toLowerCase()).to.equal('li')
            })
            expect(index).to.equal(2)
        })
    })

    describe('get', function () {
        it('get', function () {
            expect($('#nested li').get().length).to.equal(3)
            expect($('#nested li').get(1).textContent).to.equal('two')
            expect($('#nested li').get(2).textContent).to.equal('three')
        })
    })

    // describe('has', function () {
    //     it('has', function () {
    //         console.log($('#nested').has('li[id=li2]'))
    //     })
    // })

    describe('indexOf', function () {
        it('indexOf', function () {
            //TODO nativemethod
        })
    })

    describe('is', function () {
        it('is', function () {
            expect($('#nested li').is('li[id=li2]')).to.equal(true)
            expect($('#nested li').is('li')).to.equal(true)
            expect($('#nested li').is('ul')).to.equal(false)
        })
    })

    describe('last', function () {
        it('last', function () {
            expect($('#nested li').last().get(0).textContent).to.equal('three')
            expect($('#nested li').last().length).to.equal(1)
        })
    })

    describe('pluck', function () {
        it('pluck', function () {
            expect($('#nested li').last().get(0).textContent).to.equal('three')
            expect($('#nested li').last().length).to.equal(1)
        })
    })

// ready         √
// reduce        √
// remove        √
// removeAttr
// removeClass
// removeProp
// replaceWith
// scrollLeft
// scrollTop
// show
// siblings
// size          √
// slice         √
// text
// toggle
// toggleClass
// unwrap
// val
// width
// wrap
// wrapAll
// wrapInner

    describe('ready', function () {
        it('ready', function () {

        })
    })

    describe('reduce', function () {
        it('reduce', function () {
            // $('#nested li').reduce(function (accumulator, currentValue,
            //                                  currentIndex, array) {
            //     console.log(accumulator)
            //     console.log(currentValue)
            //     console.log(currentIndex)
            //     console.log(array)
            // })
        })
    })

    describe('remove', function () {
        it('remove', function () {
            expect($('#removetest').get()).to.not.be.null
            $('#removetest').remove()
            expect($('#removetest').get()).to.be.empty
        })
    })

    describe('size', function () {
        it('size', function () {
            expect($('#nested li').size()).to.equal(3)
        })
    })

    describe('slice', function () {
        it('slice', function () {

        })
    })
})