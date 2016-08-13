describe('Module: scrollie', function () {
    it('is created', function () {
        var app;
        expect(function () {
            app = angular.module('scrollie');
        }, 'not to error');
        expect(app, 'to be defined');
    });
});
