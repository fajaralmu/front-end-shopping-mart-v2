

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../../../BaseComponent';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import '../Catalog.css';
import CatalogService from './../../../../services/CatalogService';
import Product from './../../../../models/Product';
import Filter from './../../../../models/Filter';
import WebResponse from './../../../../models/WebResponse';
import Modal from '../../../container/Modal';
import FormGroup from '../../../form/FormGroup';
interface IState {
    products: Product[];
    filter: Filter;
    fieldsFilter: { },
}
class ProductCatalog extends BaseComponent {
        catalogService: CatalogService = CatalogService.getInstance();
    state: IState = {
        products: [],
        filter: {
            limit: 10,
            page: 0,
            
        },
        fieldsFilter:{
            withStock:true
       }
    }
    constructor(props: any) {
        super(props, false);
    }
    productsLoaded = (response: WebResponse) => {
        if (response.entities == undefined) {
            throw new Error("Data not found");
        }
        this.setState({ products: response.entities });
    }
    loadProducts(page: number | undefined = 0) {
        const filter = this.state.filter;
        if (page != undefined) {
            filter.page = page;
        }
        filter.fieldsFilter = this.state.fieldsFilter;
        this.commonAjaxWithProgress(
            this.catalogService.getProductList,
            this.productsLoaded,
            this.showCommonErrorAlert,
            filter,
        )
        this.setState({ filter: filter });
    }
    componentDidMount() {
        document.title = "Product Catalog";
        this.loadProducts();
    }
    filter = (e) => {
        e.preventDefault();
    }
    setFieldsFilterValue = (e) => {
        const input:HTMLInputElement = e.target;
        let name:string = input.name;
        let value:any;
        if (input.type == 'checkbox') {
            value = input.checked == true;
        } else {
            value = input.value;
        }
        const fieldsFilter = this.state.fieldsFilter;
        fieldsFilter[name] = value;
        this.setState({fieldsFilter:fieldsFilter});
    }

    render() {
        return (
            <div id="ProductCatalog" className="container-fluid">
                <h2>Product Catalog</h2>
                <form onSubmit={this.filter} >
                    <Modal title="Filter">
                        <div className="row">
                            <FormGroup orientation="vertical" className="col-md-6" label="Name">
                                <input onChange={this.setFieldsFilterValue} defaultValue={this.state.fieldsFilter['name']} name="name" placeholder="Product Name" className="form-control"/>
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-6" label="Category">
                                <select onChange={this.setFieldsFilterValue} defaultValue={this.state.fieldsFilter['category,id[EXACTS]']}  className="form-control" name="category,id[EXACTS]">
                                    
                                </select>
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-6" label="With Stock">
                                <input onChange={this.setFieldsFilterValue} defaultChecked={this.state.fieldsFilter['withStock']==true} type="checkbox" name="withStock" />
                                <label style={{paddingLeft:'5px'}}>{this.state.fieldsFilter['withStock']==true?"Yes":"No"}</label>
                            </FormGroup>
                        </div>
                    </Modal>
                </form>
            </div>
        )
    }

}
export default withRouter(connect(
    mapCommonUserStateToProps
)(ProductCatalog))