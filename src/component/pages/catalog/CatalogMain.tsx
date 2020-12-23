

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Menu from './../../../models/Menu';
import BaseMainMenus from './../../layout/BaseMainMenus';

class CatalogMain extends BaseMainMenus
{   
    constructor(props:any){
        super(props, "Catalog");
    }
    
    render(){
        return (
            <div id="CatalogMain" className="container-fluid">
                <h2>CatalogMain</h2>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
  })
  

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
  )(CatalogMain))