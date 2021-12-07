import React, { Component } from "react";

import Sort          from "@commonComponents/functions/sort";

import { Layout }    from "@dashboardComponents/Layout/Page";

import { BiensList } from "./BiensList";

const URL_DELETE_ELEMENT    = 'api_biens_delete';
const URL_DELETE_GROUP      = 'api_contact_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer ce bien ?';
const MSG_DELETE_GROUP      = 'Aucun message sélectionné.';
const SORTER = Sort.compareCreatedAt;

function filterFunction(dataImmuable, filters){
    let newData = [];

    let filterAd = filters[0];

    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            if(el.codeTypeAd === filterAd || filterAd === ""){
                newData.push(el);
            }
        })
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
            sessionName: "biens.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

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