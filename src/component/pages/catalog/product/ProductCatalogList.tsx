
import React, { Component, Fragment } from 'react';
import { baseImageUrl } from '../../../../constant/Url';
import { beautifyNominal } from '../../../../utils/StringUtil';
import Product from './../../../../models/Product';
import Modal from './../../../container/Modal';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import { updateCart } from './../../../../redux/actionCreators';
import { withRouter, Link } from 'react-router-dom'; 
import AnchorButton from './../../../navigation/AnchorButton'; 
import BaseComponent from './../../../BaseComponent'; 
import Carousel from '../../../container/Carousel';
class IState {
    showCart: boolean = false
}
class ProductCatalogList extends BaseComponent
{
    state:IState = new IState();
    constructor(props) {
        super(props, false);
    }
    showShoppingCart = (e) => {
        this.setState({ showCart: true });
    }
    hideShoppingCart = (e) => {
        this.setState({ showCart: false });
    }
    getProductInCart = (id: any): Product | undefined => {
        const cart = this.props.cart;
        for (let i = 0; i < cart.length; i++) {
            const element: Product = cart[i];
            if (element.id == id) {
                return element;
            }
        }
        return undefined;
    }
    addOneToCart = (product: Product) => {

        let productInCart = this.getProductInCart(product.id);
        if (!productInCart) {
            productInCart = Object.assign(new Product(), product);
            productInCart.count = 0;
        }
        if (productInCart.count) {
            productInCart.count++;
        } else {
            productInCart.count = 1;
        }
        if ((product.count??0) < productInCart.count) {
            this.showError("Quantity insufficient! "+product.count+ " vs "+productInCart.count);
            return;
        }
        this.setProductToCart(productInCart);
       
    }
    reduceOneFromCart = (product: Product) => {
        let productInCart = this.getProductInCart(product.id);
        if (!productInCart) {
           return;
        }
        if (productInCart.count && productInCart.count > 0) {
            productInCart.count--;
        } else {
            productInCart.count = 0;
        }
        this.setProductToCart(productInCart);
    }
    resetProductCart = (product:Product) => {
        const productCloned = Object.assign(new Product(), product);
        productCloned.count = 0;
        this.setProductToCart(productCloned);
    }
    resetAllShoppingCart = (e) => {
        const app = this;
        this.showConfirmationDanger("Reset Shopping Cart?")
        .then(function(ok) {
            if (ok) {
                app.props.updateCart([], app, app.parentApp ); 
            }
        })
        
    }
    getShoppingCartCounts = () => {
       return Product.countSummary(this.props.cart);

    }
    setProductToCart = (product: Product) => {
        // console.debug("SET PRODUCT TO CART: ", product);
        const cart = this.props.cart
        let found = false;
        for (let i = 0; i < cart.length; i++) {
            const element: Product = cart[i];
            if (element.id == product.id) {
                cart[i] = product;
                found = true;
                break;
            }
        }
        if (!found) {
            cart.push(product);
        }
        this.props.updateCart(cart, this, this.parentApp ); 
    } 
    render() {
        const props = this.props;
        const showCart: boolean = this.state.showCart;
        return (
            <Modal title="Product List">
                <div className="btn-group" style={{ marginBottom: '5px' }}>
                    <AnchorButton onClick={this.showShoppingCart} show={showCart == false} className="btn btn-secondary btn-sm" iconClassName="fas fa-angle-down">Show Shopping Cart</AnchorButton>
                    <AnchorButton onClick={this.hideShoppingCart} show={showCart == true} className="btn btn-secondary btn-sm" iconClassName="fas fa-angle-up">Hide Shopping Cart</AnchorButton>
                    <AnchorButton onClick={this.resetAllShoppingCart} show={showCart == true} className="btn btn-danger btn-sm" iconClassName="fas fa-cart-arrow-down">Reset Cart</AnchorButton>
                    <AnchorButton show={showCart == true} className="btn btn-warning btn-sm" >{this.getShoppingCartCounts()}</AnchorButton>
                </div>
                <div className="row">
                    {props.products.map((product:Product) => {
                        const imgName = product.imageUrl ? product.imageUrl.split("~")[0] ?? 'Default.bmp' : 'Default.bmp';
                        const productInCart = this.getProductInCart(product.id);
                        return (
                            <div key={"product_catalog_"+product.id} className="col-md-2 catalog-item rounded border">
                                <img className="rounded img-fluid" src={baseImageUrl + imgName} /> 
                                <Link to={"/catalog/product/"+product.code}
                                //  target="_blank" 
                                 ><h6>{product.name}</h6></Link>
                                <span className="text-info"><strong>{beautifyNominal(product.price)}</strong></span>
                                {props.withStock ? <span style={{ marginLeft: '5px' }} className={(product.count??0)>0?'badge badge-warning text-dark':'badge badge-dark'}>{product.count}</span> : null}
                                {showCart ?
                                    <div><div className="btn-group">
                                            <AnchorButton onClick={(e)=>this.addOneToCart(product)} iconClassName="fas fa-plus" className="btn btn-primary btn-sm" />
                                            <AnchorButton className="btn btn-outline-info btn-sm"><strong>{productInCart?.count??0}</strong></AnchorButton>
                                            <AnchorButton onClick={(e)=>this.reduceOneFromCart(product)} iconClassName="fas fa-minus" className="btn btn-primary btn-sm" />
                                            <AnchorButton onClick={(e)=>this.resetProductCart(product)} iconClassName="fas fa-sync-alt" className="btn btn-warning btn-sm" />
                                        </div>
                                    </div>
                                    : null}
                            </div>
                        )
                    })}
                </div>
            </Modal>
        )
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    updateCart: (cart: Product[], ...apps:any[] ) => dispatch(updateCart(cart, ...apps)),
})
export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(ProductCatalogList))