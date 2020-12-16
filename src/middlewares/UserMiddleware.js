import * as common from './Common'
import * as types from '../redux/types'


const POST_METHOD = "post";
const axios = require('axios');
export const performLoginMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGIN) {
        return next(action);
    }
    const app = action.meta.app;
    axios.post(action.meta.url, {}, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(response => {
        const responseJson = response.data;
        let loginKey = "";
        let loginSuccess = false;

        if (responseJson.code != null && responseJson.code == "00") {
            loginKey = responseJson.token;
            console.log("api_token: ", loginKey);
            loginSuccess = true;

        }
        let newAction = Object.assign({}, action, {
            payload: {
                loginStatus: loginSuccess,
                loginKey: loginKey,
                loggedUser: responseJson.entity
            }
        });
        delete newAction.meta;
        store.dispatch(newAction);
    })
        .catch(console.log)
        .finally(param => { app.endLoading(); });

}

export const requestAppIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REQUEST_ID) { return next(action); }
    axios.post(action.meta.url, (action.payload), {
        headers: common.commonAuthorizedHeader()
    }).then(response => {
        const data = response.data;
        if (data.code != "00") {
            alert("Error requesting app ID");
            return;
        }

        let newAction = Object.assign({}, action, { payload: { loginStatus: data.loggedIn, ...data } });
        delete newAction.meta;
        store.dispatch(newAction);
    })
        .catch(console.log).finally(param => action.meta.app.endLoading());
}

export const getLoggedUserMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_LOGGED_USER) { return next(action); }

    let headers = common.commonAuthorizedHeader();

    axios.post(action.meta.url, (action.payload), {
        headers: headers
    }).then(response => {
        const data = response.data;

        if (!data) {
            alert("Error performing request");
            return;
        }

        let newAction = Object.assign({}, action, { payload: { data } });
        delete newAction.meta;
        store.dispatch(newAction);
    })
        .catch(console.log).finally(param => {
            action.meta.app.endLoading();
            action.meta.app.refresh();
        });
}


export const performLogoutMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGOUT) {
        return next(action);
    }
    const app = action.meta.app;

    axios.post(action.meta.url, (action.payload), {
        headers: common.commonAuthorizedHeader()
    })
        .then(response => {
            const responseJson = response.data;
            let logoutSuccess = false;
            if (responseJson.code == "00") {
                logoutSuccess = true;
            } else {
                alert("Logout Failed");
            }

            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: !logoutSuccess
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(console.log).finally(param => app.endLoading());

}