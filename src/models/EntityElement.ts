import EntityProperty from './EntityProperty';

export default class EntityElement{
	ignoreBaseField?:boolean;
	isGrouped?:boolean;
	id?:string;
	type?:string;
	className?:string;
	lableName?:string;
	jsonList?:string;
	optionItemName?:string;
	optionValueName?:string;
	entityReferenceName?:string;
	entityReferenceClass?:string;
	detailFields?:string;
	inputGroupname?:string;
	previewLink?:string;
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
