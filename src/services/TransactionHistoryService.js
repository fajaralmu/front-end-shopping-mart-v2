import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { commonAjaxPostCalls } from './Promises';
export default class TransactionHistoryService {
    static instance = TransactionHistoryService.instance || new TransactionHistoryService()

    getTransactionData = function (transactionCode) {
        const endpoint = url.contextPath().concat("api/app/transaction/transactiondata/" + transactionCode)
        return commonAjaxPostCalls(endpoint, {});

    }

    getInventoriesQuantity = function (request = {}) {
        const endpoint = url.contextPath().concat("api/app/transaction/inventoriesquantity")
        return commonAjaxPostCalls(endpoint, request);

    }

    getBalanceInfo = (request) => {
        const endpoint = url.contextPath().concat("api/app/admin/balance")
        return commonAjaxPostCalls(endpoint, request);
    }
}