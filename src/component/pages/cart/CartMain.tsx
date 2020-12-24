

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';

class CartMain extends BaseMainMenus
{
    constructor(props:any){
        super(props, "My Cart");
    }
    render(){
        return (
            <div id="CartMain" className="container-fluid">
                <h2>My Shopping Cart</h2>
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