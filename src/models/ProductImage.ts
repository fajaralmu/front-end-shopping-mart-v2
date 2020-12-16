import BaseEntity from './BaseEntity';
import Product from './Product';

export default class ProductImage extends BaseEntity{
	code?:String;
	name?:String;
	url?:String;
	product?:Product;

}
