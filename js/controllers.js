(function () {
	'use strict';

	/* Controllers */

	angular
		.module('TestApp')
		.controller('TestController', TestController);

	TestController.$inject = ['$scope', '$http', 'toastr', 'FornFormUtilsService', '_'];

	function TestController($scope, $http, toastr, FFUService, _) {
		var vm = this;

		vm.form = {
			structure: [],
			routes: [{ title: "Próxima seção", route: FFUService.NavigationType.NextSection }, { title: "Fim do formulário", route: FFUService.NavigationType.EndForm }],
			addSectionToStructure: function (index) {
				let order = 0;
				if (index) {
					order = index
				} else {
					order = this.structure.length ?? 0;
				}


				let sectionId = FFUService.makeid(8);
				let section = {
					id: sectionId,
					order: order,
					type: "section",
					title: `Seção ${order + 1}`,
					description: "",
					navigation: FFUService.NavigationType.NextSection,
					elements: []
				}

				Object.assign(section, { order: order })

				this.structure.splice(order, 0, section);

				if (this.structure.length > 0) {
					this.structure.forEach((el, index) => { el.order = index });
				}

				this.updateNavigationRoutes();
			},
			deleteSectionById: function (sectionId) {
				let newStructure = this.structure.filter(el => el.id != sectionId);
				if (newStructure.length > 0) {
					newStructure.forEach((el, index) => { el.order = index });
				}
				this.structure = newStructure;

				this.updateNavigationRoutes();
				this.updateSectionNavigationRoutes();				
			},
			addElementToSection: function (elementType, sectionId) {

				const findSectionById = (i) => { return i.id == sectionId; }
				let innerSection = _.find(this.structure, findSectionById);
				let sectionIndex = _.findIndex(this.structure, findSectionById);

				let element = this.createElement(elementType);

				let elementOrder = innerSection.elements.length;
				innerSection.elements.push({ ...element, order: elementOrder });

				this.structure[sectionIndex] = innerSection;
			},
			deleteElementFromSectionById: function (sectionId, elementId) {
				const findSectionById = (i) => { return i.id == sectionId; }
				let innerSection = _.find(this.structure, findSectionById);
				let sectionIndex = _.findIndex(this.structure, findSectionById);

				let innerSectionElements = innerSection.elements.filter((i) => i.id !== elementId);

				innerSectionElements = _.each(innerSectionElements, (el, index) => { el.order = index });

				innerSection.elements = innerSectionElements;

				this.structure[sectionIndex] = innerSection;
			},
			createElement: function createElement(type) {
				let elementId = FFUService.makeid(8);
				let element = {
					id: elementId,
					order: 0,
					type: "",
					required: false,
					title: "Nova pergunta",
					description: "",
					usePunctuation: false,
					punctuation: 0,
					options: [],
					response: [],
					useCorrectAnswers: false,
					correctAnswers: [],
					navigation: FFUService.NavigationType.NextSection
				};

				switch (type) {
					case FFUService.FormElementType.Label:
						Object.assign(element, { type: FFUService.FormElementType.Label, title: "" });
						break;
					case FFUService.FormElementType.Text:
						Object.assign(element, { type: FFUService.FormElementType.Text });
						break;
					case FFUService.FormElementType.Paragraph:
						Object.assign(element, { type: FFUService.FormElementType.Paragraph });
						break;
					case FFUService.FormElementType.Number:
						Object.assign(element, { type: FFUService.FormElementType.Number });
						break;
					case FFUService.FormElementType.Email:
						Object.assign(element, { type: FFUService.FormElementType.Email });
						break;
					case FFUService.FormElementType.Date:
						Object.assign(element, { type: FFUService.FormElementType.Date });
						break;
					case FFUService.FormElementType.Radio:
						let radioOptions = [
							{
								id: FFUService.makeid(8),
								order: 0,
								name: elementId,
								title: "Nova opção",
								description: "",
								value: "nova opção",
								checked: false,
							}
						]

						Object.assign(element, { type: FFUService.FormElementType.Radio, options: radioOptions });
						break;
					case FFUService.FormElementType.SingleSelect:
						let selectOptions = [
							{
								id: FFUService.makeid(8),
								order: 0,
								name: elementId,
								title: "Nova opção",
								description: "",
								value: "Nova opção",
								checked: false,
							}
						]
						Object.assign(element, { type: FFUService.FormElementType.SingleSelect, options: selectOptions });
						break;
					case FFUService.FormElementType.MultipleSelect:
						let id = FFUService.makeid(8);
						let multipleOptions = [
							{
								id: id,
								order: 0,
								name: id,
								title: "Nova opção",
								description: "",
								value: "nova opção",
								checked: false,
							}
						]

						Object.assign(element, { type: FFUService.FormElementType.MultipleSelect, options: multipleOptions });
						break;
					case FFUService.FormElementType.File:
						Object.assign(element, { type: FFUService.FormElementType.File });
						break;
					default: break;
				}
				return element;

			},
			changeElementOrder: function (sectionId, element, type) {
				const findSectionById = (i) => { return i.id == sectionId; }

				let sectionIndex = _.findIndex(this.structure, findSectionById);

				if (this.structure[sectionIndex].elements.length <= 1) return;

				let elementIndex = element.order;

				switch (type) {
					case 'up':
						if (elementIndex == 0) return;

						let prevElement = this.structure[sectionIndex].elements[elementIndex - 1];

						prevElement.order = elementIndex
						element.order = elementIndex - 1

						this.structure[sectionIndex].elements[elementIndex - 1] = element;
						this.structure[sectionIndex].elements[elementIndex] = prevElement;

						break;
					case 'down':
						if (elementIndex == this.structure[sectionIndex].elements.length - 1) return;

						let nextElement = this.structure[sectionIndex].elements[elementIndex + 1];

						nextElement.order = elementIndex
						element.order = elementIndex + 1

						this.structure[sectionIndex].elements[elementIndex + 1] = element;
						this.structure[sectionIndex].elements[elementIndex] = nextElement;
						break
					default:
						break
				}
			},
			changeSectionOrder: function (sectionId, type) {
				const findSectionById = (i) => { return i.id == sectionId; }
				let sectionIndex = _.findIndex(this.structure, findSectionById);

				if (this.structure[sectionIndex].length <= 1) return;

				let currentSectionOrder = this.structure[sectionIndex].order;

				switch (type) {
					case 'up':
						if (currentSectionOrder == 0) return;

						let prevSection = this.structure[sectionIndex - 1];
						let currentSection = this.structure[sectionIndex]
						prevSection.order = currentSectionOrder
						currentSection.order = currentSectionOrder - 1

						this.structure[currentSectionOrder - 1] = currentSection;
						this.structure[currentSectionOrder] = prevSection;

						break;
					case 'down':
						if (sectionIndex == this.structure[sectionIndex].length - 1) return;

						let nextSection = this.structure[sectionIndex + 1];
						let currentSection1 = this.structure[sectionIndex]

						nextSection.order = currentSectionOrder
						currentSection1.order = currentSectionOrder + 1

						this.structure[currentSectionOrder + 1] = currentSection1;
						this.structure[currentSectionOrder] = nextSection;
						break
					default:
						break
				}
			},
			updateNavigationRoutes: function () {
				let routes = this.structure.map(item => { return { title: `${item.title}`, route: item.id } });

				routes.push({ title: "Próxima Seção", route: FFUService.NavigationType.NextSection });
				routes.push({ title: "Fim do Formulário", route: FFUService.NavigationType.EndForm });

				this.routes = routes;
			},
			updateSectionNavigationRoutes: function () {
				let routesRoute = this.routes.map(i => i.route);

				this.structure
					.forEach(item => {
						if (! _.includes(routesRoute, item.navigation)) {
							item.navigation = FFUService.NavigationType.NextSection;
						}
					});
			},
		}
	};
})();