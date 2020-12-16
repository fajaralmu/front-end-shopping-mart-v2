import BaseEntity from './BaseEntity';
import Page from './Page';

export default class Menu extends BaseEntity{
	code?:String;
	name?:String;
	description?:String;
	url?:String;
	pathVariables?:String;
	menuPage?:Page;
	iconUrl?:String;
	color?:String;
	fontColor?:String;

	//
	menuClass:string = "fas fa-folder";
	authenticated:boolean = false;
}
