

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
import Menu from './../../../models/Menu';
import ManagementProperty from '../../../models/ManagementProperty';

interface IState {
    // managementProperties:ManagementProperty[]
}
class MasterDataMain extends BaseMainMenus {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    state: IState = {
    };
    constructor(props: any) {
        super(props, "Master Data", true);
    }
   
    managementPropertiesLoaded = (response: WebResponse) => {
        this.masterDataService.managementProperties = response.generalList ? response.generalList : [];
        this.setSidebarMenus();
    }
    setSidebarMenus = () => {
        const sidebarMenus: Menu[] = [];
        const managementProperties: ManagementProperty[] = this.masterDataService.getManagementProperties();
        for (let i = 0; i < managementProperties.length; i++) {
            const element = managementProperties[i];
            sidebarMenus.push({
                name: element.label,
                url: element.entityName,
                code: element.entityName
            });
        }
        if (this.props.setSidebarMenus) {
            this.props.setSidebarMenus(sidebarMenus);
        }
    }
    loadManagamenetPages = () => {
        if (this.masterDataService.managementProperties.length > 0) {
            this.setSidebarMenus();
            this.refresh();
            return;
        }
        this.commonAjax(
            this.masterDataService.loadManagementProperties,
            this.managementPropertiesLoaded,
            this.showCommonErrorAlert
        );
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadManagamenetPages();
    }
    componentDidUpdate() {
        console.debug("MASTER DATA UPDATED");
        this.setSidebarMenus();
    }

    render() {
        return (
            <div id="MasterDataMain">
                <h2>MasterDataMain</h2>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(MasterDataMain))