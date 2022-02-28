import React, { Component } from 'react';

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import Helper from "@commonComponents/functions/helper";
import helper from "@userPages/components/Biens/functions/helper";

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
            filtersAd:      props.filters[0],
            filtersBien:    props.filters[1],
            filtersMandat:  props.filters[2],
            filterOwner:    props.filters[3],
            filterNego:     props.filters[4],
            filterUser:     props.filters[5],
            filterAgency:   props.filters[6],
        }

        this.handleFilter = this.handleFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleFilter = (type, value) => {
        const { filtersAd, filtersBien, filtersMandat, filterOwner, filterNego, filterUser, filterAgency } = this.state;

        let nFiltersAd = filtersAd;
        let nFiltersBien = filtersBien;
        let nFiltersMandat = filtersMandat;
        let nFilterOwner = filterOwner;
        let nFilterNego = filterNego;
        let nFilterUser = filterUser;
        let nFilterAgency = filterAgency;

        switch (type){
            case "agency":
                nFilterAgency = updateTab(filterAgency, value, nFilterAgency);
                break;
            case "filterUser":
                nFilterUser = value;
                break;
            case "filterNego":
                nFilterNego = value;
                break;
            case "filterOwner":
                nFilterOwner = value;
                break;
            case "codeTypeMandat":
                nFiltersMandat = updateTab(filtersMandat, value, nFiltersMandat);
                break;
            case "codeTypeBien":
                nFiltersBien = updateTab(filtersBien, value, nFiltersBien);
                break;
            default:
                nFiltersAd = updateTab(filtersAd, value, nFiltersAd);
                break;
        }

        this.setState({ filtersAd: nFiltersAd, filtersBien: nFiltersBien, filtersMandat: nFiltersMandat,
            filterOwner: nFilterOwner, filterNego: nFilterNego, filterUser: nFilterUser, filterAgency: nFilterAgency });
        this.props.onGetFilters([nFiltersAd, nFiltersBien, nFiltersMandat, nFilterOwner, nFilterNego, nFilterUser, nFilterAgency])
    }

    handleChange = (e) => { this.handleFilter(e.currentTarget.name, e.currentTarget.value); }

    handleChangeSelect = (name, e) => {
        this.handleFilter(name, e !== undefined ? e.value : "");
    }

    render () {
        const { data, owners, negotiators, users, agencies } = this.props;
        const { filtersAd, filtersBien, filtersMandat, filterOwner, filterNego, filterUser, filterAgency } = this.state;

        let itemsFiltersAd = helper.getItems("ads");
        let itemsFiltersBien = helper.getItems("biens");
        let itemsFiltersMandat = helper.getItems("mandats");

        let itemsFiltersAgency = [];
        agencies.forEach(agency => {
            itemsFiltersAgency.push({ value: agency.value, label: agency.label, identifiant: 'age-' + agency.value },)
        })

        return <div className="filters">
            <ItemFilter type="agency"         title="Agence"       itemsFilters={itemsFiltersAgency} filters={filterAgency} onFilter={this.handleFilter} data={data}/>
            <ItemFilter type="codeTypeAd"     title="Annonce"      itemsFilters={itemsFiltersAd}     filters={filtersAd} onFilter={this.handleFilter} data={data}/>
            <ItemFilter type="codeTypeBien"   title="Type de bien" itemsFilters={itemsFiltersBien}   filters={filtersBien} onFilter={this.handleFilter} data={data}/>
            <ItemFilter type="codeTypeMandat" title="Mandat"       itemsFilters={itemsFiltersMandat} filters={filtersMandat} onFilter={this.handleFilter} />

            <ItemFilterSelectize title="Négociateur"    items={negotiators}  identifiant="filterNego" valeur={filterNego} onChangeSelect={this.handleChangeSelect} />
            <ItemFilterSelectize title="Propriétaire"   items={owners}       identifiant="filterOwner" valeur={filterOwner} onChangeSelect={this.handleChangeSelect} />
            <ItemFilterSelectize title="Utilisateur"    items={users}        identifiant="filterUser" valeur={filterUser} onChangeSelect={this.handleChangeSelect} />
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

function ItemFilter ({ type, title, itemsFilters, filters, onFilter, data }) {
    return  <div className="item">
        <Title title={title}/>
        <div className="items-filter">
            {itemsFilters.map(el => {

                let total;
                if(data){
                    total = 0;
                    data.forEach(elem => {
                        let correspondance = type !== "agency" ? elem[type] : elem.agency.id;

                        if(el.value === correspondance){ total++; }
                    })
                }

                return <ItemFilterBox type={type} el={el} filters={filters} onFilter={onFilter} total={total} key={el.value}/>
            })}
        </div>
    </div>
}

function ItemFilterBox ({ type, el, filters, onFilter, total }) {
    return <div className={"item-filter" + Helper.setActive(filters, el.value)}
                onClick={() => onFilter(type, el.value)}>
        <div className="item-filter-name">
            <div className="box" />
            <div>{el.label}</div>
        </div>
        <div className="item-filter-total">{total > 0 ? total : 0}</div>
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
