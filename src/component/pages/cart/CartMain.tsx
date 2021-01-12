

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';
import Product from './../../../models/Product';

class CartMain extends BaseMainMenus
{
    constructor(props:any){
        super(props, "Shopping Cart");
    }
    render(){
        return (
            <div id="CartMain" className="container-fluid">
                <h2>Shopping Cart</h2>
                <div className="alert alert-info">
                   <p>Plan your shopping list</p>
                   <p>Current items: <strong>{Product.countSummary(this.props.cart)}</strong></p>
                    </div>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
  })
  

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
  )(CartMain))