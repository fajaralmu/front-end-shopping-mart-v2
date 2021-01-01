import BaseEntity from './BaseEntity';
import Product from './Product';
import DataSet from './DataSet';

export default class ProductSales extends BaseEntity implements DataSet{
	product?:Product;
	sales?:number;
	month?:number;
	year?:number;
	percentage?:number;
	maxValue?:number;
	monthName?:string;
	getAmount: () => number;
    getPeriodInfo: () => string;
    constructor() {
		super();
        this.getAmount = () => {
			return this.sales??0;
        }
       this.getPeriodInfo = () => {
            return this.month+"-"+this.year;
        }
    }
	static toDataSet = (object:ProductSales) : DataSet => {
        return Object.assign(new ProductSales(), object);
    }
    static toDataSets = (objects:ProductSales[]) : DataSet[] => {
        const dataSets:DataSet[]  = new Array<DataSet>();
        for (let i = 0; i < objects.length; i++) {
            const element = objects[i];
            dataSets.push(ProductSales.toDataSet(element));
        }
        return dataSets;
    }
}
