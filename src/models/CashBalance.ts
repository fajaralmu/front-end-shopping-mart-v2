import BaseEntity from './BaseEntity';

export default class CashBalance extends BaseEntity{
	formerBalance?:number;
	creditAmt?:number;
	debitAmt?:number;
	actualBalance?:number;
	type?:String;
	date?:Date;
	referenceId?:String;
	referenceInfo?:String;

}
