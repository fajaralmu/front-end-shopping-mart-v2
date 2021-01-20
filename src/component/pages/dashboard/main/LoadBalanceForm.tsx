import React from 'react'
import BaseComponent from '../../../BaseComponent';
import Card from '../../../container/Card';
import TransactionHistoryService from '../../../../services/TransactionHistoryService';
import WebResponse from '../../../../models/WebResponse';
import WebRequest from '../../../../models/WebRequest';
import FormGroup from '../../../form/FormGroup';
import { getMonthDays, MONTHS } from '../../../../utils/DateUtil';
import CashBalance from '../../../../models/CashBalance';
import Spinner from '../../../loader/Spinner';
import SimpleError from '../../../alert/SimpleError';
import { beautifyNominal } from '../../../../utils/StringUtil';
class IState {
    month: number = new Date().getMonth() + 1;
    year: number = new Date().getFullYear();
    loading: boolean = false;
    balanceInfo?: CashBalance;
}
export default class LoadBalanceForm extends BaseComponent {
    transactionHistoryService: TransactionHistoryService = TransactionHistoryService.getInstance();

    state: IState = new IState();
    constructor(props) {
        super(props, true);
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    balanceLoaded = (response: WebResponse) => {
        this.setState({ balanceInfo: response.entity });
    }
    getBalanceRequest = (): WebRequest => {
        return {
            filter: {
                month: this.state.month,
                year: this.state.year,
                day: getMonthDays( this.state.month-1)
            }
        };
    }
    updateFilterProp = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }
    loadData = (e: any): void => {
        e.preventDefault();
        this.commonAjax(
            this.transactionHistoryService.getBalanceInfo,
            this.balanceLoaded,
            this.showCommonErrorAlert,
            this.getBalanceRequest()
        )
    }
    render() {

        return <Card title="Balance">
            <div className="row">
                <form className="col-md-6" onSubmit={this.loadData}>
                    <FormGroup label="Month">
                        <select name="month" onChange={this.updateFilterProp} className="form-control" value={this.state.month}>
                            {MONTHS.map((name, i) => {
                                return <option key={"month-balance-" + i} value={i + 1}>{name}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup label="Year">
                        <input name="year" onChange={this.updateFilterProp} className="form-control" value={this.state.year} type="number" />
                    </FormGroup>
                    <FormGroup>
                        <input type="submit" className="btn btn-primary" />
                    </FormGroup>
                </form>
                <BalanceInfo balanceInfo={this.state.balanceInfo} loading={this.state.loading} />
            </div>
        </Card>
    }
}

const BalanceInfo = (props: { balanceInfo?: CashBalance, loading: boolean }) => {
    if (props.loading) return <div className="col-md-6"><Spinner /></div>
    if (!props.balanceInfo) return <div className="col-md-6"><SimpleError>Data Not Found</SimpleError></div>
    return <div className="col-md-6">
        <FormGroup label="Total Spent">{beautifyNominal(props.balanceInfo.creditAmt)}</FormGroup>
        <FormGroup label="Total Earned">{beautifyNominal(props.balanceInfo.debitAmt)}</FormGroup>
        <FormGroup label="Balance">{beautifyNominal(props.balanceInfo.actualBalance)}</FormGroup>
    </div>
}