import EntityProperty from './EntityProperty';
import { FieldType } from './FieldType';

export default class EntityElement{
	ignoreBaseField?:boolean;
	isGrouped?:boolean;
	id:string="0";
	type:string="text";
	className?:string;
	lableName :string="Label";
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
	fieldType?:FieldType =FieldType.FIELD_TYPE_TEXT;

}
