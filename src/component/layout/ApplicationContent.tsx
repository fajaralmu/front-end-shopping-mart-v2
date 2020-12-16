

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../pages/login/Login';
import DashboardMain from '../pages/dashboard/DashboardMain';
import MasterDataMain from '../pages/masterdata/MasterDataMain';
import TransactionMain from '../pages/transaction/TransactionMain';
import CatalogMain from '../pages/catalog/CatalogMain';
import HomeMain from '../pages/home/HomeMain';
import CartMain from '../pages/cart/CartMain';

class ApplicationContent extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }
    render() {
        return (
            <div style={{paddingTop:'10px'}}>
                <Switch>
                    <Route path="/login" render={
                        (props: any) =>
                            <Login app={this.parentApp} />
                    } />
                     {/* -------- home -------- */}
                     <Route path="/home" render={
                        (props: any) =>
                            <HomeMain app={this.parentApp} />
                    } />
                    {/* -------- dashboard -------- */}
                    <Route path="/dashboard" render={
                        (props: any) =>
                            <DashboardMain app={this.parentApp} />
                    } />
                    {/* -------- masterdata -------- */}
                    <Route path="/masterdata" render={
                        (props: any) =>
                            <MasterDataMain app={this.parentApp} />
                    } />
                    {/* -------- transaction -------- */}
                    <Route path="/transaction" render={
                        (props: any) =>
                            <TransactionMain app={this.parentApp} />
                    } />
                    {/* -------- catalog -------- */}
                    <Route path="/catalog" render={
                        (props: any) =>
                            <CatalogMain app={this.parentApp} />
                    } />
                     {/* -------- home -------- */}
                     <Route path="/cart" render={
                        (props: any) =>
                            <CartMain app={this.parentApp} />
                    } />
                </Switch>

            </div>
        )
    }
    componentDidMount() {
        // document.title = "Login";
    }

}



const mapDispatchToProps = (dispatch: Function) => ({})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(ApplicationContent))