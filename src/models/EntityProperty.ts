import EntityElement from "./EntityElement";

export default class EntityProperty{
	groupNames?:String;
	entityName?:String;
	alias?:String;
	fieldNames?:String;
	idField?:String;
	detailFieldName?:String;
	imageElementsJson?:String;
	dateElementsJson?:String;
	multipleSelectElementsJson?:String;
	currencyElementsJson?:String;
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
