(function () {
    'use strict';

    angular
        .module('TestApp')
        .factory('FornFormUtilsService', FornFormUtilsService);

    FornFormUtilsService.$inject = [];


    function FornFormUtilsService() {

        const UUIDv4 = new function () {
            const generateNumber = (limit) => {
                const value = limit * Math.random();
                return value | 0;
            };
            const generateX = () => {
                const value = generateNumber(16);
                return value.toString(16);
            };
            const generateXes = (count) => {
                let result = '';
                for (let i = 0; i < count; ++i) {
                    result += generateX();
                }
                return result;
            };
            const generateVariant = () => {
                const value = generateNumber(16);
                const variant = (value & 0x3) | 0x8;
                return variant.toString(16);
            };
            // UUID v4
            //
            //   varsion: M=4 
            //   variant: N
            //   pattern: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
            //
            this.generate = function () {
                const result = generateXes(8)
                    + '-' + generateXes(4)
                    + '-' + '4' + generateXes(3)
                    + '-' + generateVariant() + generateXes(3)
                    + '-' + generateXes(12)
                return result;
            };
        };
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
        const AllowedFileExtensions = [
            { title: "Processador de Texto", ext: ".doc,.docx,.odt" },
            { title: "Planilha eletrônica", ext: ".xls,.xlsx,.ods" },
            { title: "Apresentação", ext: ".ppt,.pptx,.odp" },
            { title: "PDF", ext: ".pdf" },
            { title: "Imagens", ext: ".jpeg,.jpg,.png,.bmp" },
            { title: "Arquivos compactados", ext: ".zip,.rar" }            
        ]


        var service = {
            UUIDv4: () => UUIDv4.generate(),
            makeid,
            FormElementType: Object.freeze(FormElementType),
            NavigationType: Object.freeze(NavigationType),
            AllowedFileExtensions: Object.freeze(AllowedFileExtensions),
        };
        return service;
    }
})();