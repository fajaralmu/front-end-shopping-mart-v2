import BaseEntity from './BaseEntity';
import Unit from './Unit';
import Category from './Category';

export default class Product extends BaseEntity{
	code?:string;
	name?:string;
	description?:string;
	price?:number;
	type?:string;
	imageUrl?:string;
	unit?:Unit;
	category?:Category;
	newProduct?:boolean;
	count?:number;
	suppliers?:[];

}
