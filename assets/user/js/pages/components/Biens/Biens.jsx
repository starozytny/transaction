import React, { Component } from "react";

import Sort          from "@commonComponents/functions/sort";

import { Layout }    from "@dashboardComponents/Layout/Page";

import { BiensList } from "./BiensList";

const URL_DELETE_ELEMENT    = 'api_biens_delete';
const URL_DELETE_GROUP      = 'api_contact_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer ce bien ?';
const MSG_DELETE_GROUP      = 'Aucun message sélectionné.';
const SORTER = Sort.compareCreatedAt;

function setNewTab(initTab, el, comparateur, newTable) {
    if(initTab.length !== 0){
        initTab.forEach(filter => {
            if(filter === comparateur){
                newTable.push(el);
            }
        })
    }else{
        newTable.push(el)
    }

    return newTable;
}

function filterFunction(dataImmuable, filters){
    let newData = [];
    let newData1 = [];

    let filtersAd = filters[0];
    let filtersBien = filters[1];

    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            newData = setNewTab(filtersAd, el, el.codeTypeAd, newData);
        })

        newData.forEach(el => {
            newData1 = setNewTab(filtersBien, el, el.codeTypeBien, newData1);
        })

        newData = newData1
    }

    return newData;
}

export class Biens extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "biens.pagination",
            filters: [
                [0, 1], // type ad
                [0, 1, 2, 3], // type bien
            ]
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => {
        self.handleSetDataPagination(this.props.donnees, "read", "id", this.state.filters, filterFunction);
    }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, filterFunction); }

    handleContentList = (currentData, changeContext, getFilters, filters) => {
        return <BiensList onChangeContext={changeContext}
                            onDelete={this.layout.current.handleDelete}
                            onDeleteAll={this.layout.current.handleDeleteGroup}
                            filters={filters}
                            onGetFilters={this.handleGetFilters}
                            data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}