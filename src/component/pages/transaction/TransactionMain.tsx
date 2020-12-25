

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';
import Card from './../../container/Card';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';

class TransactionMain extends BaseMainMenus
{
    constructor(props:any){
        super(props, "Transaction", true);
     
    }

    render(){
        return (
            <div id="TransactionMain" className="container-fluid">
                <h2>Transaction Page</h2>
                <div className="row">
                    <div className="col-md-4">
                        <Card title="Selling" className="bg-light">
                            <h4>Selling</h4>
                            <AnchorWithIcon className="btn btn-info" to="/transaction/selling">View Page</AnchorWithIcon>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card title="Purchasing" className="bg-light">
                            <h4>Purchasing</h4>
                            <AnchorWithIcon className="btn btn-info" to="/transaction/purchasing">View Page</AnchorWithIcon>
                        </Card>
                    </div>
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
  )(TransactionMain))