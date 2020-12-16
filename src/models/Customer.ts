import BaseEntity from './BaseEntity';

export default class Customer extends BaseEntity{
	username?:String;
	name?:String;
	address?:String;
	phone?:String;
	type?:String;
	email?:String;

}
