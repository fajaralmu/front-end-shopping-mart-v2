import BaseEntity from './BaseEntity';
import Customer from './Customer';
import ProductFlow from './ProductFlow';
import Supplier from './Supplier';
import User from './User';

export default class Transaction extends BaseEntity{
	customer?:Customer;
	supplier?:Supplier;
	code?:String;
	type?:String;
	mode?:String;
	transactionDate?:Date;
	user?:User;
	productFlows?:Set<ProductFlow>;
	productFlow?:any;

}
