describe('Service: scrollie', function () {
    var element;
    var mocks;

    function resetMocks() {
        mocks = {
            requestAnimation: function () {},
            cancelAnimation: function () {}
        };
    }
    resetMocks();

    beforeEach(module('scrollie'));

    beforeEach(module(function ($provide) {
        $provide.value('requestAnimation', mocks.requestAnimation);
        $provide.value('cancelAnimation', mocks.cancelAnimation);
    }));

    beforeEach(function () {
        var html = [
            '<div style="height: 100px; overflow: auto">',
            '<div style="height: 1000px"></div>',
            '</div>'
        ].join('');
        element = angular.element(html);
        angular.element(document).find('body').append(element);
    });

    afterEach(function () {
        angular.element(document).find('body').empty();
    });

    it('provides a \'to\' function and a \'stop\' function', inject(function (scrollie) {
        expect(scrollie.to, 'to be a function');
        expect(scrollie.stop, 'to be a function');
    }));

    describe('.to', function () {
        var scrollie;

        beforeEach(function () {
            // create a mock requestAnimation that calls the animation function
            // syncronously
            sinon.stub(mocks, 'requestAnimation').callsFake(function (animate) {
                animate();
            });
        });

        afterEach(resetMocks);

        // this inject() call has to come after the beforeEach above so that the
        // mock variables are replaced BEFORE the injector is initialised
        beforeEach(inject(function (_scrollie_) {
            scrollie = _scrollie_;
        }));

        it('sets the scrollTop without animating if duration is not provided', function () {
            scrollie.to(element, 10);
            expect(element[0].scrollTop, 'to be', 10);
            expect(mocks.requestAnimation, 'was not called');
        });

        it('sets the scrollTop without animating if duration provided is zero', function () {
            scrollie.to(element, 10, 0);
            expect(element[0].scrollTop, 'to be', 10);
            expect(mocks.requestAnimation, 'was not called');
        });

        it('sets the scrollTop without animating if duration provided is less than zero', function () {
            scrollie.to(element, 10, -10);
            expect(element[0].scrollTop, 'to be', 10);
            expect(mocks.requestAnimation, 'was not called');
        });

        it('sets the scrollTop without animating if duration provided is not a number', function () {
            scrollie.to(element, 10, 'bad');
            expect(element[0].scrollTop, 'to be', 10);
            expect(mocks.requestAnimation, 'was not called');
        });

        it('sets the scrollTop without animating if duration provided is <= 20ms', function () {
            scrollie.to(element, 10, 20);
            expect(element[0].scrollTop, 'to be', 10);
            expect(mocks.requestAnimation, 'was not called');
        });

        it('does nothing if the new scrollTop is not provided', function () {
            scrollie.to(element);
            expect(mocks.requestAnimation, 'was not called');
        });

        it('does nothing if the new scrollTop is not a number', function () {
            scrollie.to(element, 'bad');
            expect(mocks.requestAnimation, 'was not called');
        });

        it('does nothing if element is not provided', function () {
            scrollie.to();
            expect(mocks.requestAnimation, 'was not called');
        });

        it('does nothing if element is not an angular element', function () {
            scrollie.to('bad');
            expect(mocks.requestAnimation, 'was not called');
        });

        it('animates scrollTop if a duration is provided', function () {
            scrollie.to(element, 400, 400);
            expect(element[0].scrollTop, 'to be', 400);
            expect(mocks.requestAnimation, 'was called');
        });

        it('animates scrollTop in increments of 20ms', function () {
            scrollie.to(element, 41, 80);
            expect(element[0].scrollTop, 'to be', 41);
            expect(mocks.requestAnimation, 'to have calls satisfying', function () {
                // i.e. n = (400/20) - 1. it doesn't get called when duration
                // equals 20ms (the last animation cycle)
                mocks.requestAnimation(expect.it('to be a function'), 20);
                mocks.requestAnimation(expect.it('to be a function'), 20);
                mocks.requestAnimation(expect.it('to be a function'), 20);
            });
        });

        it('returns a promise object', function () {
            // TODO: for some reason, this fails:
            // expect(scrollie.to(element, 10), 'to be fulfilled');
            expect(scrollie.to(element, 10).then, 'to be a function');
        });

        it('resolves the promise when animation is complete', inject(function ($rootScope) {
            var success = sinon.spy().named('success');
            scrollie.to(element, 400, 20).then(success);
            expect(element[0].scrollTop, 'to be', 400);
            // the 'then' function is not called synchronously since the promise
            // API is designed to be async, whether or not it was called
            // synchronously (from the Angular docs)
            expect(success, 'was not called');
            // propagate resolution to the 'then' function
            $rootScope.$apply();
            expect(success, 'was called once');
        }));

        it('resolves the promise even if the provided scrollTop is the same as the current scrollTop', inject(function ($rootScope) {
            var success1 = sinon.spy().named('success1');
            var success2 = sinon.spy().named('success2');
            scrollie.to(element, 400, 40).then(success1);
            expect(element[0].scrollTop, 'to be', 400);
            scrollie.to(element, 400, 40).then(success2);
            expect(element[0].scrollTop, 'to be', 400);
            $rootScope.$apply();
            expect(success1, 'was called once');
            expect(success2, 'was called once');
        }));

        it('resolves the promise immediately if not animating', inject(function ($rootScope) {
            var success = sinon.spy().named('success');
            scrollie.to(element, 400).then(success);
            expect(element[0].scrollTop, 'to be', 400);
            expect(mocks.requestAnimation, 'was not called');
            $rootScope.$apply();
            expect(success, 'was called once');
        }));

        it('allows changing the default easing', function () {
            var easing = sinon.spy().named('easing');
            scrollie.to(element, 400, 40, easing);
            expect(easing, 'was called');
        });

        it('ignores the easing param if duration is zero', function () {
            var easing = sinon.spy().named('easing');
            scrollie.to(element, 400, 0, easing);
            expect(easing, 'was not called');
        });

        it('only accepts functions as easing', function () {
            var easing = sinon.spy().named('easing');
            scrollie.to(element, 400, 40, { bad: easing });
            expect(easing, 'was not called');
        });

    });

    describe('', function () {
        var scrollie;
        var $timeout;

        beforeEach(function () {
            sinon.stub(mocks, 'requestAnimation').callsFake(function (animate, delay) {
                return $timeout(animate, delay);
            });
            sinon.stub(mocks, 'cancelAnimation').callsFake(function (timeout) {
                return $timeout.cancel(timeout);
            });
        });

        afterEach(resetMocks);

        beforeEach(inject(function (_scrollie_, _$timeout_) {
            scrollie = _scrollie_;
            $timeout = _$timeout_;
        }));

        it('.to stops any current animations (does not queue them up)', function () {
            scrollie.to(element, 200, 100);
            expect(element[0].scrollTop, 'not to be', 200); // to ensure that at this point the animation is still ongoing
            expect(mocks.cancelAnimation, 'was not called');
            scrollie.to(element, 400); // call scrollie.to() without animation so we're able to assert the scrollTop in the same tick
            expect(mocks.cancelAnimation, 'was called'); // previous animation should have been cancelled
            expect(element[0].scrollTop, 'to be', 400);
        });

        it('.to rejects any current animation promises', inject(function ($rootScope) {
            var rejected = sinon.spy().named('rejected');
            scrollie.to(element, 200, 100).catch(rejected);
            expect(element[0].scrollTop, 'not to be', 200); // to ensure that at this point the animation is still ongoing
            expect(rejected, 'was not called');
            scrollie.to(element, 400); // call scrollie.to() without animation so we're able to assert the scrollTop in the same tick
            $rootScope.$apply();
            expect(rejected, 'was called'); // previous animation promise should have been rejected
            expect(element[0].scrollTop, 'to be', 400);
        }));

        it('.stop stops any currently running animation', function () {
            scrollie.to(element, 200, 100);
            expect(element[0].scrollTop, 'not to be', 200);
            expect(mocks.cancelAnimation, 'was not called');
            scrollie.stop(element);
            expect(mocks.cancelAnimation, 'was called');
            expect(function () {
                $timeout.flush();
            }, 'to error'); // there shouldn't be any animations running
        });

        it('.stop rejects the promise object', inject(function ($rootScope) {
            var rejected = sinon.spy().named('rejected');
            scrollie.to(element, 200, 100).catch(rejected);
            scrollie.stop(element);
            $rootScope.$apply();
            expect(rejected, 'was called');
        }));

        it('.stop does nothing if there\'s no animation running', function () {
            scrollie.stop(element);
            expect(mocks.cancelAnimation, 'was not called');
        });

        it('.stop does nothing if previous animations have been .stop\'d', inject(function ($rootScope) {
            var rejected = sinon.spy().named('rejected');
            scrollie.to(element, 200, 100).catch(rejected);
            scrollie.stop(element);
            $rootScope.$apply();
            expect(rejected, 'was called');
            expect(mocks.cancelAnimation, 'was called');
            rejected.resetHistory();
            mocks.cancelAnimation.resetHistory();
            scrollie.stop(element);
            $rootScope.$apply();
            expect(rejected, 'was not called');
            expect(mocks.cancelAnimation, 'was not called');
        }));
    });
});
