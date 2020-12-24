import BaseEntity from './BaseEntity';
import Unit from './Unit';
import Category from './Category';
import Supplier from './Supplier';

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
	suppliers?:Supplier[];

	static getDefaultPicture(product:Product) :string{

		if (product.imageUrl && product.imageUrl?.length >0) {
			return product.imageUrl.split("~")[0];
		}
		return "default.bmp";
	}

}
