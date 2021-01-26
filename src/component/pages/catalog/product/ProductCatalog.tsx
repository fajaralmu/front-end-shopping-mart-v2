

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
import Category from './../../../../models/Category';
import NavigationButtons from '../../../navigation/NavigationButtons';
import SimpleError from './../../../alert/SimpleError';
import ProductCatalogList from './ProductCatalogList';
class IState {
    products: Product[] = []; 
    filter: Filter = {
        limit: 20,
        page: 0,
        useExistingFilterPage: false,
        orderBy: 'name',
        orderType: 'asc'
    };
    fieldsFilter: {} = {
        withStock: true,
        withCategories: true,
    };
    categories: Category[] = [];
    totalData: number = 0;
    dataNotFound: boolean = false;
}
class ProductCatalog extends BaseComponent {
    catalogService: CatalogService ;
    state: IState = new IState();
    constructor(props: any) {
        super(props, false);
        this.catalogService = this.getServices().catalogService;
    }
    productNotLoaded = (e: any) => {
        this.setState({ totalData: 0, products: [], dataNotFound: true });
    }
    productsLoaded = (response: WebResponse) => {
        if (response.entities == undefined) {
            this.productNotLoaded(response);
            return;
        }
        if (this.state.fieldsFilter['withCategories'] == true) {
            this.setState({ totalData: response.totalData, dataNotFound: false, products: response.entities, categories: response.generalList });
        } else {
            this.setState({ totalData: response.totalData, dataNotFound: false, products: response.entities });
        }
    }
    loadProducts(page: number | undefined = 0) {
        const filter = this.state.filter;
        if (page != undefined && this.state.filter.useExistingFilterPage == false) {
            filter.page = page;
        }
        filter.fieldsFilter = this.state.fieldsFilter;
        const withProgess = filter.fieldsFilter['withStock'] == true;

        this.doAjax(
            this.catalogService.getProductList, withProgess,
            this.productsLoaded, this.productNotLoaded,
            filter,
        )
        filter.useExistingFilterPage = false;
        this.setState({ filter: filter });
    }
    componentDidMount() {
        document.title = "Product Catalog";
        this.loadProducts(0);
    }
    filter = (e) => {
        e.preventDefault();
        this.loadProducts(0);
    }
    setFieldsFilterValue = (e) => {
        const input: HTMLInputElement = e.target;
        let name: string = input.name;
        let value: any;

        if (input.type == 'checkbox') {
            value = input.checked == true;
        } else {
            value = input.value;
        }
        const fieldsFilter = this.state.fieldsFilter;
        if (value == undefined || new String(value).trim() == "") {
            if (fieldsFilter[name])
                delete fieldsFilter[name];
        } else {
            fieldsFilter[name] = value;
        }
        this.setState({ fieldsFilter: fieldsFilter });
    }
    setFilterPage = (value: any) => {
        const page = parseInt(value);
        const filter = this.state.filter;
        filter.page = page;
        filter.useExistingFilterPage = true;
        this.setState({ filter: filter });
    }
    setLimit = (limit: number) => {
        const filter = this.state.filter;
        filter.limit = limit;
        this.setState({ filter: filter });
    }
    setOrder = (e) => {
        const value = e.target.value;
        const filter = this.state.filter;
        if (value != '') {
            const rawOrder: string[] = new String(value).split("-");
            filter.orderBy = rawOrder[0];
            filter.orderType = rawOrder[1];
        } else {
            delete filter.orderBy;
            delete filter.orderType;
        }
        this.setState({ filter: filter });
    }

    render() {
        const products: Product[] = this.state.products;
        return (
            <div id="ProductCatalog" className="container-fluid">
                <h2>Product Catalog</h2>
                <form onSubmit={this.filter} >
                    
                    <Modal toggleable={true} title="Filter" footerContent={
                        <input type="submit" className="btn btn-primary" />
                    }  >
                        <div className="row">
                            <FormGroup orientation="vertical" className="col-md-6" label="Name">
                                <input onChange={this.setFieldsFilterValue} defaultValue={this.state.fieldsFilter['name']} name="name" placeholder="Product Name" className="form-control" />
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Order By">
                                <select onChange={this.setOrder} className="form-control">
                                    <option value="name-asc">Name [A-Z]</option>
                                    <option value="name-desc">Name [Z-A]</option>
                                    <option value="price-asc">Price [Cheap]</option>
                                    <option value="price-desc">Price [Expensive]</option>
                                </select>
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Category">
                                <select onChange={this.setFieldsFilterValue} defaultValue={this.state.fieldsFilter['category,id[EXACTS]']} className="form-control" name="category,id[EXACTS]">
                                    <option value="">All</option>
                                    {this.state.categories.map(category => {
                                        return <option key={"category-opt-"+category.id} value={category.id}>{category.name}</option>
                                    })}
                                </select>
                            </FormGroup>

                            <FormGroup orientation="vertical" className="col-md-3" label="With Stock">
                                <input onChange={this.setFieldsFilterValue} defaultChecked={this.state.fieldsFilter['withStock'] == true} type="checkbox" name="withStock" />
                                <label style={{ paddingLeft: '5px' }}>{this.state.fieldsFilter['withStock'] == true ? "Yes" : "No"}</label>
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Go To Page">
                                <input name="page" min="1" type="number" onChange={
                                    (e) => this.setFilterPage(parseInt(e.target.value) - 1)
                                } defaultValue={(this.state.filter.page ?? 0) + 1} className="form-control" />
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Displayed Item">
                                <input name="limit" min="1" type="number" onChange={
                                    (e) => this.setLimit(parseInt(e.target.value))
                                } defaultValue={this.state.filter.limit} className="form-control" />
                            </FormGroup>
                            <FormGroup orientation="vertical" className="col-md-3" label="Total Data">
                                <label>{this.state.totalData}</label>
                            </FormGroup>
                        </div>
                    </Modal>
                </form>
                <SimpleError show={this.state.dataNotFound}>Data not found</SimpleError>
                <NavigationButtons limit={this.state.filter.limit ?? 20} activePage={this.state.filter.page ?? 0}
                    totalData={this.state.totalData} onClick={(page: number) => this.loadProducts(page)} />
                <ProductCatalogList app={this.parentApp} products={products} withStock={this.state.fieldsFilter['withStock']} />
            </div>
        )
    }
} 
export default withRouter(connect(
    mapCommonUserStateToProps
)(ProductCatalog))