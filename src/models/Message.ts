import BaseEntity from './BaseEntity';

export default class Message extends BaseEntity{
	admin?:number;
	sender?:String;
	userAgent?:String;
	ipAddress?:String;
	text?:String;
	date?:Date;
	alias?:String;
	requestId?:String;

}
