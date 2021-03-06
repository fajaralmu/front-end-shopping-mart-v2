

import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Product from './../../../models/Product';
import SimpleError from '../../alert/SimpleError';
import Modal from '../../container/Modal';
import { beautifyNominal } from '../../../utils/StringUtil';
import { baseImageUrl } from '../../../constant/Url';
import AnchorButton from '../../navigation/AnchorButton';
import { updateCart } from './../../../redux/actionCreators';

class CartList extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }
    componentDidMount() {
        document.title = "Shopping Cart List";
    }
    removeFromCart = (product:Product) => {
        const app = this;
        this.showConfirmationDanger("Remove "+product.name+" from shopping list?")
        .then(function(ok) {
            if (ok) {
                app.doRemoveFromCart(product);
            }
        })
    }
    doRemoveFromCart = (product:Product) => {
        const cart:Product[] = this.props.cart
        for (let i = 0; i < cart.length; i++) {
            const element: Product = cart[i];
            if (element.id == product.id) {
                cart.splice(i, 1);
                break;
            }
        }
        this.props.updateCart(cart, this, this.parentApp );
    }
    render() {
        const cartList: Product[] = this.props.cart;
        let totalUnit: number = 0, totalPrice: number = 0;
        return (
            <div className="container-fluid">
                <h2>Shopping Cart List</h2>
                <SimpleError show={cartList.length == 0}>No shopping item</SimpleError>

                <table className="table table-fluid table-striped" style={{display: cartList.length>0?'block':'none'}}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th colSpan={2}>Product</th>
                            <th>Qty</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>Total Price</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartList.map((product, i) => {
                            totalUnit += (product.count ?? 0);
                            totalPrice += ((product.count ?? 0) * (product.price ?? 0));
                            let imgName = Product.getDefaultPicture(product);
                            const imgUrl = baseImageUrl + imgName;
                            return (
                                <tr key={"cart-" + i}>
                                    <td>{i + 1}</td>
                                    <td><img height="150" src={imgUrl} /></td>
                                    <td>{product.name}</td>
                                    <td>{beautifyNominal(product.count)}</td>
                                    <td>{product.unit?.name}</td>
                                    <td>{beautifyNominal(product.price)}</td>
                                    <td>{beautifyNominal((product.count ?? 0) * (product.price ?? 0))}</td>
                                    <td>
                                        <AnchorButton onClick={(e)=>this.removeFromCart(product)} iconClassName="fas fa-times" className="btn btn-outline-danger"/>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td colSpan={3}>Total</td>
                            <td>{beautifyNominal(totalUnit)}</td>
                            <td colSpan={2}></td>
                            <td>{beautifyNominal(totalPrice)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

            </div>
        )
    }

}

const mapDispatchToProps = (dispatch: Function) => ({
    updateCart: (cart: Product[], ...apps:any[] ) => dispatch(updateCart(cart, ...apps)),
})
export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(CartList))