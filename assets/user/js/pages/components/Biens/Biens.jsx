import React, { Component } from "react";

import Sort          from "@commonComponents/functions/sort";

import { Layout }    from "@dashboardComponents/Layout/Page";

import { BiensList } from "./BiensList";
import TopToolbar from "@commonComponents/functions/topToolbar";

const URL_DELETE_ELEMENT    = 'api_biens_delete';
const URL_DELETE_GROUP      = 'api_contact_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer ce bien ?';
const MSG_DELETE_GROUP      = 'Aucun message sélectionné.';
let SORTER = Sort.compareCreatedAtInverse;

let sorters = [
    { value: 0, label: 'Création',      identifiant: 'sorter-createdAt' },
    { value: 1, label: 'Modification',  identifiant: 'sorter-updatedAt' },
    { value: 2, label: 'Libellé',       identifiant: 'sorter-libelle' },
    { value: 3, label: 'Prix ->',       identifiant: 'sorter-price-desc' },
    { value: 4, label: 'Prix <-',       identifiant: 'sorter-price-asc' },
]

let sortersFunction = [Sort.compareCreatedAtInverse, Sort.compareUpdatedAtInverse, Sort.compareLibelle, Sort.compareFinancialPrice, Sort.compareFinancialPriceInverse];

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
                case "user":
                    if(comparateur && comparateur.username === initTab){
                        newTable.push(el)
                    }
                    break;
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
    let newData = [], newData1 = [], newData2 = [], newData3 = [], newData4 = [], newData5 = [], newData6 = [];

    let filtersAd = filters[0];
    let filtersBien = filters[1];
    let filtersMandat = filters[2];
    let filterOwner = filters[3];
    let filterTenant = filters[4];
    let filterNego = filters[5];
    let filterUser = filters[6];

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
        newData5.forEach(el => {
            newData6 = setNewTab("select", filterUser, el, el.user, newData6, "user")
        })

        newData = newData6
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
                props.filterUser ? props.filterUser : "", //utilisateur
            ]
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => {
        self.handleSetDataPagination(this.props.donnees, "read", "id", this.state.filters, filterFunction);
    }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, filterFunction); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <BiensList onChangeContext={changeContext}
                          onDelete={this.layout.current.handleDelete}
                          onDeleteAll={this.layout.current.handleDeleteGroup}
                          filters={filters}
                          onGetFilters={this.handleGetFilters}
                          //changeNumberPerPage
                          perPage={perPage}
                          onPerPage={this.handlePerPage}
                          //twice pagination
                          currentPage={currentPage}
                          onPaginationClick={this.layout.current.handleGetPaginationClick(this)}
                          taille={data.length}
                          //sorter
                          sorters={sorters}
                          onSorter={this.handleSorter}
                          //data
                          tenants={JSON.parse(this.props.tenants)}
                          pageStatus={this.props.pageStatus !== "" ? parseInt(this.props.pageStatus) : false}
                          onUpdateList={this.handleUpdateList}
                          dataFilters={this.layout.current.state.data}
                          data={currentData} />
    }

    render () {
        return <div className="main-content">
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onChangeCurrentPage={this.handleChangeCurrentPage} />
        </div>
    }
}