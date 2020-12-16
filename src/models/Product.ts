import BaseEntity from './BaseEntity';
import Unit from './Unit';
import Category from './Category';

export default class Product extends BaseEntity{
	code?:String;
	name?:String;
	description?:String;
	price?:number;
	type?:String;
	imageUrl?:String;
	unit?:Unit;
	category?:Category;
	newProduct?:boolean;
	count?:number;
	suppliers?:[];

}
