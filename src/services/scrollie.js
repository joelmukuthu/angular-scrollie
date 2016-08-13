// this is built upon http://stackoverflow.com/a/16136789/1004406
angular
.module('scrollie')
.factory('scrollie', ['$q', 'requestAnimation', 'cancelAnimation',
    function ($q, requestAnimation, cancelAnimation) {
        function easeInOutQuad(time, start, change, duration) {
            time /= duration / 2;
            if (time < 1) {
                return change / 2 * time * time + start;
            }
            time--;
            return -change / 2 * (time * (time - 2) - 1) + start;
        }

        function clearData(element) {
            element.data('___scrollie_animation___', null);
            element.data('___scrollie_promise___', null);
        }

        function stopAnimation(element) {
            var animation = element.data('___scrollie_animation___');
            if (animation) {
                cancelAnimation(animation);
            }

            var animationPromise = element.data('___scrollie_promise___');
            if (animationPromise) {
                animationPromise.reject();
            }

            clearData(element);
        }

        return {
            to: function (element, top, duration, easing) {
                if (!angular.isElement(element) || !angular.isNumber(top)) {
                    return;
                }

                stopAnimation(element);

                var deferred = $q.defer();

                duration = parseInt(duration, 10);
                if (duration <= 0 || isNaN(duration)) {
                    element[0].scrollTop = top;
                    deferred.resolve();
                    return deferred.promise;
                }

                if (typeof easing !== 'function') {
                    easing = easeInOutQuad;
                }

                var start = element[0].scrollTop;
                var change = top - start;
                var currentTime = 0;
                var timeIncrement = 20;
                function animate() {
                    currentTime += timeIncrement;
                    element[0].scrollTop = easing(currentTime, start, change, duration);
                    if (currentTime < duration) {
                        var animation = requestAnimation(animate, timeIncrement);
                        element.data('___scrollie_animation___', animation);
                    } else {
                        clearData(element);
                        deferred.resolve();
                    }
                }

                animate();
                element.data('___scrollie_promise___', deferred);
                return deferred.promise;
            },

            stop: function (element) {
                stopAnimation(element);
            }
        };
    }
]);
