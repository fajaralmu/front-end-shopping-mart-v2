

import React, { RefObject, Component, FormEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import './Login.css';
import { performLogin } from '../../../redux/actionCreators';
class Login extends BaseComponent {
    formRef: RefObject<HTMLFormElement> = React.createRef();
    constructor(props: any) {
        super(props, false);
    }
    login(e: FormEvent) {
        e.preventDefault();
        const form: EventTarget = e.target;
        if (null == this.formRef.current) {
            return;
        }
        const formData: FormData = new FormData(this.formRef.current);
        console.debug("formData: ", formData);
        this.props.performLogin(formData.get('username'), formData.get('password'), this.parentApp);
    }
    componentDidMount(){
        document.title = "Login";
        if (this.isUserLoggedIn()) {
            this.props.history.push("/dashboard");
        }
    }
    componentDidUpdate(){
    
        console.debug("Login update");
        console.debug("logged in : ", this.props.loginStatus);
        console.debug("logged user : ", this.getLoggedUser());
        if (this.isUserLoggedIn()) {
            this.props.history.push("/dashboard");
        }
    }
    render() {
        return (
            <div id="Login">
                <form ref={this.formRef} name='login' onSubmit={(e) => { this.login(e) }}
                    method='POST' className="form-signin">
                    <div className="text-center">
                        <h2><i className="fas fa-user-circle"></i></h2>
                        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                    </div>
                    <UsernameField />
                    <PasswordField />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    <input name="transport_type" type="hidden" value="rest" />
                </form>
            </div>
        )
    }

}
const PasswordField = (props) => {
    return <Fragment>
        <label className="sr-only">Password</label>
        <input name="password" type="password" id="inputPassword" className="form-control"
            placeholder="Password" required />
    </Fragment>
}
const UsernameField = (props) => {
    return (<Fragment>
        <label className="sr-only">Username</label>
        <input name="username" type="text" id="username" className="form-control"
            placeholder="Username" required autoFocus />
    </Fragment>)
}
const mapDispatchToProps = (dispatch: Function) => ({
    performLogin: (username: string, password: string, app: any) => dispatch(performLogin(username, password, app))
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(Login))