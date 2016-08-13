describe('Services: requestAnimation & cancelAnimation', function () {
    var mockWindow;
    var mockTimeout;

    beforeEach(function () {
        mockTimeout = {};
        mockTimeout.timeout = sinon.spy().named('timeout');
        mockTimeout.timeout.cancel = sinon.spy().named('timeoutCancel');

        mockWindow = {
            requestAnimationFrame: function () {
                return 'requestAnimationFrame';
            },
            cancelAnimationFrame: function () {
                return 'cancelAnimationFrame';
            },
            webkitRequestAnimationFrame: function () {
                return 'webkitRequestAnimationFrame';
            },
            webkitCancelAnimationFrame: function () {
                return 'webkitCancelAnimationFrame';
            },
            webkitCancelRequestAnimationFrame: function () {
                return 'webkitCancelRequestAnimationFrame';
            },
            mozRequestAnimationFrame: function () {
                return 'mozRequestAnimationFrame';
            },
            mozCancelAnimationFrame: function () {
                return 'mozCancelAnimationFrame';
            },
            navigator: {
                userAgent: ''
            }
        };
    });

    beforeEach(module('scrollie'));

    beforeEach(module(function ($provide) {
        $provide.value('$window', mockWindow);
        $provide.value('$timeout', mockTimeout.timeout);
    }));

    describe('on modern browsers', function () {
        it('return the unprefixed functions', inject(function (requestAnimation, cancelAnimation) {
            expect(requestAnimation(), 'to be', 'requestAnimationFrame');
            expect(cancelAnimation(), 'to be', 'cancelAnimationFrame');
            expect(mockTimeout.timeout, 'was not called');
            expect(mockTimeout.timeout.cancel, 'was not called');
        }));
    });

    describe('on old webkit browsers', function () {
        beforeEach(function () {
            mockWindow.requestAnimationFrame = undefined;
            mockWindow.cancelAnimationFrame = undefined;
        });

        it('return the legacy webkit functions', inject(function (requestAnimation, cancelAnimation) {
            expect(requestAnimation(), 'to be', 'webkitRequestAnimationFrame');
            expect(cancelAnimation(), 'to be', 'webkitCancelAnimationFrame');
            expect(mockTimeout.timeout, 'was not called');
            expect(mockTimeout.timeout.cancel, 'was not called');
        }));
    });

    describe('on old webkit browsers, cancelAnimation', function () {
        beforeEach(function () {
            mockWindow.cancelAnimationFrame = undefined;
            mockWindow.mozCancelAnimationFrame = undefined;
            mockWindow.webkitCancelAnimationFrame = undefined;
        });

        it('may also return webkitCancelRequestAnimationFrame', inject(function (cancelAnimation) {
            expect(cancelAnimation(), 'to be', 'webkitCancelRequestAnimationFrame');
            expect(mockTimeout.timeout, 'was not called');
            expect(mockTimeout.timeout.cancel, 'was not called');
        }));
    });

    describe('on old mozilla browsers', function () {
        beforeEach(function () {
            mockWindow.requestAnimationFrame = undefined;
            mockWindow.cancelAnimationFrame = undefined;
            mockWindow.webkitRequestAnimationFrame = undefined;
            mockWindow.webkitCancelAnimationFrame = undefined;
            mockWindow.webkitCancelRequestAnimationFrame = undefined;
        });

        it('return the legacy mozilla functions', inject(function (requestAnimation, cancelAnimation) {
            expect(requestAnimation(), 'to be', 'mozRequestAnimationFrame');
            expect(cancelAnimation(), 'to be', 'mozCancelAnimationFrame');
            expect(mockTimeout.timeout, 'was not called');
            expect(mockTimeout.timeout.cancel, 'was not called');
        }));
    });

    describe('on old browsers', function () {
        beforeEach(function () {
            mockWindow.requestAnimationFrame = undefined;
            mockWindow.cancelAnimationFrame = undefined;
            mockWindow.webkitRequestAnimationFrame = undefined;
            mockWindow.webkitCancelAnimationFrame = undefined;
            mockWindow.webkitCancelRequestAnimationFrame = undefined;
            mockWindow.mozRequestAnimationFrame = undefined;
            mockWindow.mozCancelAnimationFrame = undefined;
        });

        it('return a timeout promise and cancel function respectively', inject(function (requestAnimation, cancelAnimation) {
            requestAnimation();
            expect(mockTimeout.timeout, 'was called once');
            expect(mockTimeout.timeout.cancel, 'was not called');
            cancelAnimation();
            expect(mockTimeout.timeout.cancel, 'was called once');
        }));
    });

    describe('on iOS 6', function () {
        beforeEach(function () {
            mockWindow.navigator.userAgent = 'iPhone OS 6';
        });

        it('return a timeout promise and cancel function respectively', inject(function (requestAnimation, cancelAnimation) {
            requestAnimation();
            expect(mockTimeout.timeout, 'was called once');
            expect(mockTimeout.timeout.cancel, 'was not called');
            cancelAnimation();
            expect(mockTimeout.timeout.cancel, 'was called once');
        }));
    });

    describe('on iOS 7', function () {
        beforeEach(function () {
            mockWindow.navigator.userAgent = 'iPhone OS 7';
        });

        it('return the unprefixed functions', inject(function (requestAnimation, cancelAnimation) {
            expect(requestAnimation(), 'to be', 'requestAnimationFrame');
            expect(cancelAnimation(), 'to be', 'cancelAnimationFrame');
            expect(mockTimeout.timeout, 'was not called');
            expect(mockTimeout.timeout.cancel, 'was not called');
        }));
    });
});
