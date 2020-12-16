import * as url from '../constant/Url'
import { commonAjaxPostCalls } from './Promises';
import WebRequest from './../models/WebRequest';
export default class CatalogService {
    private static instance?:CatalogService;

    static getInstance(): CatalogService {
        if (this.instance == null) {
            this.instance = new CatalogService();
        }
        return this.instance;
    }

    /**
     * 
     * @param {JSON} raw 
     */
    getProductList = (raw:any) => {
         
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
        const request:WebRequest = {
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
    getProductDetail = (code:string) => this.getProductList({
        key: 'code',
        value: code,
        limit: 1,
        exacts: true,
        withStock: true,
        withSupplier: true
    })

  /**
   * 
   * @param req 
   */
    getMoreSupplier = (req:any) => { 

        const request:WebRequest = {
            filter: {
                page: req.page,
                fieldsFilter: { productId: req.productId }
            }
        }
        const endpoint = url.contextPath().concat("api/public/moresupplier");
        return commonAjaxPostCalls(endpoint, request);
    }


}