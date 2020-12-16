

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';

class DashboardMain extends BaseComponent
{
    constructor(props:any){
        super(props, true);
    }
    
    componentDidMount() {
        this.validateLoginStatus();
        
        document.title = "Dashboard";
    }
    render(){
        return (
            <div id="DashboardMain">
                <h2>DashboardMain</h2>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
  })
  

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
  )(DashboardMain))