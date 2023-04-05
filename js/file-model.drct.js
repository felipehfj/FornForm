(function () {
    'use strict';
    /* recommended */
    /* file-model.drct.js */

    /**
     * @desc file model directive
     * @example <input fileModel=""></div>
     */
    angular
        .module('TestApp')
        .directive('fileModel', fileModel);

    fileModel.$inject = ['$parse'];

    function fileModel($parse) {
        /* implementation details */
        var directive = {
            require: 'ngModel',
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, element, attrs, ctrl) {
            var model = $parse(attrs.ngModel);
            var isMultiple = attrs.multiple;
            var acceptfiles = getAcceptedFiles(attrs.accept);
            var modelSetter = model.assign;

            element.bind('change', function () {
                console.log('changeFile');
                scope.$apply(function () {
                    var files = element[0].files;

                    if (isMultiple) {
                        if (!!files && files.lenght > 0) {
                            files.forEach(file => {
                                if (isExtensionValid(file.name, acceptfiles) == false) {
                                    ctrl.$setValidity('fileExtension', false);
                                    return;
                                }
                            });
                            modelSetter(scope, files);
                            ctrl.$setValidity('fileModel', true);
                        } else {
                            modelSetter(scope, '');
                        }
                    } else {
                        var file = files[0];
                        if (!!file) {
                            if (isExtensionValid(file.name, acceptfiles)) {
                                modelSetter(scope, files[0]);
                                ctrl.$setValidity('fileExtension', true);
                            } else {
                                ctrl.$setValidity('fileExtension', false);
                            }
                        } else {
                            modelSetter(scope, '');
                        }
                    }
                });
            });
        };


        function isExtensionValid(filename, accepted) {
            let ext = getExtension(filename);

            return accepted.includes(ext);
        }

        function getExtension(filename) {
            let pattern = /\.[0-9a-z]+$/i;

            return filename.match(pattern)[0] ?? '';
        }

        function getAcceptedFiles(accept) {
            return !!accept ? accept.split(",") : ['*'];
        }

    }
})();