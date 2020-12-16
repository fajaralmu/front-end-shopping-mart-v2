
import { commonAuthorizedHeader } from '../middlewares/Common';
import WebResponse from '../models/WebResponse';

const axios = require('axios');

export const rejectedPromise = (message:any) => {
    return new Promise((res,rej) => {
        rej(message);
    });
}

export const emptyPromise =  (defaultResponse:any) => new Promise(function(res, rej){
    res(defaultResponse);
});

export const commonAjaxPostCalls = (endpoint:String, payload?:any) => {
    const request = payload == null ? {} : payload;
    return new Promise<WebResponse>(function (resolve, reject) {
        axios.post(endpoint, request, {
            headers: commonAuthorizedHeader()
        })
        .then(response => response.data)
        .then(function (response:WebResponse) {
            if (response.code == "00") 
            { resolve(response); }
            else 
            { reject(response); }
        })
        .catch((e:any) => { console.error(e); reject(e); });
    })
}