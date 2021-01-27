

import React,  { ChangeEvent  } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseMainMenus from '../../../layout/BaseMainMenus'; 
import LoadBalanceForm from './LoadBalanceForm';
import LoadInventoryForm from './LoadInventoryForm';


class DashboardMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Dashboard", true);
    }
  
    render() {
        return (
            <div id="DashboardMain" className="container-fluid">
                <h2>Dashboard</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
                <LoadBalanceForm app={this.parentApp} />
                <p></p>
                <LoadInventoryForm app={this.parentApp} />
            </div>
        )
    }

} 

export default withRouter(connect(
    mapCommonUserStateToProps, 
)(DashboardMain))