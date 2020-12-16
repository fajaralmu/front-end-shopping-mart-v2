

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../pages/login/Login';

class ApplicationContent extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path="/login" render={
                        (props:any) =>
                        <Login app={this.parentApp} /> 
                    } />
                </Switch>

            </Fragment>
        )
    }
    componentDidMount(){
        document.title="Login";
    }

}
const mapDispatchToProps = (dispatch: Function) => ({})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(ApplicationContent))