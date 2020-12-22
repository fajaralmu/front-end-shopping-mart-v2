

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
import SupplierForm from './SupplierForm';
import ProductForm from './ProductForm';
import FormGroup from '../../../form/FormGroup';
import Product from '../../../../models/Product';
import AnchorButton from '../../../navigation/AnchorButton';
import Transaction from './../../../../models/Transaction';
interface IState {
    supplier?: Supplier;
    productFlows: ProductFlow[];
    selectedProductFlow?: ProductFlow;
}
class TransactionPurchasing extends BaseComponent {
    transactionPurchasingService = TransactionPurchasingService.getInstance();
    masterDataService = MasterDataService.getInstance();
    productFormRef:React.RefObject<any> = React.createRef();
    state: IState = {
        productFlows: [],
    }
    constructor(props: any) {
        super(props, true);

    }
    setSupplier = (supplier: Supplier) => {
        this.setState({ supplier: supplier });
    }
    setProduct = (product: Product) => {
        const productFlow = ProductFlow.create(product);
        this.setState({ selectedProductFlow: productFlow });
    }
    componentDidUpdate() {
        this.validateLoginStatus();
        console.debug("productFlow: ",this.state.selectedProductFlow);
    }
    componentDidMount() {
        this.validateLoginStatus();
    }
    addToCart = (e) => {
        e.preventDefault();
        if (!this.state.selectedProductFlow) {
            this.showError("Please select product!");
            return;
        }
        const productFlow: ProductFlow = Object.assign(new ProductFlow(), this.state.selectedProductFlow);
        const existInCart: boolean = this.existInCart(productFlow);

        if (existInCart) {
            const app = this;
            this.showConfirmation("Override " + productFlow.product?.name + " data?")
                .then(function (ok) {
                    if (ok) {
                        app.addProductFlowState(productFlow);
                    }
                })
        } else {

            this.addProductFlowState(productFlow);
        }
        e.target.reset();

    }
    addProductFlowState = (productFlow: ProductFlow) => {
        const productFlows: ProductFlow[] = this.state.productFlows;
        const existInCart: boolean = this.existInCart(productFlow);
        if (existInCart) {
            for (let i = 0; i < productFlows.length; i++) {
                const element = productFlows[i];
                if (element.product?.code == productFlow.product?.code) {
                    productFlows[i] = productFlow;
                }
            }
        } else {
            productFlows.push(productFlow);
        }

        this.setState({ productFlows: productFlows });
        this.clearSelectedProductFlow();
    }

    existInCart = (productFlow: ProductFlow) => {
        for (let i = 0; i < this.state.productFlows.length; i++) {
            const element = this.state.productFlows[i];
            if (element.product?.code == productFlow.product?.code) {
                return true;
            }
        }
        return false;
    }

    clearSelectedProductFlow = () => {
        if (!this.state.selectedProductFlow) {
            return;
        }
        this.setState({ selectedProductFlow: undefined });
        if (this.productFormRef.current)
        this.productFormRef.current.setProduct(undefined);
    }
    updateSelectedProductFlowProp = (e) => {
        const productFlow: ProductFlow | undefined = this.state.selectedProductFlow;
        if (!productFlow) {
            this.showError("Please select product!");
            e.target.value = null;
            return;
        }
        const propName = e.target.name;
        const value = e.target.type=='number'?parseInt(e.target.value) : e.target.value;
        productFlow[propName] = value;
        this.setState({ selectedProductFlow: productFlow });

    }
    editProduct = (code:any) => {
        const productFlows =  this.state.productFlows;
        const app= this;
        
        this.showConfirmation("Edit data "+code+"?")
        .then(function(ok){
            let productFlow:ProductFlow|undefined = undefined;
            for (let i = 0; i < productFlows.length; i++) {
                const element = productFlows[i];
                if (element.product?.code ==  code) {
                    productFlow = Object.assign(new ProductFlow(), element);
                }
            }
           
            if (productFlow && ok && app.productFormRef.current) {
                app.setState({selectedProductFlow:productFlow});
                app.productFormRef.current.setProduct(productFlow.product);
            }
        })
    }
    removeProduct = (code:any) => {
        const productFlows =  this.state.productFlows;
        const app= this;
        for (let i = 0; i < productFlows.length; i++) {
            const element = productFlows[i];
            if (element.product?.code ==  code) {
                productFlows.splice(i,1);
                break;
            }
        }
        this.showConfirmationDanger("Remove data?")
        .then(function(ok){
            if (ok) {
                if (app.state.selectedProductFlow && code == app.state.selectedProductFlow.product?.code) {
                    app.clearSelectedProductFlow();
                }
                app.setState({productFlows:productFlows});
            }
        })
        
    }
    submitTransaction = (e) => {
        e.preventDefault();
        const app = this;
        const formData = new FormData(e.target);
        this.showConfirmation("Submit Transactio?")
        .then(function(ok) {
            if (ok) {
                app.doSubmit(formData);
            }
        });
        
    }

    doSubmit = (formData:FormData) => {
        const transaction:Transaction = new Transaction();
        transaction.productFlows = this.state.productFlows;
        transaction.supplier = this.state.supplier;
        const date = formData.get('date');
        transaction.transactionDate =date ? new Date(date.toString()) : new Date();
        this.commonAjax(
            this.transactionPurchasingService.submitTransactionPurchasing,
            this.transactionSucess,
            this.showCommonErrorAlert,
            transaction
        )
    }

    transactionSucess = (response:WebResponse) => {
        const code = response.transaction?.code;
        this.showInfo("Transaction success: "+code);
    }
    
    render() {
        const productFlowsPopulated = this.state.productFlows.length > 0;
        const supplierExist = this.state.supplier != undefined;
        const showSubmitTrxButton = productFlowsPopulated == true && supplierExist == true;
        return (
            <div id="TransactionPurchasing">
                <h2>Purchasing</h2>
                <div className="row">
                    <div className="col-md-6" >
                        <ProductForm ref={this.productFormRef} setProduct={this.setProduct} app={this.parentApp} />
                    </div>
                    <div className="col-md-6">
                        <SupplierForm setSupplier={this.setSupplier} app={this.parentApp} />
                    </div>
                    <div className="col-md-6">
                        <form onSubmit={this.addToCart} >
                            <Modal title={"Product Data"} footerContent={<Fragment>
                                <input type="submit" className="btn btn-info" value="Add" />
                                <input type="reset" className="btn btn-warning" value="Reset" />
                            </Fragment>}>
                                <FormGroup label="Quantity">
                                    <input defaultValue={this.state.selectedProductFlow?.count} type="number" onChange={this.updateSelectedProductFlowProp} name="count" required min="1" className="form-control" />
                                </FormGroup>
                                <FormGroup label="Price @Unit">
                                    <input defaultValue={this.state.selectedProductFlow?.price} type="number" onChange={this.updateSelectedProductFlowProp} name="price" min="0" required className="form-control" />
                                </FormGroup>
                                <FormGroup label="Expired Date">
                                    <input defaultValue={new String(this.state.selectedProductFlow?.expiryDate).toString()} type="date" onChange={this.updateSelectedProductFlowProp} name="expiryDate" required className="form-control" />
                                </FormGroup>
                            </Modal>
                        </form>
                    </div>
                    <div className="col-md-6">
                        {showSubmitTrxButton?
                        <form onSubmit={this.submitTransaction}>
                            <Modal title="Action">
                                <FormGroup label="Date">
                                    <input required type="date" name="date" className="form-control" />
                                </FormGroup>
                                <FormGroup label="Action">
                                    <div>
                                        <input type="submit" className="btn btn-primary" value="Submit Transaction"/>
                                    </div>
                                </FormGroup>
                            </Modal>
                        </form>:null}
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
                                        <th>Exp Date</th>
                                        <th>Price</th>
                                        <th>Total Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.productFlows.map((productFlow, i) => {
                                        return (
                                            <tr key={"pf_"+i}>
                                                <td>{i + 1}</td>
                                                <td>{productFlow.product?.name}</td>
                                                <td>{productFlow.count}</td>
                                                <td>{productFlow.product?.unit?.name}</td>
                                                <td>{productFlow.expiryDate}</td>
                                                <td>{productFlow.price}</td>
                                                <td>{(productFlow.count ?? 0) * (productFlow.price ?? 0)}</td>
                                                <td>
                                                    <AnchorButton onClick={(e)=>this.editProduct(productFlow.product?.code)} iconClassName="fas fa-edit" className="btn btn-warning btn-sm" >edit</AnchorButton>
                                                    <AnchorButton onClick={(e)=>this.removeProduct(productFlow.product?.code)} iconClassName="fas fa-times" className="btn btn-danger btn-sm" >remove</AnchorButton>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <td colSpan={2}><strong>Total</strong></td>
                                        <td>{totalUnitAndPrice(this.state.productFlows).unit}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>{totalUnitAndPrice(this.state.productFlows).price}</td>
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

const totalUnitAndPrice = (productFlows:ProductFlow[]):{unit:number, price:number} => {
    let totalUnit:number = 0, totalPrice:number = 0;
    for (let i = 0; i < productFlows.length; i++) {
        const element = productFlows[i];
        totalUnit+=(element.count?element.count:0);
        totalPrice+=((element.count??0)*(element.price??0));
    }
    return {
        unit:totalUnit,
        price:totalPrice    
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps, 
)(TransactionPurchasing))