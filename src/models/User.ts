import BaseEntity from './BaseEntity';

export default class User extends BaseEntity{
	username?:String;
	displayName?:String;
	password?:String;
	profileImage?:String;
	authorities?:[];
	requestId?:String;
	processingDate?:Date;

}
