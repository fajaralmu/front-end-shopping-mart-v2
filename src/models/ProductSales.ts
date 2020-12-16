import BaseEntity from './BaseEntity';
import Product from './Product';

export default class ProductSales extends BaseEntity{
	product?:Product;
	sales?:number;
	month?:number;
	year?:number;
	percentage?:number;
	maxValue?:number;
	monthName?:String;

}
