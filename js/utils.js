const makeid = function (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const FormElementType = {
  Label: "label",
  Text: "text",
  Paragraph: "paragraph",
  Number: "number",
  Email: "email",
  Date: "date",
  Radio: "radio",
  SingleSelect: "select",
  MultipleSelect: "multiple",
  File: "file"
};
const NavigationType = {
  NextSection: "next",
  EndForm: "end",
  SubmitForm: "submit"
};

const parseOldVersion = function (structure) {
  var section = {
    id: makeid(8),
    order: 0,
    type: "section",
    title: "",
    description: "",
    navigation: 'next',
    elements: []
  }

  var elements = structure.map((elItem, elIndex) => {
    let elementId = makeid(8);
    let element = {
      id: elementId,
      order: elIndex,
      type: '',
      required: elItem.obrigatorio,
      title: elItem.rotulo,
      description: elItem.instrucao,
      usePunctuation: false,
      punctuation: 0,
      options: [],
      response: [],
      useCorrectAnswers: false,
      correctAnswers: [],
      acceptedFilesExtensions: [],
      navigation: NavigationType.NextSection
    };

    switch (elItem.tipo) {
      case 'text':
        element = { ...element, type: FormElementType.Text };
        break;
      case 'number':
        element = { ...element, type: FormElementType.Number };
        break;
      case 'datepicker':
        element = { ...element, type: FormElementType.Date };
        break;
      case 'textarea':
        element = { ...element, type: FormElementType.Paragraph };
        break;
      case 'select':
        var options = [];
        if (elItem.opcoes && elItem.opcoes.length > 0) {
          options = item.opcoes.map((opItem, opIndex) => {
            return {
              id: makeid(8),
              order: opIndex,
              name: elementId,
              value: opItem.valor,
              description: opIndex.rotulo,
              checked: false,
              navigateTo: NavigationType.NextSection
            }
          })
        }
        element = { ...element, type: FormElementType.SingleSelect, options: options };
        break;
      case 'multiple':
        var options = [];
        if (elItem.opcoes && elItem.opcoes.length > 0) {          
          options = elItem.opcoes.map((opItem, opIndex) => {
            return {
              id: makeid(8),
              order: opIndex,
              name: elementId,
              value: opItem.valor,
              description: opIndex.rotulo,
              checked: false,
              navigateTo: NavigationType.NextSection
            }
          })
        }
        element = { ...element, type: FormElementType.MultipleSelect, options: options };
        break;
      case 'radio':
        var options = [];
        if (elItem.opcoes && elItem.opcoes.length > 0) {
          options = elItem.opcoes.map((opItem, opIndex) => {
            return {
              id: makeid(8),
              order: opIndex,
              name: elementId,
              value: opItem.valor,
              description: opIndex.rotulo,
              checked: false,
              navigateTo: NavigationType.NextSection
            }
          })
        }
        element = { ...element, type: FormElementType.Radio, options: options };
        break;
      case 'checkbox':
        var options = [];
        if (elItem.opcoes && elItem.opcoes.length > 0) {          
          options = elItem.opcoes.map((opItem, opIndex) => {
            return {
              id: makeid(8),
              order: opIndex,
              name: elementId,
              value: opItem.valor,
              description: opIndex.rotulo,
              checked: false,
              navigateTo: NavigationType.NextSection
            }
          })
        }
        element = { ...element, type: FormElementType.MultipleSelect, options: options };
        break;
      case 'label':
        element = { ...element, type: FormElementType.Label, required: false, useCorrectAnswers: false, usePunctuation: false };
        break;
      default:
        break;
    }

    return element;
  });

  section = { ...section, elements: elements };

  return [section];
}


module.exports = {
  parseOldVersion
}