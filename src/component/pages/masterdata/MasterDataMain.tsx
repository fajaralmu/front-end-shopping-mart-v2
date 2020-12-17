

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
import Menu from './../../../models/Menu';
import ManagementProperty from '../../../models/ManagementProperty';
import MasterDataList from './MasterDataList';

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
    getCode = () => {
        return this.props.match.params.code;
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadManagamenetPages();
    }
    componentDidUpdate() {
        this.setSidebarMenus();
        if (this.state.code!=this.getCode()) {
            this.setState({code:this.getCode()});
        }
    }

    render() {
        if (this.getCode() != null && this.getCode() != "") {
            return <MasterDataList app={this.parentApp} code={this.getCode()} />
        }
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