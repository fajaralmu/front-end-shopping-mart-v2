import EntityElement from "./EntityElement";

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
	dateElements?:[];
	imageElements?:[];
	currencyElements?:[];
	multipleSelectElements?:[];
	elements?:Set<EntityElement>;
	fieldNameList?:[];
	ignoreBaseField?:boolean;
	isQuestionare?:boolean;

}
