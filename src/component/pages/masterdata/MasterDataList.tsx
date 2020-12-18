

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
import EntityProperty from './../../../models/EntityProperty';
interface IState {
    entityProperty?:EntityProperty
}
class MasterDataList extends BaseComponent {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    code: string = "";
    state:IState = {
        entityProperty:undefined
    }
    constructor(props: any) {
        super(props, true);

    }
    entityPropertyLoaded=(response: WebResponse)=> {
        this.masterDataService.setEntityProperty(this.props.code, response.entityProperty);
        this.setState({entityProperty: response.entityProperty });
    }
    componentDidUpdate() {
        if (this.code != this.props.code) {
            this.code = this.props.code;
            this.loadEntityProperty();
        }
        console.debug("updated this.props.code: ", this.props.code);
    }
    componentDidMount() {
        this.loadEntityProperty();
    }
    loadEntityProperty() {
        if (this.masterDataService.getEntityProperty(this.props.code)) {
            this.setState({entityProperty:this.masterDataService.getEntityProperty(this.props.code)});
            return;
        }
        this.setState({entityProperty:undefined});
        this.commonAjax(
            this.masterDataService.loadEntityProperty,
            this.entityPropertyLoaded,
            this.showCommonErrorAlert,
            this.props.code
        )
    }
    render() {
        if (this.state.entityProperty == undefined) {
            return <div id="MasterDataList">
                <h3>Please Wait</h3>
            </div>
        }
        return (
            <div id="MasterDataList">
                <h2>{this.state.entityProperty.entityName?.toUpperCase()}</h2>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(MasterDataList))