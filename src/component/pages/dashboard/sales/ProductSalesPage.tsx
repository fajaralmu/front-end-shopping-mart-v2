import React from 'react';
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import TransactionHistoryService from '../../../../services/TransactionHistoryService';
import Filter from './../../../../models/Filter';
import WebResponse from './../../../../models/WebResponse';
import DashboardFilter from './../DashboardFilter';
const date = new Date();
class IState {
    filter: Filter = {
        month: date.getMonth() + 1,
        year: 2017,//date.getFullYear(),
        monthTo: date.getMonth() + 1,
        yearTo: date.getFullYear(),
        page:0,
        limit:20
    };
    salesData?: WebResponse = undefined
}
class ProductSalesPage extends BaseComponent
{
    transactionHistoryService:TransactionHistoryService = TransactionHistoryService.getInstance();
    state = new IState();
    constructor(props) {
        super(props, true);
    }
    updatePeriodFilter = (e) => {
        const name = e.target.name;
        const filter = this.state.filter;
        filter[name] = parseInt(e.target.value);
        this.setState({ filter: filter });
    }
    filter = (e) => {
        e.preventDefault();
        this.loadSales();
    }
    salesDataLoaded = (response: WebResponse) => {
        this.setState({ salesData: response });
    }
    salesDataNotLoaded = (e: any) => {
        console.error(e);
    }
    loadSales = () => {
        this.commonAjaxWithProgress(
            this.transactionHistoryService.getProductSales,
            this.salesDataLoaded,
            this.salesDataNotLoaded,
            this.state.filter
        )
    }
    componentDidMount() {
        this.validateLoginStatus();
        this.loadSales();
    }
    render() {
        const salesData = this.state.salesData;
        return (
            <div className="container-fluid">
            <h2>Product Sales</h2>
            <DashboardFilter onChange={this.updatePeriodFilter} transactionYears={salesData && salesData.transactionYears? salesData.transactionYears:[]} 
                onSubmit={this.filter} filter={this.state.filter} />
               
            </div>
        )
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps,
    // mapDispatchToProps
)(ProductSalesPage))