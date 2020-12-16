import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
import { commonAjaxPostCalls } from './Promises';
export default class SupplierService {
    static instance = SupplierService.instance || new SupplierService()

    getSupplierList = (raw) => {
        const fieldsFilter = {}
        fieldsFilter[raw.key] = raw.value;
        const request = {
            entity: "supplier",
            filter: {
                limit: raw.limit ? raw.limit : 10,
                page: raw.page ? raw.page : 0,
                exacts: raw.exacts == true,
                fieldsFilter: fieldsFilter,
                orderBy: raw.orderby,
                orderType: raw.ordertype
            }
        };
        const endpoint = url.contextPath().concat("api/public/get");
        return commonAjaxPostCalls(endpoint, request);
    }

    getProductSupplied = (supplierId) => {
        const request = { supplier: { id: supplierId } };
        const endpoint = url.contextPath().concat("api/public/productssupplied");

        return commonAjaxPostCalls(endpoint, request);
    }
}