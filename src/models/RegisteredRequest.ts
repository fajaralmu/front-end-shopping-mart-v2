import BaseEntity from './BaseEntity';

export default class RegisteredRequest extends BaseEntity{
	requestId?:String;
	value?:String;
	created?:Date;
	referrer?:String;
	userAgent?:String;
	ipAddress?:String;
	messages?:[];
	active?:boolean;

}
