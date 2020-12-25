

import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import TransactionSellingService from '../../../../services/TransactionSellingService';
import Customer from '../../../../models/Customer';
import ProductFlow from '../../../../models/ProductFlow';
import Modal from '../../../container/Modal';
import WebResponse from '../../../../models/WebResponse'; 
import ProductForm from '../ProductForm';
import FormGroup from '../../../form/FormGroup';
import AnchorButton from '../../../navigation/AnchorButton';
import Transaction from '../../../../models/Transaction';
import BaseTransactionComponent, { totalUnitAndPrice } from '../BaseTransactionComponent';
import CustomerForm from './CustomerForm';

class TransactionSelling extends BaseTransactionComponent {
    transactionSellingService = TransactionSellingService.getInstance();
    constructor(props: any) {
        super(props);
    }
    setCustomer = (customer: Customer) => {
        this.setState({ customer: customer });
    }

    updateSaleQty = (e) => {
        const productFlow: ProductFlow | undefined = this.state.selectedProductFlow;
        if (!productFlow) {
            this.showError("Please select product!");
            e.target.value = null;
            return;
        }
        const value = parseInt(e.target.value);
        productFlow.count = value;
        this.setState({ selectedProductFlow: productFlow });
    }

    submitTransaction = (e) => {
        e.preventDefault();
        const app = this;
        const formData = new FormData(e.target);
        this.showConfirmation("Submit Transactio?")
            .then(function (ok) {
                if (ok) {
                    app.doSubmit(formData);
                }
            });
    }

    doSubmit = (formData: FormData) => {
        const transaction: Transaction = new Transaction();
        transaction.productFlows = this.state.productFlows;
        transaction.customer = this.state.customer;
        const date = formData.get('date');
        transaction.transactionDate = date ? new Date(date.toString()) : new Date();
        this.commonAjaxWithProgress(
            this.transactionSellingService.submitTransactionSelling,
            this.transactionSucess,
            this.showCommonErrorAlert,
            transaction
        )
    }

    transactionSucess = (response: WebResponse) => {
        const code = response.transaction?.code;
        this.showInfo("Transaction success: " + code);
    }

    render() {
        const productFlowsPopulated = this.state.productFlows.length > 0;
        const customerExist = this.state.customer != undefined;
        const showSubmitTrxButton = productFlowsPopulated == true && customerExist == true;
        const selectedProductFlow = this.state.selectedProductFlow;
        return (
            <div id="TransactionSelling"  className="container-fluid">
                <h2>Selling</h2>
                <div className="row">
                    <div className="col-md-6" >
                        <ProductForm ref={this.productFormRef} setProduct={this.setProduct} app={this.parentApp} />
                    </div>
                    <div className="col-md-6">
                        <CustomerForm setCustomer={this.setCustomer} app={this.parentApp} />
                    </div>
                    <div className="col-md-6">
                        <form onSubmit={this.addToCart} >
                            <Modal title={"Product Data"} footerContent={<Fragment>
                                <input type="submit" className="btn btn-info" value="Add" />
                                <input type="reset" className="btn btn-warning" value="Reset" />
                            </Fragment>}>
                                <FormGroup label="Quantity">
                                    <input defaultValue={this.state.selectedProductFlow?.count}
                                         type="number" onChange={this.updateSaleQty} name="count" required 
                                         min={1} max={
                                            selectedProductFlow?selectedProductFlow.product?.count:0
                                         } className="form-control" />
                                </FormGroup>
                            </Modal>
                        </form>
                    </div>
                    <div className="col-md-6">
                        {showSubmitTrxButton ?
                            <form onSubmit={this.submitTransaction}>
                                <Modal title="Action">
                                    <FormGroup label="Date">
                                        <input required type="date" name="date" className="form-control" />
                                    </FormGroup>
                                    <FormGroup label="Action">
                                        <div>
                                            <input type="submit" className="btn btn-primary" value="Submit Transaction" />
                                        </div>
                                    </FormGroup>
                                </Modal>
                            </form> : null}
                    </div>
                    <div className="col-md-12">
                        <Modal title="Products">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        {/* <th>Exp Date</th> */}
                                        <th>Price</th>
                                        <th>Total Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.productFlows.map((productFlow, i) => {
                                        return (
                                            <tr key={"pf_" + i}>
                                                <td>{i + 1}</td>
                                                <td>{productFlow.product?.name}</td>
                                                <td>{productFlow.count}</td>
                                                <td>{productFlow.product?.unit?.name}</td>
                                                {/* <td>{productFlow.expiryDate}</td> */}
                                                <td>{productFlow.product?.price}</td>
                                                <td>{(productFlow.count ?? 0) * (productFlow.product?.price ?? 0)}</td>
                                                <td>
                                                    <AnchorButton onClick={(e) => this.editProduct(productFlow.product?.code)} iconClassName="fas fa-edit" className="btn btn-warning btn-sm" >edit</AnchorButton>
                                                    <AnchorButton onClick={(e) => this.removeProduct(productFlow.product?.code)} iconClassName="fas fa-times" className="btn btn-danger btn-sm" >remove</AnchorButton>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <td colSpan={2}><strong>Total</strong></td>
                                        <td>{totalUnitAndPrice(this.state.productFlows).unit}</td>
                                        {/* <td></td> */}
                                        <td></td>
                                        <td></td>
                                        <td>{totalUnitAndPrice(this.state.productFlows).productPrice}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Modal>
                    </div>
                </div>
            </div >
        )
    }
}



export default withRouter(connect(
    mapCommonUserStateToProps,
)(TransactionSelling))