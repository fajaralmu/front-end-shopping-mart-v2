import User from './User';
import BaseEntity from './BaseEntity';
import Filter from './Filter';
import Transaction from './Transaction';
import ProductFlowStock from './ProductFlowStock';
import SessionData from './SessionData';
import ApplicationProfile from './ApplicationProfile';

export default class WebResponse{
	date?:Date;
	user?:User;
	code?:String;
	message?:String;
	entities?:[];
	generalList?:[];
	entity?:BaseEntity;
	filter?:Filter;
	totalData?:number;
	transaction?:Transaction;
	productFlowStock?:ProductFlowStock;
	storage?:{};
	maxValue?:number;
	quantity?:number;
	sessionData?:SessionData;
	applicationProfile?:ApplicationProfile;
	percentage?:number;
	transactionYears?:[];
	requestId?:String;
	token?:String;
	monthlyDetailIncome?:{};
	monthlyDetailCost?:{};
	dailyCashflow?:{};
	loggedIn?:boolean;
	success?:boolean;
	entityClass?:any;
	supplies?:[];
	purchases?:[];
	purchasings?:[];
	sellings?:[];

}
