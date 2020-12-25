
import React, { Component } from 'react';
import Filter from './../../../../models/Filter';
import Modal from './../../../container/Modal';
import FormGroup from './../../../form/FormGroup';
interface IProps {
    filter: Filter,
    onChange: Function,
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
export default class DashboardFilter extends Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
    }
    updatePeriodFilter = (e) => {
        this.props.onChange(e);
    }
    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <Modal toggleable={true} title="Filter" footerContent={
                    <input type="submit" className="btn btn-primary" />
                }>
                    <div className="row  ">
                        <div className="col-md-5">
                            <FormGroup label="Month">
                                <input type="number" className="form-control" name="month" onChange={this.updatePeriodFilter} value={this.props.filter.month} min="1" max="12" />
                            </FormGroup>
                            <FormGroup label="Year">
                                <input type="number" className="form-control" name="year" onChange={this.updatePeriodFilter} value={this.props.filter.year} />
                            </FormGroup>
                        </div>
                        <div className="col-md-2 text-center">
                            <div style={{width:'75px', height:'75px', display:'flex'}} className="bg-secondary text-light rounded-circle">
                                <h1 style={{ margin:'auto' }}><i className="fas fa-angle-right"></i></h1>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <FormGroup label="Month">
                                <input type="number" className="form-control" name="monthTo" onChange={this.updatePeriodFilter} value={this.props.filter.monthTo} min="1" max="12" />
                            </FormGroup>
                            <FormGroup label="Year">
                                <input type="number" className="form-control" name="yearTo" onChange={this.updatePeriodFilter} value={this.props.filter.yearTo} />
                            </FormGroup>
                        </div>
                    </div>
                </Modal>
            </form>
        )
    }
}