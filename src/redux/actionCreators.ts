import * as types from './types'
import * as url from '../constant/Url'
import { contextPath } from '../constant/Url';
import Product from './../models/Product';
import User from './../models/User';
import ApplicationProfile from './../models/ApplicationProfile';

const usedHost = url.contextPath();
const apiBaseUrl = usedHost + "api/public/" 
const apiAccount = usedHost + "api/app/account/"
const apiAdmin = usedHost + "api/app/admin/" 

export const updateCart = (cart: Product[], ...apps) => {
    // console.debug("UPDATE CART: ", cart);
    return { type: types.UPDATE_CART, payload: { cart: cart, apps: apps }, meta: { type: types.UPDATE_CART } };
}

export const setMainApp = (app) => {
    return { type: types.SET_MAIN_APP, payload: app, meta: { type: types.SET_MAIN_APP } };
}

 
 
export const requestAppId = (app) => {
    app.startLoading();
    return {
        type: types.REQUEST_ID,
        payload: {},
        meta: {
            app: app, type: types.REQUEST_ID,
            url: apiBaseUrl.concat("requestid")
        }
    };
}

export const getMessageList = (app) => {
    app.startLoading();
    return {
        type: types.GET_MESSAGE,
        payload: {},
        meta: {
            type: types.GET_MESSAGE, app: app,
            url: apiAdmin.concat("getmessages")
        }
    };
}

export const storeMessageLocally = (messages) => {

    return {
        type: types.STORE_MESSAGE,
        payload: {
            entities: messages
        },
        meta: {
            type: types.STORE_MESSAGE,
        }
    };
} 
export const performLogout = (app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGOUT,
        payload: {},
        meta: { app: app, type: types.DO_LOGOUT, url: apiAccount.concat("logout") }
    };
    return loginRequest;
}

export const performLogin = (username, password, app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGIN,
        payload: {},
        meta: {
            type: types.DO_LOGIN, url: contextPath().concat("login?username=" + username + "&password=" +
                password + "&transport_type=rest"), app: app
        }
    };
    return loginRequest;
}

export const getLoggedUser = (app) => {
    app.startLoading();
    let request = {
        type: types.GET_LOGGED_USER,
        payload: {},
        meta: { type: types.GET_LOGGED_USER, url: apiAccount.concat("user"), app: app }
    };
    return request;
}

export const setLoggedUser = (user: User) => {

    let request = {
        type: types.SET_LOGGED_USER,
        payload: { user: user },
        meta: { type: types.SET_LOGGED_USER }
    };
    return request;
}

export const setApplicationProfile = (applicationProfile: ApplicationProfile) => {

    let request = {
        type: types.SET_APPLICATION_PROFILE,
        payload: { applicationProfile: applicationProfile },
        meta: { type: types.SET_APPLICATION_PROFILE }
    };
    return request;
}

export const removeEntity = () => ({
    type: types.REMOVE_SHOP_ENTITY,
    payload: {},
    meta: { type: types.REMOVE_SHOP_ENTITY }
})


