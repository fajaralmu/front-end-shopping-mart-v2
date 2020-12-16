import { Component } from 'react';
import { byId } from '../utils/ComponentUtil';

export default class BaseComponent extends Component<any, any> {
    parentApp: any;
    authenticated: boolean = true;
    state: any = { updated: new Date() };
    constructor(props: any, authenticated = false) {
        super(props);
        this.parentApp = props.app;
        this.authenticated = authenticated
        this.state = {
            ...this.state
        }

    }

    handleInputChange(event: any) {
        const target = event.target;
        const value = target.type == 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
        console.debug("input changed: ", target.name, value);
    }

    focusToActiveField() {
        if (this.state.activeId != null && byId(this.state.activeId) != null) {
            const element = byId(this.state.activeId);
            if (element != null) {
                element.focus();
            }
        }
    }
    /**
     * 
     * @param {boolean} withProgress 
     */
    startLoading(withProgress: boolean) {
        this.parentApp.startLoading(withProgress);
    }

    endLoading() {
        this.parentApp.endLoading();
    }
    doAjax(method: Function, params: any, withProgress: boolean, successCallback: Function, errorCallback?: Function) {
        this.startLoading(withProgress);

        method(params).then(function (response) {
            if (successCallback) {
                successCallback(response);
            }
        }).catch(function (e) {
            if (errorCallback) {
                errorCallback(e);
            } else {
                if (typeof (e) == 'string') {
                    alert("Operation Failed: " + e);
                }
                alert("resource not found");
            }
        }).finally((e) => {
            this.endLoading();
        })
    }

    commonAjax(method: Function, params: any, successCallback: Function, errorCallback?: Function) {
        this.doAjax(method, params, false, successCallback, errorCallback);
    }
    commonAjaxWithProgress(method: Function, params: any, successCallback: Function, errorCallback?: Function) {
        this.doAjax(method, params, true, successCallback, errorCallback);
    }
    getLoggedUser() {
        return this.props.loggedUser;
    }
    isLoggedUserNull(): boolean {
        return false == this.props.loginStatus || null == this.props.loggedUser;
    }

    showConfirmation(body:any): Promise<any> {
        const app = this;
        return new Promise(function(resolve, reject){
            const onYes = function (e) {
                resolve(true);
            }
            const onNo = function (e) {
                resolve(false);
            }
            app.parentApp.showAlert("Confirmation", body, false, onYes, onNo);
        });
  
    }
    showConfirmationDanger(body: any): Promise<any> {
        const app = this;
        return new Promise(function(resolve, reject){
            const onYes = function (e) {
                resolve(true);
            }
            const onNo = function (e) {
                resolve(false);
            }
            app.parentApp.showAlertError("Confirmation", body, false, onYes, onNo);
        });

    }
    showInfo(body: any) {
        this.parentApp.showAlert("Info", body, true, function () { });
    }
    showError(body: any) {
        this.parentApp.showAlertError("Error", body, true, function () { });
    }

    backToLogin() {
        if (!this.authenticated || this.props.history == null) {
            return;
        }
        this.props.history.push("/login");
    }
    refresh() {
        this.setState({ updated: new Date() });
    }

    componentDidUpdate() {
        if (this.authenticated && null == this.props.loggedUser) {
            this.backToLogin();
        }
    }
}