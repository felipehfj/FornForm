(function () {
	'use strict';

	/* Controllers */

	angular
		.module('TestApp')
		.controller('TestController', TestController);

	TestController.$inject = ['$scope', '$http', 'toastr', 'FornFormUtilsService', '_', 'FornForm'];

	function TestController($scope, $http, toastr, FFUService, _, FornForm) {
		var vm = this;

		vm.c = {
			d: "Felipe",
			b: () => toastr.info('ola', 'teste'),
			uid: () => toastr.info(`${FFUService.makeid(8)}`, 'uid'),
			uuid: () => toastr.success(`${FFUService.UUIDv4()}`, 'uid'),
			s: () => _.multiply(2, 3),
			structure: [],
			section: () => {
				let [secId] = FornForm.createSection(vm.c.structure);

				// let elLabel = FornForm.createElement(FFUService.FormElementType.Label);
				// let elText = FornForm.createElement(FFUService.FormElementType.Text);
				// let elParagraph = FornForm.createElement(FFUService.FormElementType.Paragraph);
				// let elNumber = FornForm.createElement(FFUService.FormElementType.Number);
				// let elEmail = FornForm.createElement(FFUService.FormElementType.Email);
				// let elDate = FornForm.createElement(FFUService.FormElementType.Date);
				// let elRadio = FornForm.createElement(FFUService.FormElementType.Radio);
				// let elSingleSelect = FornForm.createElement(FFUService.FormElementType.SingleSelect);
				// let elMultipleSelect = FornForm.createElement(FFUService.FormElementType.MultipleSelect);
				// let elFile = FornForm.createElement(FFUService.FormElementType.File);

				// FornForm.addElementToSection(vm.c.structure, secId, elLabel);
				// FornForm.addElementToSection(vm.c.structure, secId, elText);
				// FornForm.addElementToSection(vm.c.structure, secId, elParagraph);
				// FornForm.addElementToSection(vm.c.structure, secId, elNumber);
				// FornForm.addElementToSection(vm.c.structure, secId, elEmail);
				// FornForm.addElementToSection(vm.c.structure, secId, elDate);
				// FornForm.addElementToSection(vm.c.structure, secId, elRadio);
				// FornForm.addElementToSection(vm.c.structure, secId, elSingleSelect);
				// FornForm.addElementToSection(vm.c.structure, secId, elMultipleSelect);
				// FornForm.addElementToSection(vm.c.structure, secId, elFile);


				console.log(vm.c.structure);

				return vm.c.structure;
			},
			addElementToSection: (elementType, sectionId) => {
				let el = FornForm.createElement(elementType);
				FornForm.addElementToSection(vm.c.structure, sectionId, el);
			},
			deleteSectionById: (sectionId) => {
				FornForm.deleteSectionById(vm.c.structure, sectionId);
			},
			deleteElementFromSectionById: (sectionId, elementId) => {
				FornForm.deleteElementFromSectionById(vm.c.structure, sectionId, elementId);
			},
		};

		function init() {
			vm.c.section()
		};

		init();
	};
})();