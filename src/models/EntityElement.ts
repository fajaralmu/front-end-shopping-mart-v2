import EntityProperty from './EntityProperty';

export default class EntityElement{
	ignoreBaseField?:boolean;
	isGrouped?:boolean;
	id?:String;
	type?:String;
	className?:String;
	lableName?:String;
	jsonList?:String;
	optionItemName?:String;
	optionValueName?:String;
	entityReferenceName?:String;
	entityReferenceClass?:String;
	detailFields?:String;
	inputGroupname?:String;
	previewLink?:String;
	defaultValues?:[];
	plainListValues?:[];
	options?:[];
	identity?:boolean;
	required?:boolean;
	idField?:boolean;
	skipBaseField?:boolean;
	hasJoinColumn?:boolean;
	multiple?:boolean;
	showDetail?:boolean;
	detailField?:boolean;
	multipleSelect?:boolean;
	hasPreview?:boolean;
	entityProperty?:EntityProperty;
	additionalMap?:{};

}
