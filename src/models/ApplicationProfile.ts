import BaseEntity from './BaseEntity';

export default class ApplicationProfile extends BaseEntity{
	name?:String;
	appCode?:String;
	shortDescription?:String;
	about?:String;
	welcomingMessage?:String;
	address?:String;
	contact?:String;
	website?:String;
	iconUrl?:String;
	pageIcon?:String;
	backgroundUrl?:String;
	footerIconClass?:String;
	color?:String;
	fontColor?:String;

}
