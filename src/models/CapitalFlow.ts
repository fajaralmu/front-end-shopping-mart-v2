import BaseEntity from './BaseEntity';
import Capital from './Capital';

export default class CapitalFlow extends BaseEntity{
	date?:Date;
	description?:String;
	nominal?:number;
	capitalType?:Capital;

}
