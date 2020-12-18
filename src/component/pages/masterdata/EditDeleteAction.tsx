

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';
import MasterDataService from './../../../services/MasterDataService';
import AnchorButton from './../../navigation/AnchorButton';
import EntityProperty from '../../../models/EntityProperty';
import WebResponse from './../../../models/WebResponse';

class EditDeleteAction extends BaseComponent {
    masterDataService:MasterDataService = MasterDataService.getInstance();
    constructor(props: any) {
        super(props, true);
    }
    delete = (e) => {
        const app = this;
        this.showConfirmation("Delete record")
        .then(function(ok){
            if (ok) {
                app.doDelete();
            }
        });
    }
    doDelete = () => {
        const record = this.props.record;
        const entityProperty:EntityProperty = this.props.entityProperty;
        const recordId = EntityProperty.getRecordId(record, entityProperty);
        this.commonAjax(
            this.masterDataService.delete,
            this.recordDeleted,
            this.showCommonErrorAlert,
            entityProperty.entityName, recordId
        )
    }
    recordDeleted = (response:WebResponse) => {
        this.showInfo("Record deleted");
        this.props.reload();
    }
    render() {
        return (
            <div className="btn-group">
                <AnchorButton iconClassName="fas fa-edit"></AnchorButton>
                <AnchorButton onClick={this.delete} className="btn btn-danger" iconClassName="fas fa-trash"></AnchorButton>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(EditDeleteAction))