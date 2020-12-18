

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
import FormInputField from './FormInputField';
import { FieldType } from '../../../models/FieldType';
import { toBase64FromFile } from './../../../utils/ComponentUtil';

class MasterDataForm extends BaseComponent {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    
    waiting: number = 0;
    timeout?: any = undefined;
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
            .then(function (ok) {
                if (ok) { app.submit(form) }
            });
    }

    submit = (form: HTMLFormElement) => {
        const formData: FormData = new FormData(form);
        const object = {}, app = this;
        formData.forEach((value, key) => {
            const element = EntityProperty.getEntityElement(this.getEntityProperty(), key);
            if (!element) return false;
            switch (element.fieldType) {
                case FieldType.FIELD_TYPE_DYNAMIC_LIST:
                case FieldType.FIELD_TYPE_FIXED_LIST:
                    const valueAttr = element.optionValueName;
                    if (valueAttr) {
                        object[key] = { [valueAttr]: value }
                    }
                    break;
                case FieldType.FIELD_TYPE_IMAGE:
                    this. waiting += 1;
                    toBase64FromFile(value).then(data => {
                        object[key] = data;
                        app.decrementWaiting();
                    }).catch(this.decrementWaiting)
                    .finally();
                    break;
                default:
                    object[key] = value;
                    break;
            }
            return true;
        });

        this.timeout = setTimeout(function(){
            app.waitAndStore(object);
        }, 1);

    }
    waitAndStore = (object:any) => {
        while (this.waiting) {
            console.debug("WAITING.......", this.waiting);
        }
        console.debug("OBJ: ", object);
        clearTimeout(this.timeout);
        this.ajaxSubmit(object);
    }
    decrementWaiting = () => {
        this. waiting -= 1; console.warn("WAIITNG: ", this.waiting);
    }
    ajaxSubmit = (object: any) => {
        this.commonAjax(
            this.masterDataService.save, this.recordSaved, this.showCommonErrorAlert,
            this.getEntityProperty().entityName, object
        )
    }
    recordSaved = (response: WebResponse) => {
        this.showInfo("Record saved");
    }
    render() {
        const entityProperty: EntityProperty = this.getEntityProperty();
        return (
            <div id="MasterDataForm" className="container-fluid">
                <AnchorButton style={{ marginBottom: '5px' }} onClick={this.props.onClose} iconClassName="fas fa-angle-left">Back</AnchorButton>
                <form onSubmit={this.onSubmit} id="record-form">
                    <Modal title={entityProperty.alias + " Record Form"} footerContent={<SubmitReset />}>
                        <InputFields app={this.parentApp} entityProperty={entityProperty} />
                    </Modal>
                </form>
            </div>
        )
    }
}

const SubmitReset = (props) => {
    return (
        <div className="btn-group">
            <button type="submit" className="btn btn-primary">Submit</button>
            <input type="reset" className="btn btn-warning" />
        </div>
    )
}

const InputFields = (props: { app: any, entityProperty: EntityProperty }) => {
    const element: EntityElement[] = props.entityProperty.elements;
    return (
        <div>
            {element.map(element => {
                return <FormInputField app={props.app} entityElement={element} />
            })}
        </div>
    )
}
export default withRouter(connect(mapCommonUserStateToProps)(MasterDataForm))