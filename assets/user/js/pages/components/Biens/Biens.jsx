import React, { Component } from "react";

import Sort          from "@commonComponents/functions/sort";

import { Layout }    from "@dashboardComponents/Layout/Page";

import { BiensList } from "./BiensList";

const URL_DELETE_ELEMENT    = 'api_biens_delete';
const URL_DELETE_GROUP      = 'api_contact_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer ce bien ?';
const MSG_DELETE_GROUP      = 'Aucun message sélectionné.';
const SORTER = Sort.compareCreatedAt;

function setNewTab(type, initTab, el, comparateur, newTable, subType="") {
    if(initTab.length !== 0){
        if(type === "array"){
            initTab.forEach(filter => {
                if(filter === comparateur){
                    newTable.push(el);
                }
            })
        }else{
            switch (subType) {
                case "tenant":
                    if(el.id === initTab){
                        newTable.push(el)
                    }
                    break;
                default:
                    if(comparateur && comparateur.id === initTab){
                        newTable.push(el)
                    }
                    break;
            }

        }
    }else{
        newTable.push(el)
    }

    return newTable;
}

function filterFunction(dataImmuable, filters){
    let newData = [];
    let newData1 = [];
    let newData2 = [];
    let newData3 = [];
    let newData4 = [];
    let newData5 = [];

    let filtersAd = filters[0];
    let filtersBien = filters[1];
    let filtersMandat = filters[2];
    let filterOwner = filters[3];
    let filterTenant = filters[4];
    let filterNego = filters[5];

    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            newData = setNewTab("array", filtersAd, el, el.codeTypeAd, newData);
        })
        newData.forEach(el => {
            newData1 = setNewTab("array", filtersBien, el, el.codeTypeBien, newData1);
        })
        newData1.forEach(el => {
            newData2 = setNewTab("array", filtersMandat, el, el.codeTypeMandat, newData2);
        })
        newData2.forEach(el => {
            newData3 = setNewTab("select", filterOwner, el, el.owner, newData3, "owner")
        })
        newData3.forEach(el => {
            newData4 = setNewTab("select", filterTenant, el, el.tenants, newData4, "tenant")
        })
        newData4.forEach(el => {
            newData5 = setNewTab("select", filterNego, el, el.negotiator, newData5, "nego")
        })

        newData = newData5
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
            classes: "",
            filters: [
                // [0, 1], // type ad
                // [0, 1, 2, 3], // type bien
                [],
                [],
                [], //type mandat
                props.filterOwner ? parseInt(props.filterOwner) : "", //owner
                props.filterTenant ? parseInt(props.filterTenant) : "", //tenant - value == bienId
                props.filterNego ? parseInt(props.filterNego) : "", //negotiator
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
                          tenants={JSON.parse(this.props.tenants)}
                          pageStatus={this.props.pageStatus !== "" ? parseInt(this.props.pageStatus) : false}
                          pageDraft={this.props.pageStatus !== "" ? parseInt(this.props.pageDraft) : false}
                          onUpdateList={this.handleUpdateList}
                          data={currentData} />
    }

    render () {
        return <div className="main-content">
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </div>
    }
}