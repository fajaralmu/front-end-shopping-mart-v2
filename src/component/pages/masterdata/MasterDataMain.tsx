

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
import Loader from '../../loader/Loader';
import Card from '../../container/Card';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';

interface IState {
    code?: string
    // managementProperties:ManagementProperty[]
}
class MasterDataMain extends BaseMainMenus {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    state: IState = {
        code: undefined
    };
    constructor(props: any) {
        super(props, "Master Data", true);
    }

    managementPropertiesLoaded = (response: WebResponse) => {
        this.masterDataService.managementProperties = response.generalList ? response.generalList : [];
        this.setSidebarMenus();
        this.refresh();
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
    getCode = (): string => {
        return this.props.match.params.code;
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadManagamenetPages();
    }
    componentDidUpdate() {
        this.setSidebarMenus();
        console.debug("this.getCode(): ", this.getCode());
        if (this.state.code != this.getCode()) {
            this.setState({ code: this.getCode() });
        }
    }

    render() {
        if (this.getCode() != undefined && this.getCode() != null && this.getCode() != "") {
            return <MasterDataManagement app={this.parentApp} code={this.getCode()} />
        }
        if (this.masterDataService.managementProperties.length == 0) {
            return <div className="container-fluid"><h3>Loading</h3></div>
        }
        const properties: ManagementProperty[] = this.masterDataService.managementProperties;
        return (
            <div className="container-fluid">
                <h2>Master Data Page</h2>
                <div className="row">
                    {properties.map(property => {

                        return (
                            <div className="col-md-3" style={{ marginBottom: '10px' }}>
                                <Card className="text-white bg-secondary">
                                    <div className="row">
                                        <div className="col-md-2"  >
                                            <h4  ><i className={property.iconClassName} /></h4>
                                        </div>
                                        <div className="col-md-10">
                                            <h4>{property.label}</h4>
                                            <AnchorWithIcon className="btn btn-light" iconClassName="fas fa-angle-right" to={"/management/" + property.entityName} >View Page</AnchorWithIcon>
                                        </div>
                                    </div>

                                </Card>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps
)(MasterDataMain))