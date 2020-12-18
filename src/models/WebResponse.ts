import User from './User';
import BaseEntity from './BaseEntity';
import Filter from './Filter';
import Transaction from './Transaction';
import ProductFlowStock from './ProductFlowStock';
import SessionData from './SessionData';
import ApplicationProfile from './ApplicationProfile';
import EntityProperty from './EntityProperty';

export default class WebResponse{
	date?:Date;
	user?:User;
	code?:string;
	message?:string;
	entities?:any[];
	generalList?:any[];
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
	requestId?:string;
	token?:string;
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
	entityProperty?:EntityProperty;

}
