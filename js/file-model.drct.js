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
          restrict: 'A',
          link: link
      };

      return directive;

      function link(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var isMultiple = attrs.multiple;
          var modelSetter = model.assign;

          element.bind('change', function () {
              scope.$apply(function () {
                  if (isMultiple) {
                      modelSetter(scope, element[0].files);
                  } else {
                      modelSetter(scope, element[0].files[0]);
                  }
              });
          });
      }
  }
})();