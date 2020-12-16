import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import BaseTransactionService from './BaseTransactionService';
export default class TransactionPurchasingService extends BaseTransactionService {
    private static instance?:TransactionPurchasingService;

    static getInstance(): TransactionPurchasingService {
        if (this.instance == null) {
            this.instance = new TransactionPurchasingService();
        }
        return this.instance;
    }

}