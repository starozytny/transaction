import React, { Component } from 'react';

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import Helper from "@commonComponents/functions/helper";
import helper from "./helper";

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
            filtersAd: props.filters[0],
            filtersBien: props.filters[1],
            filtersMandat: props.filters[2],
            filterOwner: props.filters[3],
            filterTenant: props.filters[4],
        }

        this.handleFilter = this.handleFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleFilter = (type, value) => {
        const { filtersAd, filtersBien, filtersMandat, filterOwner, filterTenant } = this.state;

        let nFiltersAd = filtersAd;
        let nFiltersBien = filtersBien;
        let nFiltersMandat = filtersMandat;
        let nFilterOwner = filterOwner;
        let nFilterTenant = filterTenant;

        switch (type){
            case "filterTenant":
                nFilterTenant = value;
                break;
            case "filterOwner":
                nFilterOwner = value;
                break;
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

        this.setState({ filtersAd: nFiltersAd, filtersBien: nFiltersBien, filtersMandat: nFiltersMandat,
            filterOwner: nFilterOwner, filterTenant: nFilterTenant });
        this.props.onGetFilters([nFiltersAd, nFiltersBien, nFiltersMandat, nFilterOwner, nFilterTenant])
    }

    handleChange = (e) => { this.handleFilter(e.currentTarget.name, e.currentTarget.value); }

    handleChangeSelect = (name, e) => {
        this.handleFilter(name, e !== undefined ? e.value : "");
    }

    render () {
        const { owners, tenants } = this.props;
        const { filtersAd, filtersBien, filtersMandat, filterOwner, filterTenant } = this.state;

        let itemsFiltersAd = helper.getItems("ads");
        let itemsFiltersBien = helper.getItems("biens");
        let itemsFiltersMandat = helper.getItems("mandats");

        let itemsTenants = [];
        tenants.forEach(elem => {
            itemsTenants.push({ value: elem.bien.id, label: elem.fullname, identifiant: "tenant-" + elem.id })
        })

        return <div className="filters">
            <ItemFilter type="ad"     title="Annonce"      itemsFilters={itemsFiltersAd}     filters={filtersAd} onFilter={this.handleFilter}/>
            <ItemFilter type="bien"   title="Type de bien" itemsFilters={itemsFiltersBien}   filters={filtersBien} onFilter={this.handleFilter}/>
            <ItemFilter type="mandat" title="Mandat"       itemsFilters={itemsFiltersMandat} filters={filtersMandat} onFilter={this.handleFilter}/>
            <ItemFilterSelectize title="Propriétaire" items={owners} identifiant="filterOwner" valeur={filterOwner} onChangeSelect={this.handleChangeSelect} />
            <ItemFilterSelectize title="Locataire" items={itemsTenants} identifiant="filterTenant" valeur={filterTenant} onChangeSelect={this.handleChangeSelect} />
        </div>
    }
}

function ItemFilterSelectize ({ title, items, identifiant, valeur, onChangeSelect, placeholder }) {
    return  <div className="item">
        <Title title={title}/>
        <div className="items-filter">
            <SelectReactSelectize items={items} identifiant={identifiant} valeur={valeur} errors={[]}
                                  onChange={(e) => onChangeSelect(identifiant, e)} placeholder={placeholder} />
        </div>
    </div>
}

function ItemFilterInput ({ title, identifiant, valeur, onChange, placeholder }) {
    return  <div className="item">
        <Title title={title}/>
        <div className="items-filter">
            <Input identifiant={identifiant} valeur={valeur} errors={[]} onChange={onChange} placeholder={placeholder} />
        </div>
    </div>
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