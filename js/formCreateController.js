(function () {
	'use strict';

	/* Controllers */

	angular
		.module('TestApp')
		.controller('FormCreateController', FormCreateController);

		FormCreateController.$inject = ['$scope', '$http', 'toastr', 'FornFormUtilsService', '_'];

	function FormCreateController($scope, $http, toastr, FFUService, _) {
		var vm = this;

		vm.form = {
			maxSectionsAllowed: 5,
			maxElementInSectionAllowed: 5,
			maxOptionsElementsAllowed: 5,
			acceptedFilesExtensions: FFUService.AllowedFileExtensions,
			structure: [],
			routes: [{ title: "Próxima seção", route: FFUService.NavigationType.NextSection }, { title: "Fim do formulário", route: FFUService.NavigationType.EndForm }],
			addSectionToStructure: function (index) {

				let structureLength = this.structure.length;

				if (structureLength >= this.maxSectionsAllowed - 3 && structureLength <= this.maxSectionsAllowed - 2) toastr.info(`Você está próximo de atingir o limite máximo de seções permitidas. [${structureLength + 1}/${this.maxSectionsAllowed}]`, "Atenção!")
				if (structureLength == this.maxSectionsAllowed - 1) toastr.warning(`Esta é a última seção permitida. [${structureLength + 1}/${this.maxSectionsAllowed}]`, "Muita Atenção!")
				if (structureLength == this.maxSectionsAllowed) { toastr.error("Você não pode mais adicionar seções neste formulário.", "Ação não permitida!"); return; }

				let order = 0;
				if (index) {
					order = index
				} else {
					order = structureLength ?? 0;
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
				if (this.structure.length == 1) {
					toastr.error("É necessário ter pelo menos uma Seção no Formulário.", "Ação não permitida");
					return;
				}

				let newStructure = this.structure.filter(el => el.id != sectionId);

				if (newStructure.length > 0) newStructure.forEach((el, index) => { el.order = index });

				this.structure = newStructure;

				this.updateNavigationRoutes();
				this.updateSectionNavigationRoutes();
			},
			addElementToSection: function (elementType, sectionId, index) {
				const findSectionById = (i) => { return i.id == sectionId; }
				let innerSection = _.find(this.structure, findSectionById);
				let sectionIndex = _.findIndex(this.structure, findSectionById);


				let innerSectionLength = innerSection.elements.length;

				if (innerSectionLength >= this.maxElementInSectionAllowed - 3 && innerSectionLength <= this.maxElementInSectionAllowed - 2) toastr.info(`Você está próximo de atingir o limite máximo de elementos permitidos nesta seção. [${innerSectionLength + 1}/${this.maxElementInSectionAllowed}]`, "Atenção!")
				if (innerSectionLength == this.maxElementInSectionAllowed - 1) toastr.warning(`Este é o último elemento permitido neste seção. [${innerSectionLength + 1}/${this.maxElementInSectionAllowed}]`, "Muita Atenção!")
				if (innerSectionLength == this.maxElementInSectionAllowed) { toastr.error("Você não pode mais adicionar elementos nesta seção.", "Ação não permitida!"); return; }

				let order = 0;
				if (index != null || index != undefined) {
					order = index
				} else {
					order = innerSectionLength ?? 0;
				}

				let element = this.createElement(elementType);
				element.order = order;

				this.structure[sectionIndex].elements.splice(order, 0, element);

				if (this.structure[sectionIndex].elements.length > 0) {
					this.structure[sectionIndex].elements.forEach((el, index) => { el.order = index });
				}

				// let elementOrder = innerSectionLength;
				// innerSection.elements.push({ ...element, order: elementOrder });

				// this.structure[sectionIndex] = innerSection;
			},
			deleteElementFromSectionById: function (sectionId, elementId) {
				const findSectionById = (i) => { return i.id == sectionId; }
				let innerSection = _.find(this.structure, findSectionById);
				let sectionIndex = _.findIndex(this.structure, findSectionById);

				if (this.structure[sectionIndex].elements.length == 1) {
					toastr.error("É necessário ter pelo menos um Elemento na Seção.", "Ação não permitida");
					return;
				}

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
					acceptedFilesExtensions: [],
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
								value: "Nova opção",
								description: "",
								checked: false,
								punctuation:0,
								navigateTo: FFUService.NavigationType.NextSection
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
								value: "Nova opção",
								description: "",
								checked: false,
								punctuation:0,
								navigateTo: FFUService.NavigationType.NextSection
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
								value: "Nova opção",
								description: "",
								punctuation:0,
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
				let currentSectionIndex = _.findIndex(this.structure, findSectionById);

				if (this.structure[currentSectionIndex].length <= 1) return;

				let currentSectionOrder = this.structure[currentSectionIndex].order;

				switch (type) {
					case 'up':
						if (currentSectionOrder == 0) return;

						let prevSection = this.structure[currentSectionIndex - 1];
						let currentSection = this.structure[currentSectionIndex]
						prevSection.order = currentSectionOrder
						currentSection.order = currentSectionOrder - 1

						this.structure[currentSectionOrder - 1] = currentSection;
						this.structure[currentSectionOrder] = prevSection;

						break;
					case 'down':
						if (currentSectionIndex == this.structure.length - 1) return;

						let nextSection = this.structure[currentSectionIndex + 1];
						let currentSection1 = this.structure[currentSectionIndex]

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
				let routes = this.structure.map(item => { return { title: `[${item.id}] - ${item.title}`, route: item.id } });

				routes.push({ title: "Próxima Seção", route: FFUService.NavigationType.NextSection });
				routes.push({ title: "Fim do Formulário", route: FFUService.NavigationType.EndForm });

				this.routes = routes;
			},
			updateSectionNavigationRoutes: function () {
				let routesRoute = this.routes.map(i => i.route);
				this.structure.forEach(item => { if (!routesRoute.includes(item.navigation)) item.navigation = FFUService.NavigationType.NextSection; });
			},
			addOptionToElement: function (sectionId, elementId, type, index) {
				const findSectionById = (i) => { return i.id == sectionId; }
				const findElementById = (i) => { return i.id == elementId; }

				let sectionIndex = _.findIndex(this.structure, findSectionById);
				let elementIndex = _.findIndex(this.structure[sectionIndex].elements, findElementById);

				let optionsLength = this.structure[sectionIndex].elements[elementIndex].options.length;

				if (optionsLength >= this.maxOptionsElementsAllowed - 3 && optionsLength <= this.maxOptionsElementsAllowed - 2) toastr.info(`Você está próximo de atingir o limite máximo de opções permitidas neste elemento. [${optionsLength + 1}/${this.maxOptionsElementsAllowed}]`, "Atenção!")
				if (optionsLength == this.maxOptionsElementsAllowed - 1) toastr.warning(`Esta é a última opção permitida neste elemento. [${optionsLength + 1}/${this.maxOptionsElementsAllowed}]`, "Muita Atenção!")
				if (optionsLength == this.maxOptionsElementsAllowed) { toastr.error("Você não pode mais adicionar opções neste elemento.", "Ação não permitida!"); return; }

				let elementOrder = 0;
				if (index) {
					elementOrder = index
				} else {
					elementOrder = optionsLength ?? 0;
				}

				let option = {};
				switch (type) {
					case 'radio':
						option = {
							id: FFUService.makeid(8),
							order: elementOrder,
							name: elementId,
							value: `Nova opção ${optionsLength}`,
							description: "",
							checked: false,
							punctuation: 0,
							navigateTo: FFUService.NavigationType.NextSection
						};

						break;
					case 'select':
						option = {
							id: FFUService.makeid(8),
							order: elementOrder,
							name: elementId,
							value: `Nova opção ${optionsLength}`,
							description: "",
							checked: false,
							punctuation: 0,
							navigateTo: FFUService.NavigationType.NextSection
						};
						break;
					case 'multiple':
						let id = FFUService.makeid(8);
						option = {
							id: id,
							order: elementOrder,
							name: elementId,
							value: `Nova opção ${optionsLength}`,
							description: "",
							checked: false,
							punctuation: 0
						};
						break;
					default: break;
				}

				this.structure[sectionIndex].elements[elementIndex].options.splice(elementOrder, 0, option);


				if (this.structure[sectionIndex].elements[elementIndex].options.length > 0) {
					this.structure[sectionIndex].elements[elementIndex].options.forEach((el, index) => { el.order = index });
				}
			},
			deleteOptionFromElement: function (sectionId, elementId, optionId) {
				const findSectionById = (i) => { return i.id == sectionId; }
				const findElementById = (i) => { return i.id == elementId; }
				const findOptionById = (i) => { return i.id == optionId; }

				let sectionIndex = _.findIndex(this.structure, findSectionById);
				let elementIndex = _.findIndex(this.structure[sectionIndex].elements, findElementById);
				let optionIndex = _.findIndex(this.structure[sectionIndex].elements[elementIndex].options, findOptionById);

				if (this.structure[sectionIndex].elements[elementIndex].options.length == 1) {
					toastr.error("É necessário ter pelo menos uma Opção no Elemento.", "Ação não permitida");
					return;
				}

				this.structure[sectionIndex].elements[elementIndex].options.splice(optionIndex, 1);


				if (this.structure[sectionIndex].elements[elementIndex].options.length > 0) {
					this.structure[sectionIndex].elements[elementIndex].options.forEach((el, index) => { el.order = index });
				}

				this.structure[sectionIndex].elements[elementIndex].correctAnswers = this.getRemainingCorrectAnswerWhenDeletedOption(this.structure[sectionIndex].elements[elementIndex].correctAnswers, this.structure[sectionIndex].elements[elementIndex].options);

			},
			changeOptionOrder: function (sectionId, elementId, optionId, type) {
				const findSectionById = (i) => { return i.id == sectionId; }
				const findElementById = (i) => { return i.id == elementId; }
				const findOptionById = (i) => { return i.id == optionId; }

				let sectionIndex = _.findIndex(this.structure, findSectionById);
				let elementIndex = _.findIndex(this.structure[sectionIndex].elements, findElementById);
				let optionIndex = _.findIndex(this.structure[sectionIndex].elements[elementIndex].options, findOptionById);

				if (this.structure[sectionIndex].elements[elementIndex].options.length <= 1) return;

				let currentOption = this.structure[sectionIndex].elements[elementIndex].options[optionIndex];

				switch (type) {
					case 'up':
						if (optionIndex == 0) return;

						let prevOption = this.structure[sectionIndex].elements[elementIndex].options[optionIndex - 1];

						prevOption.order = optionIndex
						currentOption.order = optionIndex - 1

						this.structure[sectionIndex].elements[elementIndex].options[optionIndex - 1] = currentOption;
						this.structure[sectionIndex].elements[elementIndex].options[optionIndex] = prevOption;

						break;
					case 'down':
						if (optionIndex == this.structure[sectionIndex].elements[elementIndex].options.length - 1) return;

						let nextOption = this.structure[sectionIndex].elements[elementIndex].options[optionIndex + 1];

						nextOption.order = optionIndex
						currentOption.order = optionIndex + 1

						this.structure[sectionIndex].elements[elementIndex].options[optionIndex + 1] = currentOption;
						this.structure[sectionIndex].elements[elementIndex].options[optionIndex] = nextOption;
						break
					default:
						break
				}

			},
			getRemainingCorrectAnswerWhenDeletedOption: function (correctAnswers, options) {
				let optionsId = options.map(i => i.id);

				return _.intersection(correctAnswers, optionsId);
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
	};
})();