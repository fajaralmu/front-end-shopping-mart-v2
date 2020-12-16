import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
import BaseTransactionService from './BaseTransactionService';
import { commonAjaxPostCalls } from './Promises';
export default class TransactionSellingService extends BaseTransactionService{
    static instance = TransactionSellingService.instance || new TransactionSellingService();

    getCustomerList = (raw) => {
        
        const fieldsFilter = {};
        fieldsFilter[raw.key] = raw.value;
        const request = {
            entity: "customer",
            filter: {
                page: (raw.page > 0 ? raw.page : 0),
                limit: (raw.limit > 0 ? raw.limit : 10),
                exacts: (raw.exacts == true),
                fieldsFilter: fieldsFilter
            }
        }

        const endpoint = url.contextPath().concat("api/app/entity/get")
        return commonAjaxPostCalls(endpoint, request);
    }

    getStockInfo = (productCode) => {
        const request = {
            entity: "product",
            filter: {
                limit: 1,
                exacts: true,
                fieldsFilter: { "code": productCode, withStock: true }
            }
        }
        const endpoint = url.contextPath().concat("api/public/get")
        return commonAjaxPostCalls(endpoint, request);
    }

}