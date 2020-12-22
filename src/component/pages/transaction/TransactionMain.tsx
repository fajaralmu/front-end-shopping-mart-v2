

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';

class TransactionMain extends BaseMainMenus
{
    constructor(props:any){
        super(props, "Transaction", true);
     
    }

    render(){
        return (
            <div id="TransactionMain" className="container-fluid">
                <h2>Transaction Page</h2>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
  })
  

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
  )(TransactionMain))