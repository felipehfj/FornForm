(function () {
  'use strict';

  /* Controllers */

  angular
    .module('TestApp')
    .controller('FormResponseController', FormResponseController);

  FormResponseController.$inject = ['$scope', '$http', 'toastr', 'FornFormUtilsService', '_'];

  function FormResponseController($scope, $http, toastr, FFUService, _) {
    var vm = this;

    vm.form = {
      slideIndex: 1,
      file: {},
      structure: [],
      slideTo: function (n) {
        console.log('slideTo',n)
        this.showSlide(this.slideIndex += n);
      },
      showSlide: function (n) {
        var i;
        var x = document.getElementsByClassName("slide");

        console.log(x.length);
        if (n > x.length) { this.slideIndex = 1 }
        if (n < 1) { this.slideIndex = x.length }
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";
        }

        x[this.slideIndex - 1].style.display = "block";
      },
      join: function (elements) {
        return elements.join(',');
      },
      loadFile: function () {
        function onChange(event) {
          var reader = new FileReader();
          reader.onload = onReaderLoad;
          reader.readAsText(event.target.files[0]);
        }

        function onReaderLoad(event) {
          console.log(event.target.result);
          vm.form.structure = angular.fromJson(event.target.result);
          toastr.info('Arquivo carregado com sucesso', 'Sucesso');
          setTimeout(() => vm.form.showSlide(vm.form.slideIndex), 100);

        }

        document.getElementById('file').addEventListener('change', onChange);

      },
      downloadAsJson: function (exportName) {
        let id = FFUService.makeid(5);
        let filename = exportName ?? `Preliminar_${id}`
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(angular.toJson(this.structure, true));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${filename}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      },
      validateForm: function () {

      }
    }

    function init() {
      vm.form.loadFile();
    }

    init();
  };
})();