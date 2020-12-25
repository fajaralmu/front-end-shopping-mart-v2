import React from 'react'
import BaseComponent from './../../../BaseComponent';
import TransactionHistoryService from './../../../../services/TransactionHistoryService';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from './../../../container/Modal';
import Filter from './../../../../models/Filter';
import FormGroup from '../../../form/FormGroup';
import WebResponse from './../../../../models/WebResponse';
import DashboardFilter from './DashboardFilter';
import CashflowChart from './CashflowChart';
import SimpleError from '../../../alert/SimpleError';
const date = new Date();
class IState {
    filter: Filter = {
        month: date.getMonth() + 1,
        year: 2017,//date.getFullYear(),
        monthTo: date.getMonth() + 1,
        yearTo: date.getFullYear()
    };
    cashflowData?: WebResponse = undefined
}
class DashboardStatistic extends BaseComponent {
    transactionHistoryService: TransactionHistoryService = TransactionHistoryService.getInstance();
    state: IState = new IState();
    constructor(props) {
        super(props, true);
    }

    filter = (e) => {
        e.preventDefault();
        this.loadStatistic();
    }
    cashflowDataLoaded = (response: WebResponse) => {
        this.setState({ cashflowData: response });
    }
    cashflowDataNotLoaded = (e: any) => {
        console.error(e);
    }
    loadStatistic = () => {
        this.commonAjaxWithProgress(
            this.transactionHistoryService.getCashflowDetail,
            this.cashflowDataLoaded,
            this.cashflowDataNotLoaded,
            this.state.filter
        )
    }

    updatePeriodFilter = (e) => {
        const name = e.target.name;
        const filter = this.state.filter;
        filter[name] = parseInt(e.target.value);
        this.setState({ filter: filter });
    }

    componentDidMount() {
        this.validateLoginStatus();
        this.loadStatistic();
    }

    render() {

        return (
            <div className="container-fluid">
                <h2>Statistics</h2>
                <DashboardFilter onChange={this.updatePeriodFilter} onSubmit={this.filter} filter={this.state.filter} />
                {this.state.cashflowData ?
                    <CashflowChart cashflowData={this.state.cashflowData} />
                    : <SimpleError>No cashflow data</SimpleError>
                }
            </div>
        )
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps,
    // mapDispatchToProps
)(DashboardStatistic))