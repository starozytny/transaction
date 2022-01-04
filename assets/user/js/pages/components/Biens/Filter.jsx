import React, { Component } from 'react';

import Helper from "@commonComponents/functions/helper";
import helper   from "./helper";

function updateTab(initTable, value, newTable) {
    let find = false;
    initTable.forEach(el => {
        if(el === value){
            find = true;
        }
    })

    if(find){
        newTable = initTable.filter(el => { return el !== value });
    }else{
        newTable.push(value);
    }

    return newTable;
}

export class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filtersAd: [],
            filtersBien: [],
            // filtersAd: [0, 1],
            // filtersBien: [0, 1, 2, 3],
            filtersMandat: [],

        }

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (type, value) => {
        const { filtersAd, filtersBien, filtersMandat } = this.state;

        let nFiltersAd = filtersAd;
        let nFiltersBien = filtersBien;
        let nFiltersMandat = filtersMandat;

        switch (type){
            case "mandat":
                nFiltersMandat = updateTab(filtersMandat, value, nFiltersMandat);
                break;
            case "bien":
                nFiltersBien = updateTab(filtersBien, value, nFiltersBien);
                break;
            default:
                nFiltersAd = updateTab(filtersAd, value, nFiltersAd);
                break;
        }

        this.setState({ filtersAd: nFiltersAd, filtersBien: nFiltersBien, filtersMandat: nFiltersMandat });
        this.props.onGetFilters([nFiltersAd, nFiltersBien, nFiltersMandat])
    }

    render () {
        const { filtersAd, filtersBien, filtersMandat } = this.state;

        let itemsFiltersAd = helper.getItems("ads");
        let itemsFiltersBien = helper.getItems("biens");
        let itemsFiltersMandat = helper.getItems("mandats");

        return <div className="filters">
            <ItemFilter type="ad"     title="Annonce"      itemsFilters={itemsFiltersAd}     filters={filtersAd} onFilter={this.handleFilter}/>
            <ItemFilter type="bien"   title="Type de bien" itemsFilters={itemsFiltersBien}   filters={filtersBien} onFilter={this.handleFilter}/>
            <ItemFilter type="mandat" title="Mandat"       itemsFilters={itemsFiltersMandat} filters={filtersMandat} onFilter={this.handleFilter}/>
        </div>
    }
}

class Title extends Component {
    constructor(props) {
        super();

        this.state = {
            status: "minus"
        }

        this.handleDisplay = this.handleDisplay.bind(this);
    }

    handleDisplay = (status) => {
        this.setState({ status: status === "minus" ? "add" : "minus" })
    }

    render () {
        const { title } = this.props;
        const { status } = this.state;

        return <div className={"title " + status} onClick={() => this.handleDisplay(status)}>
            <span>{title}</span>
            <span className={"icon-" + status} />
        </div>
    }
}

function ItemFilter ({ type, title, itemsFilters, filters, onFilter }) {
    return  <div className="item">
        <Title title={title}/>
        <div className="items-filter">
            {itemsFilters.map(el => {
                return <ItemFilterBox type={type} el={el} filters={filters} onFilter={onFilter} key={el.value}/>
            })}
        </div>
    </div>
}

function ItemFilterBox ({ type, el, filters, onFilter }) {
    return <div className={"item-filter" + Helper.setActive(filters, el.value)}
                onClick={() => onFilter(type, el.value)}>
        <div className="box" />
        <div>{el.label}</div>
    </div>
}