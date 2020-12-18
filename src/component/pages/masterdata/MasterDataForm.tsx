

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
        const promises: Promise<any>[] = new Array();
        formData.forEach((value, key) => {
            if (!object[key]) {
                object[key] = new Array();
            }
            const element = EntityProperty.getEntityElement(this.getEntityProperty(), key);
            if (!element) return false;
            switch (element.fieldType) {
                case FieldType.FIELD_TYPE_DYNAMIC_LIST:
                case FieldType.FIELD_TYPE_FIXED_LIST:
                    const valueAttr = element.optionValueName;
                    if (valueAttr) {
                        object[key].push({ [valueAttr]: value })
                    }
                    break;
                case FieldType.FIELD_TYPE_IMAGE:
                    console.debug("img = ", key);
                    let promise = toBase64FromFile(value).then(data => {
                        object[key].push(data);
                    }).catch(console.error)
                        .finally(function () { console.debug("finish") });
                    promises.push(promise);
                    break;
                default:
                    object[key].push(value);
                    break;
            }
            return true;
        });

        Promise.all(promises).then(function (val) {
            const objectPayload = app.generateRequestPayload(object);
            console.debug("OBJ: ", objectPayload);
            app.ajaxSubmit(objectPayload);
        });
    }
    generateRequestPayload = (rawObject: {}): {} => {
        const result = {};
        for (const key in rawObject) {
            const element:any[] = rawObject[key];
            if (element.length == 1) {
                result[key] = element[0];    
            } else if (element.length > 1) {
                result[key] = element.join("~");
            }
        }
        return result;
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