import * as types from './types'
import * as menuData from '../constant/Menus'
import { setCookie } from '../middlewares/Common';

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false,
    menus: menuData.menus,
    loggedUser: null,
    loginAttempt: false,
    requestId: null,
    applicationProfile: {},
};

export const reducer = (state = initState, action) => {
    /*
        ========setting menu========
    */


    let result = {};
    switch (action.type) {
        case types.REQUEST_ID:
            result = {
                ...state, requestId: action.payload.requestId,
                applicationProfile: action.payload.applicationProfile == null ? {} : action.payload.applicationProfile
            };

            setCookie("requestId", result.requestId);
            console.debug("action.payload.loginStatus: ", action.payload.loginStatus);
            if (action.payload.loginStatus == true) {
                result.loggedUser = action.payload.user;
                result.loginStatus = true;
            } else {
                result.loginStatus = false;
                result.loggedUser = null;
            }

            console.debug("REQUEST_ID result.loginStatus:", result.loginStatus)
            //  action.payload.referer.refresh();

            return result;
        case types.DO_LOGIN:
            result = {
                ...state,
                loginAttempt: true,
                loginStatus: action.payload.loginStatus,
                loginKey: action.payload.loginKey,
                loginFailed: action.payload.loginStatus == false,
                loggedUser: action.payload.loggedUser
            };

            if (result.loginStatus == true) {
                setCookie("loginKey", result.loginKey);
            }

            return result;
        case types.DO_LOGOUT:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                loggedUser: null
            };
            return result;
        case types.REFRESH_LOGIN:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                loggedUser: action.payload.loggedUser,
                requestId: action.payload.requestId,
            };
            return result;
        case types.GET_LOGGED_USER:
            result = {
                ...state,
                loggedUser: action.payload.data
            };
            return result;
        default:

            return { ...state };

    }
}

export default reducer;