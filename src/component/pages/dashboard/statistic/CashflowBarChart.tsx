
import React, { Component } from 'react';
import Cashflow from '../../../../models/Cashflow';
import { beautifyNominal, uniqueId } from './../../../../utils/StringUtil';
import { MONTHS } from './../../../../utils/DateUtil';
import '../ChartSvg.css';
import FormGroup from './../../../form/FormGroup';
import Card from './../../../container/Card';
interface IProps {
    dataSet: Cashflow[],
    updated: Date
}
class IState {
    hoveredIndex: number = -1;
    updated: Date = new Date();
}
export default class CashflowBarChart extends Component<IProps, IState>
{
    middleYAxisValue: number = 0;
    bottomYAxisValue: number = 0;
    offsetX: number = 100;
    offsetY: number = 50;
    baseYIndex: number = 200;
    baseHeight: number = 150;
    lineWidth: number = 0;
    maxValue: number = 0;
    state: IState = new IState();
    constructor(props: IProps) {
        super(props);
        this.updateSizes();

    }
    updateSizes = () => {
        this.maxValue = Cashflow.maxAmount(this.props.dataSet);
        this.middleYAxisValue = Math.round(this.maxValue * 2 / 3);
        this.bottomYAxisValue = Math.round(this.maxValue * 1 / 3);
        this.lineWidth = (23) * (this.props.dataSet.length);
    }
    componentDidUpdate() {
        this.updateSizes();
        if (this.props.updated != this.state.updated) {
            this.setState({ updated: this.props.updated });
        }
    }
    hover = (index: number) => {
        this.setState({ hoveredIndex: index });
    }
    unHover = () => {
        this.setState({ hoveredIndex: -1 });
    }
    getActiveCashflow = () => {
        if (this.state.hoveredIndex < 0) return undefined;
        const dataset: Cashflow[] = this.props.dataSet;
        for (let i = 0; i < dataset.length; i++) {
            if (i == this.state.hoveredIndex) return dataset[i];
        }
        return undefined;
    }
    render() {
        const props = this.props;
        return (
            <div>
                <div style={{ minHeight: '350px', overflowX: 'scroll' }}>
                    <svg onMouseOut={this.unHover} className="bg-light border" version="1.1" baseProfile="full" width={this.offsetX * 2 + (23) * (props.dataSet.length)} height={300} xmlns="http://www.w3.org/2000/svg">

                        {props.dataSet.map((data, i) => {
                            const percentage = (data.amount / this.maxValue) * this.baseHeight;
                            const labelY = this.baseYIndex + 15, labelX = this.offsetX + 10 + (23) * (i);
                            const xTranslated = 0, yTranslated = 0;
                            const transform = "translate(" + xTranslated + "," + yTranslated + ") rotate(-30," + labelX + "," + labelY + ")";
                            const hovered = i == this.state.hoveredIndex;
                            return (
                                <g style={hovered ? { cursor: 'pointer' } : {}} className="chart-group" onMouseOver={(e) => this.hover(i)} onMouseOut={this.unHover} key={uniqueId() + "-" + i}>
                                    <rect fill={hovered ? "red" : "green"} x={this.offsetX + (23) * (i)} y={this.baseYIndex - percentage} height={percentage} width={20} ></rect>
                                    <text fill={hovered ? "red" : "black"} textAnchor="end" fontSize={10} x={labelX} y={labelY} transform={transform}>{data.month}-{data.year}</text>
                                    <circle cx={this.offsetX + (23) * (i + 1)} cy={this.baseYIndex} r="3" fill="red" />
                                </g>
                            )
                        })}
                        <rect name="base_axis_x" x={this.offsetX} y={this.baseYIndex} height={2} width={this.lineWidth} />
                        <rect name="helper_line_top" fill="rgb(100,100,100)" x={this.offsetX} y={this.offsetY} height={1} width={this.lineWidth} />
                        <rect name="helper_line_middle" fill="rgb(100,100,100)" x={this.offsetX} y={this.offsetY + this.baseHeight * 1 / 3} height={1} width={this.lineWidth} />
                        <rect name="helper_line_bottom" fill="rgb(100,100,100)" x={this.offsetX} y={this.offsetY + this.baseHeight * 2 / 3} height={1} width={this.lineWidth} />
                        <rect name="base_axis_y" x={this.offsetX} y={this.offsetY} height={this.baseHeight} width={2} />

                        <text textAnchor="end" name="top_val" fontSize={10} x={this.offsetX} y={this.offsetY}>{beautifyNominal(this.maxValue)}</text>
                        <text textAnchor="end" name="middle_val" fontSize={10} x={this.offsetX} y={this.offsetY + this.baseHeight * 1 / 3}>{beautifyNominal(this.middleYAxisValue)}</text>
                        <text textAnchor="end" name="bottom_val" fontSize={10} x={this.offsetX} y={this.offsetY + this.baseHeight * 2 / 3}>{beautifyNominal(this.bottomYAxisValue)}</text>
                    </svg>
                </div>
                <p><i className="fas fa-history" /> {new Date(this.state.updated).toString()}</p>
                <CashflowDetail cashflow={this.getActiveCashflow()} />
            </div>
        )
    }
}

const CashflowDetail = (props: { cashflow?: Cashflow }) => {
    const cashflow: Cashflow | undefined = props.cashflow;
    if (!cashflow) return <div className="container-fluid" style={{minHeight:'120px'}}>
        <div className="alert alert-info">Hover over chart to see detail</div>
    </div>;

    return (<div className="row" style={{minHeight:'120px'}}>
        <div className="col-md-6"><FormGroup label="Module"> {cashflow.module}</FormGroup></div>
        <div className="col-md-6"><FormGroup label="Period">{MONTHS[cashflow.month - 1]} {cashflow.year}</FormGroup></div>
        <div className="col-md-6"> <FormGroup label="Count">{beautifyNominal(cashflow.count)}</FormGroup></div>
        <div className="col-md-6"> <FormGroup label="Amount">{beautifyNominal(cashflow.amount)}</FormGroup> </div>
    </div >)
}