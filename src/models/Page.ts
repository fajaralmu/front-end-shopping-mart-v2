import BaseEntity from './BaseEntity';

export default class Page extends BaseEntity{
	code?:String;
	name?:String;
	authorized?:number;
	nonMenuPage?:number;
	link?:String;
	description?:String;
	imageUrl?:String;
	menuHtmlIconClass?:String;
	sequence?:number;
	menus?:[];

}
