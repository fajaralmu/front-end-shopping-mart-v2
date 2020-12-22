
import BaseComponent from './../../BaseComponent';
import ProductFlow from './../../../models/ProductFlow';
import Supplier from './../../../models/Supplier';
import Product from '../../../models/Product';
import React from 'react';
import MasterDataService from './../../../services/MasterDataService';
import Customer from './../../../models/Customer';
interface IState {
    supplier?: Supplier;
    productFlows: ProductFlow[];
    selectedProductFlow?: ProductFlow;
    customer?:Customer
}
export default class BaseTransactionComponent extends BaseComponent {
    masterDataService = MasterDataService.getInstance();
    state: IState = {
        productFlows: []
    }
    productFormRef: React.RefObject<any> = React.createRef();
    constructor(props) {
        super(props, true);
    }
    componentDidUpdate() {
        this.validateLoginStatus();
    }
    componentDidMount() {
        this.validateLoginStatus();
    }
    setProduct = (product: Product) => {
        const productFlow = ProductFlow.create(product);
        this.setState({ selectedProductFlow: productFlow });
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
}

export const totalUnitAndPrice = (productFlows:ProductFlow[]):{unit:number, productFlowPrice:number, productPrice:number} => {
    let totalUnit:number = 0, totalPrice:number = 0, totalProductPrice:number = 0;
    for (let i = 0; i < productFlows.length; i++) {
        const element = productFlows[i];
        totalUnit+=(element.count?element.count:0);
        totalPrice+=((element.count??0)*(element.price??0));
        totalProductPrice+=((element.count??0)*(element.product?.price??0));
    }
    return {
        unit:totalUnit,
        productFlowPrice:totalPrice,
        productPrice:totalProductPrice    
    }
}