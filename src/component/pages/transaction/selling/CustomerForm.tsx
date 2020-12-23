

import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import Customer from '../../../../models/Customer';
import Modal from '../../../container/Modal';
import MasterDataService from '../../../../services/MasterDataService';
import WebResponse from '../../../../models/WebResponse';
import FormGroup from './../../../form/FormGroup';
interface IState {
    customer?: Customer;
    customerNotFound: boolean;
}
class CustomerForm extends BaseComponent {
    masterDataService = MasterDataService.getInstance();
    state: IState = {
        customerNotFound: false,
    }
    constructor(props: any) {
        super(props);

    }
    searchCustomer = (e) => {
        e.preventDefault();
        const formData: FormData = new FormData(e.target);
        const id = formData.get('id');
        if (!id) return;
        this.loadCustomer(parseInt(id.toString()));
    }
    customerLoaded = (response: WebResponse) => {
        if (!response.entities || !response.entities[0]) {
            throw new Error("Customer not found");
        }
        this.props.setCustomer(response.entities[0]);
        this.setState({ customer: response.entities[0], customerNotFound: false });
    }
    customerNotFound = (e: any) => {
        this.setState({ customerNotFound: true });
    }
    loadCustomer = (id: number) => {
        this.commonAjax(this.masterDataService.getById,
            this.customerLoaded, this.customerNotFound, 'customer', id);
    }
    render() {
        return (

            <form onSubmit={this.searchCustomer} >
                <Modal title="Customer form" footerContent={
                    <Fragment>
                        <input type="submit" className="btn btn-secondary" value="Search" />
                        <input type="reset" className="btn btn-outline-secondary" />
                    </Fragment>
                } >
                    <div className="form-group">
                        <FormGroup label="Code">
                            <input placeholder="Customer code" required type="number" className="form-control" name="id" />
                        </FormGroup>
                    </div>
                    <CustomerDetail customer={this.state.customer} notFound={this.state.customerNotFound} />
                </Modal>
            </form>
        )
    }

}
const CustomerDetail = (props: { customer?: Customer, notFound: boolean }) => {
    const h = '120px';
    if (true == props.notFound) {
        return <div style={{ height: h }}><div className="alert alert-warning">Customer not found</div></div>
    }
    if (!props.customer) {
        return <div style={{ height: h }}><div className="alert alert-secondary">Please select customer</div></div>
    }
    const customer: Customer = props.customer;
    return (
        <div style={{ height: h }}>
            <h2>{customer.name}</h2>
            <address>
                {customer.address}<br />
                <abbr title="Contact">Contact: </abbr>{customer.phone}
            </address>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps,
)(CustomerForm))