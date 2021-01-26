
import CatalogService from './CatalogService';
import MasterDataService from './MasterDataService';
import SupplierService from './SupplierService';
import MessageService from './MessageService';
import TransactionHistoryService from './TransactionHistoryService';
import TransactionPurchasingService from './TransactionPurchasingService';
import TransactionSellingService from './TransactionSellingService';
import UserService from './UserService';
export default class Services {
    catalogService:CatalogService = CatalogService.getInstance();
    masterDataService:MasterDataService = MasterDataService.getInstance();
    supplierService:SupplierService = SupplierService.getInstance();
    messageService:MessageService = MessageService.getInstance();
    transactionHistoryService:TransactionHistoryService = TransactionHistoryService.getInstance();
    transactionPurchasingService:TransactionPurchasingService = TransactionPurchasingService.getInstance();
    transactionSellingService:TransactionSellingService = TransactionSellingService.getInstance();
    userService:UserService = UserService.getInstance();
}