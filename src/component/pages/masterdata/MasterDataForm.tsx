

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Modal from '../../container/Modal';
import EntityProperty from './../../../models/EntityProperty';
import EntityElement from './../../../models/EntityElement';
import MasterDataService from './../../../services/MasterDataService';
import AnchorButton from './../../navigation/AnchorButton';
import WebResponse from './../../../models/WebResponse';

class MasterDataForm extends BaseComponent {
    masterDataService:MasterDataService = MasterDataService.getInstance();
    constructor(props: any) {
        super(props, true);
    }
    getEntityProperty(): EntityProperty {
        return this.props.entityProperty;
    }
    componentDidUpdate() {
        if (this.getEntityProperty().editable == false) {
            this.props.onClose();
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        const form = e.target, app = this;
        this.showConfirmation("Save data?")
        .then(function(ok){
            if (ok){
                app.submit(form);
            }
        });
    }

    submit = (form:HTMLFormElement) => {
        const formData:FormData = new FormData(form);
        const object = {};
        formData.forEach((value, key)=>{
            object[key] = value;
        });
        console.debug("obj: ", object);
        this.commonAjax(
            this.masterDataService.save,
            this.recordSaved,
            this.showCommonErrorAlert,
            this.getEntityProperty().entityName,
            object
        )
    }
    recordSaved = (response:WebResponse) => {
        this.showInfo("Record saved");
    }
    render() {
        const entityProperty: EntityProperty = this.getEntityProperty();
        return (
            <div id="MasterDataForm" className="container-fluid">
                <AnchorButton style={{marginBottom:'5px'}} onClick={this.props.onClose} iconClassName="fas fa-angle-left">Back</AnchorButton>
                <form onSubmit={this.onSubmit} id="record-form">
                    <Modal title={entityProperty.alias + " Record Form"} footerContent={<SubmitReset/>}>
                        <InputFields entityProperty={entityProperty}/>
                    </Modal>
                </form>
            </div>
        )
    }
}

const SubmitReset = (props) => {
    return (
        <div className="btn-group">
            <button type="submit" className="btn btn-primary">Submut</button>
            <input type="reset" className="btn btn-warning"/>
        </div>
    )
}

const InputFields = (props:{entityProperty:EntityProperty}) => {
    const element:EntityElement[] = props.entityProperty.elements;
    return (
        <div>
            {element.map(element=>{
                return <InputField entityElement = {element} />
            })}
        </div>
    )
}
const InputField = (props:{entityElement:EntityElement}) => {
    const element = props.entityElement;
    const requiredAttr = {required:false}
    if (element.required == true){
        requiredAttr.required = true;
    }
    let input = <input {...requiredAttr} className="form-control" name={element.id} />
    if (element.idField == true) {
        input = <input {...requiredAttr} value="Generated" className="form-control" name={element.id} disabled />
    }
    return (
        <div className="form-group">
            <label>{element.lableName}</label>
            {input}
        </div>
    )
}

const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(MasterDataForm))