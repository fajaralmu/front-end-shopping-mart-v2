

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';
import Header from '../navigation/Header';
import ApplicationContent from './ApplicationContent';

class MainLayout extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }
    render() {
        return (
            <div id="main-layout">
                <Header app={this.parentApp}/>
                <div id="page-content" className="container-fluid" style={{ minHeight: '80vh' }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <ApplicationContent app={this}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
    performLogout: (app: any) => dispatch(performLogout(app))
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(MainLayout))