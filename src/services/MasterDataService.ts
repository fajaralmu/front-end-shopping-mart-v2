
import Filter from './../models/Filter';
import WebRequest from './../models/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls } from './Promises';
import BaseEntity from './../models/BaseEntity';
import ManagementProperty from '../models/ManagementProperty';

export default class MasterDataService
{
    managementProperties:ManagementProperty[] = [];
    private static instance?:MasterDataService;
    
    static getInstance() :MasterDataService
    {
        if (this.instance == null) {
            this.instance = new MasterDataService();
        }
        return this.instance;
    }
    loadManagementProperties(req?:any){
        const endpoint:string = contextPath().concat("api/app/entity/managementpages");
        return commonAjaxPostCalls(endpoint, {});
      
    }
    getEntities(request:WebRequest){
        const endpoint:string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);
      
    }
    getById(code:string, id:number){
        const request:WebRequest = {
            entity:code,
            filter:{
                exacts:true,
                limit:1,
                fieldsFilter:{'id':id}
            }
        }
        const endpoint:string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);
    }
    delete(code:string, id:number){
        const request:WebRequest = {
            entity:code,
            filter:{
                fieldsFilter:{'id':id}
            }
        }
        const endpoint:string = contextPath().concat("api/app/entity/delete");
        return commonAjaxPostCalls(endpoint, request);
    }
    save(code:string, model:BaseEntity) {
        const request:WebRequest = {
            entity:code,
            [code]:model
        }
        const endpoint:string = contextPath().concat("api/app/entity/update");
        return commonAjaxPostCalls(endpoint, request);
    }
}