

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
import Menu from './../../../models/Menu';
import ManagementProperty from '../../../models/ManagementProperty';
import MasterDataManagement from './MasterDataManagement';

interface IState {
    code?:string
    // managementProperties:ManagementProperty[]
}
class MasterDataMain extends BaseMainMenus {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    state: IState = {
        code : undefined
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
        const managementProperties: ManagementProperty[] = this.masterDataService.managementProperties;
        for (let i = 0; i < managementProperties.length; i++) {
            const element = managementProperties[i];
            sidebarMenus.push({
                name: element.label,
                url: element.entityName,
                code: element.entityName,
                menuClass: element.iconClassName 
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
    getCode = ():string => {
        return this.props.match.params.code;
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadManagamenetPages();
    }
    componentDidUpdate() {
        this.setSidebarMenus();
        console.debug("this.getCode(): ", this.getCode());
        if (this.state.code!=this.getCode()) {
            this.setState({code:this.getCode()});
        }
    }

    render() {
        if (this.getCode()!=undefined && this.getCode() != null && this.getCode() != "") {
            return <MasterDataManagement app={this.parentApp} code={this.getCode()} />
        }
        return (
            <div id="MasterDataMain" className="container-fluid">
                <h2>Master Data Page</h2>
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