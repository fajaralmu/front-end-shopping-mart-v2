import React from 'react'
import BaseComponent from '../../../BaseComponent';
import Card from '../../../container/Card';
import TransactionHistoryService from '../../../../services/TransactionHistoryService';
import WebResponse from '../../../../models/WebResponse';
import WebRequest from '../../../../models/WebRequest';
import FormGroup from '../../../form/FormGroup';
import { MONTHS } from '../../../../utils/DateUtil';
import CashBalance from '../../../../models/CashBalance';
import Spinner from '../../../loader/Spinner';
import SimpleError from '../../../alert/SimpleError';
import { beautifyNominal } from '../../../../utils/StringUtil';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
class IState {
    quantity?:number;
    loading: boolean = false; 
}
 class LoadInventoryForm extends BaseComponent {
    transactionHistoryService: TransactionHistoryService ;

    state: IState = new IState();
    constructor(props) {
        super(props, true);
        this.transactionHistoryService = this.getServices().transactionHistoryService;
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    dataLoaded = (response: WebResponse) => {
        this.setState({ quantity: response.quantity });
    }
  
    loadData = (e: any): void => {
        e.preventDefault();
        this.commonAjax(
            this.transactionHistoryService.getInventoriesQuantity,
            this.dataLoaded,
            this.showCommonErrorAlert,
            {}
        )
    }
    render() {
        return <Card title="Inventory Quantity">
            <div className="row">
                <form className="col-md-6" onSubmit={this.loadData}>
                    <FormGroup>
                        <input type="submit" value="Reload" className="btn btn-primary" />
                    </FormGroup>
                </form>
                <Detail quantity={this.state.quantity} loading={this.state.loading} />
            </div>
        </Card>
    }
}

const Detail = (props: { quantity?:number, loading: boolean }) => {
    if (props.loading) return <div className="col-md-6"><Spinner /></div>
    if (!props.quantity) return <div className="col-md-6"><SimpleError>Data Not Found</SimpleError></div>
    return <div className="col-md-6">
         <h3>{beautifyNominal(props.quantity)}</h3>
    </div>
}

export default connect(
    mapCommonUserStateToProps, 
)(LoadInventoryForm)