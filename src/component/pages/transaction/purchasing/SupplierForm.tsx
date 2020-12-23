

import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import TransactionPurchasingService from './../../../../services/TransactionPurchasingService';
import Supplier from './../../../../models/Supplier';
import ProductFlow from './../../../../models/ProductFlow';
import Modal from '../../../container/Modal';
import MasterDataService from './../../../../services/MasterDataService';
import WebResponse from './../../../../models/WebResponse';
import FormGroup from './../../../form/FormGroup';
interface IState {
    supplier?: Supplier; 
    supplierNotFound: boolean;
}
class SupplierForm extends BaseComponent { 
    masterDataService = MasterDataService.getInstance();
    state: IState = { 
        supplierNotFound: false,
    }
    constructor(props: any) {
        super(props);

    }
    searchSupplier = (e) => {
        e.preventDefault();
        const formData: FormData = new FormData(e.target);
        const id = formData.get('id');
        if (!id) return;
        this.loadSupplier(parseInt(id.toString()));
    }
    supplierLoaded = (response: WebResponse) => {
        if (!response.entities || !response.entities[0]) {
            throw new Error("Supplier not found");
        }
        this.props.setSupplier(response.entities[0]);
        this.setState({ supplier: response.entities[0], supplierNotFound: false });
    }
    supplierNotFound = (e: any) => {
        this.setState({ supplierNotFound: true });
    }
    loadSupplier = (id: number) => {
        this.commonAjax(this.masterDataService.getById,
            this.supplierLoaded, this.supplierNotFound, 'supplier', id);
    }
    render() {
        return (

            <form onSubmit={this.searchSupplier} >
                <Modal toggleable={true} title="Supplier form" footerContent={
                    <Fragment>
                        <input type="submit" className="btn btn-secondary" value="Search" />
                        <input type="reset" className="btn btn-outline-secondary" />
                    </Fragment>
                } >
                    <div className="form-group">
                        <FormGroup label="Code">
                            <input placeholder="Supplier code" required type="number" className="form-control" name="id" />
                        </FormGroup>
                    </div>
                    <SupplierDetail supplier={this.state.supplier} notFound={this.state.supplierNotFound} />
                </Modal>
            </form>
        )
    }

}
const SupplierDetail = (props: { supplier?: Supplier, notFound: boolean }) => {
    const h = '120px';
    if (true == props.notFound) {
        return <div style={{ height: h }}><div className="alert alert-warning">Supplier not found</div></div>
    }
    if (!props.supplier) {
        return <div style={{ height: h }}><div className="alert alert-secondary">Please select supplier</div></div>
    }
    const supplier: Supplier = props.supplier;
    return (
        <div style={{ height: h }}>
            <h2>{supplier.name}</h2>
            <address>
                {supplier.address}<br />
                <abbr title="Contact">Contact: </abbr>{supplier.contact}
            </address>
        </div>
    )
}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(SupplierForm))