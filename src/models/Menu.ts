import BaseEntity from './BaseEntity';
import Page from './Page';
import { uniqueId } from './../utils/StringUtil';

export default class Menu extends BaseEntity{
	code:String = uniqueId();
	name?:string;
	description?:string;
	url?:string;
	pathVariables?:string;
	menuPage?:Page;
	iconUrl?:string;
	color?:string;
	fontColor?:string;

	//
	menuClass:string = "fas fa-folder";
	authenticated:boolean = false;
}
