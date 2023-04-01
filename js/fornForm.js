(function () {
  'use strict';

  angular
    .module('TestApp')
    .factory('FornForm', FornForm);

  FornForm.$inject = ['FornFormUtilsService', '_'];


  function FornForm(FFUService, _) {
    var service = {
      createElement,
      createSection,
      addElementToSection,
      deleteSectionById,
      deleteElementFromSectionById
    };
    return service;



    function addElementToSection(structure, section, element) {
      const findSectionById = (i) => { return i.id == section; }
      let innerSection = _.find(structure, findSectionById);

      let sectionIndex = _.findIndex(structure, findSectionById);

      let elementOrder = innerSection.elements.length;
      innerSection.elements.push({ ...element, order: elementOrder });

      structure[sectionIndex] = innerSection;
    }

    function createElement(type) {
      let elementId = FFUService.makeid(8);
      let element = {
        id: elementId,
        order: 0,
        type: "",
        required: false,
        title: "Nova pergunta",
        description: "",
        puntuation: 0,
        options: [],
        response: [],
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
    }

    function createSection(structure) {
      let index = structure.length ?? 0;

      let sectionId = FFUService.makeid(8);
      let section = {
        id: sectionId,
        order: index,
        type: "section",
        title: `Seção ${index + 1}`,
        description: "",
        navigation: FFUService.NavigationType.NextSection,
        elements: []
      }

      Object.assign(section, { order: index })
      structure.push(section);

      return [sectionId, section];
    }
    function deleteSectionById(structure, sectionId) {

      console.log(structure);
      structure = _.filter(structure, (el => el.id !== sectionId));
      console.log(structure);

      if(structure && structure.length>0) {
        let newStructure = _.each(structure, (el, index) => { el.order = index });
        angular.copy(structure, newStructure);
      } 
      else angular.copy(structure, []);;
      console.log(structure);

      
    }

    function deleteElementFromSectionById(structure, sectionId, elementId) {
      const findSectionById = (i) => { return i.id == sectionId; }
      let innerSection = _.find(structure, findSectionById);
      let sectionIndex = _.findIndex(structure, findSectionById);


      console.log(innerSection, sectionIndex);

      let innerSectionElements = innerSection.elements.filter((i) => i.id !== elementId);

      innerSectionElements = _.each(innerSectionElements, (el, index) => { el.order = index });

      innerSection.elements = innerSectionElements;

      console.log(innerSection);     

      structure[sectionIndex] = innerSection;

      console.log(structure);     
    }
  }
})();