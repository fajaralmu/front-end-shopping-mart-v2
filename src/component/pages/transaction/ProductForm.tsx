

import React, { ChangeEvent, Fragment } from 'react';
import BaseComponent from '../../BaseComponent';
import TransactionPurchasingService from '../../../services/TransactionPurchasingService';
import Product from '../../../models/Product';
import ProductFlow from '../../../models/ProductFlow';
import Modal from '../../container/Modal';
import MasterDataService from '../../../services/MasterDataService';
import WebResponse from '../../../models/WebResponse';
import FormGroup from './../../form/FormGroup';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import Spinner from '../../loader/Spinner';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
interface IState {
    product?: Product; 
    selectedProductFlow?: ProductFlow;
    productNotFound: boolean;
    loading:boolean;
    productCode:string;
}
 class ProductForm extends BaseComponent {

    transactionPurchasingService : TransactionPurchasingService;
    masterDataService : MasterDataService;
    state: IState = {
        productNotFound: false,
        loading:false,
        productCode:""
    }
    constructor(props: any) {
        super(props);
        this.state = { ...this.state };
        this.transactionPurchasingService = this.getServices().transactionPurchasingService;
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
    reset = (e:any) => {
        this.setState({productCode:""})
    }
    searchProduct = (e) => {
        e.preventDefault();
        const id:string = this.state.productCode;
        if (id.trim() == "") return;
        this.loadProduct(id);
    }
    productLoaded = (response: WebResponse) => {
        if (!response.entities || !response.entities[0]) {
            throw new Error("Product not found");
        }
        this.props.setProduct(response.entities[0]);
        this.setState({ product: response.entities[0], productNotFound: false });
    }
    setProduct = (product: Product) => {
        this.setState({ product: product, productNotFound: false });
    }
    productNotFound = (e: any) => {
        this.setState({ productNotFound: true });
    }
    loadProduct = (code: string) => {
        // this.commonAjax(this.masterDataService.getBy,
        //     this.productLoaded, this.productNotFound, 'product', { code: code });

        this.commonAjaxWithProgress(this.transactionPurchasingService.getStockInfo,
            this.productLoaded, this.productNotFound, code);
    }
    render() {
        return (

            <form onSubmit={this.searchProduct} >
               
                <Modal toggleable={true}  title="Product form" footerContent={
                    <Fragment>
                        <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/product" className="btn btn-outline-secondary" />
                        <input type="submit" className="btn btn-secondary" value="Search" />
                        <input type="reset" onClick={this.reset} className="btn btn-outline-secondary" />
                    </Fragment>
                } >
                    <div className="form-group">
                        <FormGroup label="Code">
                            <input onChange={this.updateField} value={this.state.productCode} placeholder="Product code" required type="text" className="form-control" name="productCode" />
                        </FormGroup>
                    </div> 
                    
                    <ProductDetail loading={this.state.loading} product={this.state.product} notFound={this.state.productNotFound} />
                </Modal>
            </form>
        )
    }

}
const ProductDetail = (props: { loading:boolean, product?: Product, notFound: boolean }) => {
   const style = { height: '120px' };
    if (props.loading) {
        return <div style={style}><Spinner/></div>
    }
    if (true == props.notFound) {
        return <div style={style}><div className="alert alert-warning">Product not found</div></div>
    }
    if (!props.product) {
        return <div style={style}><div className="alert alert-secondary">Please select product</div></div>
    }
    const product: Product = props.product;
    return (
        <div style={style}>
            <h4>{product.name}</h4>
            <table className="table">
                <thead><tr>
                    <th>Unit</th>
                    <th>Category</th>
                    <th>Price@Unit</th>
                    <th>Qty</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{product.unit ? product.unit.name : '-'}</td>
                        <td>{product.category ? product.category.name : '-'}</td>
                        <td style={{ fontFamily: 'monospace' }}>{product.price}</td>
                        <td>{product.count}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default withRouter(connect(
    mapCommonUserStateToProps,
)(ProductForm))