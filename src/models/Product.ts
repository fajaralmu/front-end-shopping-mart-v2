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

	static getDefaultPicture(product:Product, baseImageUrl?:string) :string{

		if (product.imageUrl && product.imageUrl?.length >0) {
			return (baseImageUrl?baseImageUrl:null) + product.imageUrl.split("~")[0];
		}
		return (baseImageUrl?baseImageUrl:null) + "default.bmp";
	}
	static getPictureNames(product:Product, baseImageUrl?:string): string[] {
		if (product.imageUrl && product.imageUrl?.length >0) {
			let names:string[] = product.imageUrl.split("~");
			if (baseImageUrl) {
				return names.map(name=>{
					return baseImageUrl+name;
				})
			}
			return names;
		}
		return [Product.getDefaultPicture(product, baseImageUrl)]
	}

}
