import * as url from '../constant/Url'
import { commonAjaxPostCalls } from './Promises';
export default class TransactionHistoryService {
    private static instance?:TransactionHistoryService;
    
    static getInstance() :TransactionHistoryService
    {
        if (this.instance == null) {
            this.instance = new TransactionHistoryService();
        }
        return this.instance;
    }
    getTransactionData = function (transactionCode:string) {
        const endpoint = url.contextPath().concat("api/app/transaction/transactiondata/" + transactionCode)
        return commonAjaxPostCalls(endpoint, {});

    }

    getInventoriesQuantity = function (request = {}) {
        const endpoint = url.contextPath().concat("api/app/transaction/inventoriesquantity")
        return commonAjaxPostCalls(endpoint, request);

    }

    getBalanceInfo = (request:any) => {
        const endpoint = url.contextPath().concat("api/app/admin/balance")
        return commonAjaxPostCalls(endpoint, request);
    }
}