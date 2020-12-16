

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';

class TransactionMain extends BaseComponent
{
    constructor(props:any){
        super(props, true);
    }
    
    componentDidMount() {
        document.title = "Transaction";
    }
    render(){
        return (
            <div id="TransactionMain">
                <h2>TransactionMain</h2>
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