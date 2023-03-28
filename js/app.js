(function () {
  'use strict';
  // Declare app level module which depends on filters, and services
  const depends = [
    'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'ui.select',
    'toastr'
  ];

  angular
    .module('TestApp', depends)    
    .config(function (toastrConfig) {
      angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body',
        allowHtml: true,
        closeButton: true,
        closeHtml: '<button>&times;</button>',
        extendedTimeOut: 2000,
        iconClasses: {
          error: 'toast-error',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        onHidden: null,
        onShown: null,
        onTap: null,
        progressBar: false,
        tapToDismiss: false,
        templates: {
          toast: 'directives/toast/toast.html',
          progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
      });
    })
    .constant('_', window._)
    .run(function($rootScope){
      $rootScope._=window._;
    });
})();