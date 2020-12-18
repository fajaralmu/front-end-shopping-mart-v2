
import EntityElement from "./EntityElement";
import HeaderProps from './HeaderProps'; 

export default class EntityProperty{
	groupNames?:string;
	entityName?:string;
	alias?:string;
	fieldNames?:string;
	idField?:string;
	detailFieldName?:string;
	imageElementsJson?:string;
	dateElementsJson?:string;
	multipleSelectElementsJson?:string;
	currencyElementsJson?:string;
	formInputColumn?:number;
	editable?:boolean;
	withDetail?:boolean;
	dateElements?:any[];
	imageElements?:any[];
	currencyElements?:any[];
	multipleSelectElements?:any[];
	elements:EntityElement[] = new Array();
	fieldNameList?:string[];
	ignoreBaseField?:boolean;
	isQuestionare?:boolean;

	static getHeaderLabels = (prop:EntityProperty) : HeaderProps[] => {
		const result:HeaderProps[] = new Array();
		if (prop.elements == undefined) {
			return result;
		}
		const elements:EntityElement[] = prop.elements;
		for (let i = 0; i < elements.length; i++) {
			
			const element = elements[i];
			const header:HeaderProps=  {
				label:element.lableName,
				value:element.id,
				isDate:element.type == 'date'
			};
			result.push(header);
		}
		return result;
	}

}
