

import  React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';

class SideBar extends BaseComponent
{
    constructor(props:any){
        super(props, false);
    }
    render(){
        return (
            <div id="sidebar">
                <h2>SideBar</h2>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
    performLogout: (app:any) => dispatch(performLogout(app))
  })
  

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
  )(SideBar))