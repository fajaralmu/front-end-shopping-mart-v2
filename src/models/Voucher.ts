import BaseEntity from './BaseEntity';

export default class Voucher extends BaseEntity{
	month?:number;
	year?:number;
	type?:String;
	amount?:number;
	name?:String;

}
