

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';

class CartMain extends BaseComponent
{
    constructor(props:any){
        super(props, false);
    }
    componentDidMount() {
        document.title = "My Cart";
    }
    render(){
        return (
            <div id="CartMain">
                <h2>CartMain</h2>
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