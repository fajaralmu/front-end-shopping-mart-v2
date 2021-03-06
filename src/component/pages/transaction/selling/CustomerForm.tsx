

import React, { ChangeEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import Customer from '../../../../models/Customer';
import Modal from '../../../container/Modal';
import MasterDataService from '../../../../services/MasterDataService';
import WebResponse from '../../../../models/WebResponse';
import FormGroup from './../../../form/FormGroup';
import AnchorWithIcon from './../../../navigation/AnchorWithIcon';
import Spinner from './../../../loader/Spinner';
interface IState {
    customer?: Customer;
    customerNotFound: boolean;
    loading:boolean;
    code:string
}
class CustomerForm extends BaseComponent {
    masterDataService:MasterDataService;
    state: IState = {
        customerNotFound: false, loading:false, code: ""
    }
    constructor(props: any) {
        super(props);
        this.masterDataService = this.getServices().masterDataService;

    }
    updateField = (e:ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const name:string|null = target.getAttribute("name");
        if (null == name) return;
        this.setState({[name]: target.value});
    }
    startLoading = () => this.setState({loading:true});
    endLoading = () => this.setState({loading:false});
    searchCustomer = (e) => {
        e.preventDefault();
        e.preventDefault();
        const code:string = this.state.code;
        if (code.trim() == "") return;
        this.loadCustomer(parseInt(code));
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
    reset = (e:any) => {
        this.setState({code:""})
    }
    render() {
        return (

            <form onSubmit={this.searchCustomer} >
                <Modal toggleable={true}  title="Customer form" footerContent={
                    <Fragment>
                        <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/customer" className="btn btn-outline-secondary" />
                        <input type="submit" className="btn btn-secondary" value="Search" />
                        <input type="reset" onClick={this.reset} className="btn btn-outline-secondary" />
                    </Fragment>
                } >
                    <div className="form-group">
                        <FormGroup label="Code">
                            <input placeholder="Customer code" value={this.state.code} onChange={this.updateField} required type="number" className="form-control" name="code" />
                        </FormGroup>
                    </div>
                    <CustomerDetail loading={this.state.loading} customer={this.state.customer} notFound={this.state.customerNotFound} />
                </Modal>
            </form>
        )
    }

}
const CustomerDetail = (props: { loading:boolean, customer?: Customer, notFound: boolean }) => {
    const style = { height: '120px' };
    if (props.loading) {
        return <div style={style}><Spinner/></div>
    }
    if (true == props.notFound) {
        return <div style={style}><div className="alert alert-warning">Customer not found</div></div>
    }
    if (!props.customer) {
        return <div style={style}><div className="alert alert-secondary">Please select customer</div></div>
    }
    const customer: Customer = props.customer;
    return (
        <div style={style}>
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