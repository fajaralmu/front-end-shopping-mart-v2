

import React, { Fragment } from 'react';
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
interface IState {
    product?: Product;
    productFlows: ProductFlow[];
    selectedProductFlow?: ProductFlow;
    productNotFound: boolean;
    loading:boolean;
}
export default class ProductForm extends BaseComponent {

    transactionService = TransactionPurchasingService.getInstance();
    masterDataService = MasterDataService.getInstance();
    state: IState = {
        productFlows: [],
        productNotFound: false,
        loading:false
    }
    constructor(props: any) {
        super(props);
        this.state = { ...this.state };

    }
    startLoading = () => this.setState({loading:true});
    endLoading = () => this.setState({loading:false});
    searchProduct = (e) => {
        e.preventDefault();
        const formData: FormData = new FormData(e.target);
        const id = formData.get('code');
        if (!id) return;
        this.loadProduct((id.toString()));
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

        this.commonAjaxWithProgress(this.transactionService.getStockInfo,
            this.productLoaded, this.productNotFound, code);
    }
    render() {
        return (

            <form onSubmit={this.searchProduct} >
               
                <Modal toggleable={true}  title="Product form" footerContent={
                    <Fragment>
                        <AnchorWithIcon iconClassName="fas fa-list" attributes={{ target: '_blank' }} to="/management/product" className="btn btn-outline-secondary" />
                        <input type="submit" className="btn btn-secondary" value="Search" />
                        <input type="reset" className="btn btn-outline-secondary" />
                    </Fragment>
                } >
                    <div className="form-group">
                        <FormGroup label="Code">
                            <input placeholder="Product code" required type="text" className="form-control" name="code" />
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
                    <th>Current Amount</th>
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
const mapDispatchToProps = (dispatch: Function) => ({
})
