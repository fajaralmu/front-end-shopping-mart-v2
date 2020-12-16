import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
import { commonAjaxPostCalls } from './Promises';
export default class CatalogService {
    static instance = CatalogService.instance || new CatalogService()

    /**
     * 
     * @param {JSON} raw 
     */
    getProductList = (raw) => {
         
        const fieldsFilter = {
            withStock: raw.withStock == true,
            withSupplier: raw.withSupplier == true,
            withCategories: raw.withCategories == true,
            ... raw.fieldsFilter
        }
        if (raw.key) {
            fieldsFilter[raw.key] = raw.value;
        } else {
            fieldsFilter['name'] = raw.name;
        } 
        const request = {
            entity: "product",
            filter: {
                exacts: raw.exacts == true,
                limit: raw.limit ? raw.limit : 10,
                page: raw.page ? raw.page : 0,
                fieldsFilter: fieldsFilter,
                orderBy: raw.orderby,
                orderType: raw.ordertype
            }
        }
        const endpoint = url.contextPath().concat("api/public/get");
        return commonAjaxPostCalls(endpoint, request);
      
    }

    /**
     * 
     * @param {String} code 
     */
    getProductDetail = (code) => this.getProductList({
        key: 'code',
        value: code,
        limit: 1,
        exacts: true,
        withStock: true,
        withSupplier: true
    })

    /**
     * 
     * @param {JSON} req 
     */
    getMoreSupplier = (req) => { 

        const request = {
            filter: {
                page: req.page,
                fieldsFilter: { productId: req.productId }
            }
        }
        const endpoint = url.contextPath().concat("api/public/moresupplier");
        return commonAjaxPostCalls(endpoint, request);
    }


}