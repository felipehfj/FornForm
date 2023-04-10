(function () {
  'use strict';

  /* Controllers */

  angular
    .module('TestApp')
    .controller('FormResponseController', FormResponseController);

  FormResponseController.$inject = ['$scope', '$http', '$location', 'toastr', 'FornFormUtilsService', '_'];

  function FormResponseController($scope, $http, $location, toastr, FFUService, _) {
    var vm = this;

    vm.form = {
      control: {
        isFirst: false,
        isLast: false,
        canSubmit: false,
        navIndex: 0,
        navigationPath: [],
        setIsFirst: function (state) {
          this.isFirst = state;
        },
        setIsLast: function (state) {
          this.isLast = state;
        },
        setCanSubmit: function (state) {
          this.canSubmit = state;
        },
        setNavIndex: function (state) {
          this.navIndex = state;
        },
        setNavigationPath: function (state) {
          this.navigationPath = state;
        },
        verifyIsFirst: function (sectionId, navigationPath) {
          return _.includes(navigationPath, sectionId) && (_.first(navigationPath) === sectionId);
        },
        verifyIsLast: function (sectionId, navigationPath) {
          return _.includes(navigationPath, sectionId) && (_.last(navigationPath) === (sectionId && sectionId === 'submit'));
        },
        goToPreviousSection: function () {
          this.setNavIndex(vm.form.control.navIndex > 0 ? vm.form.control.navIndex - 1 : 0);
          this.setIsLast(false);

          vm.form.showSlide(this.getSlideIndexById(this.navigationPath[this.navIndex]));
          vm.form.control.navigationPath.pop();
        },
        goToNextSection: function (nextNavigation, currentSectionId) {
          let toAdd = '';
          if (vm.form.structure) {
            switch (nextNavigation) {
              case FFUService.NavigationType.NextSection:
                let idx = _.findIndex(vm.form.structure, ['id', currentSectionId]);
                if (idx !== -1) {
                  toAdd = vm.form.structure[idx + 1].id ?? 'submit';
                } else {
                  toAdd = 'submit';
                }
                break;
              case FFUService.NavigationType.EndForm:
                toAdd = 'submit';
                break;
              default:
                toAdd = nextNavigation;
                break;
            }

            this.setNavIndex(this.navIndex + 1);
            this.setNavigationPath([...this.navigationPath, toAdd]);
            vm.form.showSlide(this.getSlideIndexById(this.navigationPath[this.navIndex]));
          }
        },
        getSlideIndexById: function (id) {
          let idx = _.findIndex(vm.form.structure, ['id', id]);
          if (idx !== -1) {
            return idx;
          } else {
            return null;
          }
        },
        setSectionNavigationOnOptionSelect: function (section, navigation) {
          section.navigation = navigation;
        }
      },
      file: {},
      structure: [],
      prepareStructureToResponse: function (form) {
        const addSubmitSection = function (structure) {
          let newStructure = structure;
          let submitSection = {
            id: 'submit',
            order: structure.length,
            type: "submit",
            title: `Envio do formulário`,
            description: "",
            navigation: FFUService.NavigationType.SubmitForm,
            elements: []
          }
          newStructure.push(submitSection);
          vm.form.structure = newStructure;
        };
        const updateFormControl = function (structure) {
          if (structure) {
            vm.form.control.setNavigationPath([structure[0].id]);
            if (structure.length === 1) {
              vm.form.control.setIsLast(false);
              vm.form.control.setIsFirst(true);
            }

            if (structure.length > 1) {
              vm.form.control.setIsLast(false);
              vm.form.control.setIsFirst(true);
            }
          }
        };

        vm.form.setStructure(form);
        addSubmitSection(vm.form.structure);
        updateFormControl(vm.form.structure);

        setTimeout(() => vm.form.showSlide(vm.form.control.navIndex), 100);
      },
      setStructure: function (structure) {
        this.structure = structure;
      },
      showSlide: function (n) {
        var i;
        var x = document.getElementsByClassName("slide");
        if (x && x.length > 0) {
          for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
          }
          x[n].style.display = "block";
        }
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
          let form = angular.fromJson(event.target.result)
          vm.form.prepareStructureToResponse(form);
          toastr.info('Arquivo carregado com sucesso', 'Sucesso', { timeOut: 100 });
        }

        document.getElementById('file').addEventListener('change', onChange);

      },
      getFileFromServer: function (id) {
        $http.get(`http://localhost:3000/forms/${id}.json`, {
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
          .then((res) => {
            let { data } = res;
            let form = angular.fromJson(data)
            vm.form.prepareStructureToResponse(form);
            toastr.info('Arquivo carregado com sucesso', 'Sucesso', { timeOut: 1000 });
          })
          .catch(err => {
            toastr.error(`Erro: ${err.status}`, 'Xiiiii!!!!')
          });
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
      hasAlmostOne: function (value) {
        if (!!value && value.length > 0) {
          let i = 0;
          for (i; i < value.length; i++) {
            if (value[i]) return true;
          }
        }
        return false;
      },
    }

    $scope.$watch("ctrl.form.control.navIndex", function (newValue, oldValue) {
      if (vm.form.structure && vm.form.structure.length > 0) {
        vm.form.control.setIsFirst(vm.form.control.verifyIsFirst(vm.form.structure[newValue].id, vm.form.control.navigationPath));
        vm.form.control.setIsLast(vm.form.control.verifyIsLast(vm.form.structure[newValue].id, vm.form.control.navigationPath));
      }
    });

    function init() {
      //vm.form.loadFile();
      var id = 1;

      let absUrl = $location.absUrl();
      let splited = absUrl.split('?');
      if (splited.length > 1) {
        let params = new URLSearchParams(splited[1]);
        id = params.has('id') ? params.get('id') : 1;
      }
      vm.form.getFileFromServer(id);
    }

    init();
  };
})();