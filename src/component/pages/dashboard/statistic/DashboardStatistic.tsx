import React from 'react'
import BaseComponent from './../../../BaseComponent';
import TransactionHistoryService from './../../../../services/TransactionHistoryService';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Filter from './../../../../models/Filter';
import WebResponse from './../../../../models/WebResponse';
import DashboardFilter from '../DashboardFilter';
import CashflowChart from './CashflowChart'; 
import Spinner from '../../../loader/Spinner';
const date = new Date();
class IState {
    filter: Filter = {
        month: date.getMonth() + 1,
        year:  date.getFullYear(),
        monthTo: date.getMonth() + 1,
        yearTo: date.getFullYear()
    };
    cashflowData?: WebResponse = undefined
}
class DashboardStatistic extends BaseComponent {
    transactionHistoryService: TransactionHistoryService;
    state: IState = new IState();
    constructor(props) {
        super(props, true);
        this.transactionHistoryService = this.getServices().transactionHistoryService;
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
        const cashflowData = this.state.cashflowData;
        if (!cashflowData) {
            return <div className="container-fluid" >
                <h2>Statistics</h2>
                <Spinner />
            </div>
        }
        return (
            <div className="container-fluid">
                <h2>Statistics</h2>
                <DashboardFilter onChange={this.updatePeriodFilter} transactionYears={cashflowData && cashflowData.transactionYears ? cashflowData.transactionYears : []}
                    onSubmit={this.filter} filter={this.state.filter} />
                <CashflowChart cashflowData={cashflowData} />

            </div>
        )
    }
}
export default withRouter(connect(
    mapCommonUserStateToProps,
    // mapDispatchToProps
)(DashboardStatistic))