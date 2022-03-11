import React, { Component } from "react";

import Sort          from "@commonComponents/functions/sort";
import TopToolbar    from "@commonComponents/functions/topToolbar";

import { Layout }    from "@dashboardComponents/Layout/Page";

import { BiensList } from "./BiensList";
import {Aside} from "@dashboardComponents/Tools/Aside";
import {Suivi} from "@userPages/components/Biens/Suivi/Suivi";
import DataState from "@userPages/components/Biens/Form/data";
import AgendaData from "@userPages/components/Agenda/agendaData";

const URL_GET_DATA          = 'api_agenda_data_persons';
const URL_DELETE_ELEMENT    = 'api_biens_delete';
const URL_DELETE_GROUP      = 'api_contact_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer ce bien ?';
const MSG_DELETE_GROUP      = 'Aucun message sélectionné.';
let SORTER = Sort.compareCreatedAtInverse;
let i = 0;

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
    let filterNego = filters[3];
    let filterUser = filters[4];
    let filterAgency = filters[5];

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
            newData3 = setNewTab("select", filterNego, el, el.negotiator, newData3, "nego")
        })
        newData3.forEach(el => {
            newData4 = setNewTab("select", filterUser, el, el.user, newData4, "user")
        })
        newData4.forEach(el => {
            newData5 = setNewTab("array", filterAgency, el, el.agency.id, newData5)
        })

        newData = newData5;
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
            agencyId: props.agencyId ? parseInt(props.agencyId) : "",
            filters: [
                // [0, 1], // type ad
                // [0, 1, 2, 3], // type bien
                [],
                [],
                [], //type mandat
                props.filterNego ? parseInt(props.filterNego) : "", //negotiator
                props.filterUser ? props.filterUser : "", //utilisateur
                props.agencyId ? [parseInt(props.agencyId)] : [], //agency
            ]
        }

        this.layout = React.createRef();
        this.aside = React.createRef();
        this.suivi = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleOpenSuivi = this.handleOpenSuivi.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    componentDidMount = () => {
        DataState.getProspects(this);
        AgendaData.getData(this, URL_GET_DATA);
    }

    handleGetData = (self) => {
        self.handleSetDataPagination(this.props.donnees, "read", "id", this.state.filters, filterFunction);
    }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, filterFunction); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleOpenSuivi = (element) => {
        this.suivi.current.handleLoadData(element);
        this.aside.current.handleOpen("Suivi du bien");
    }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { rapprochements, suivis, contractants } = this.props;
        const { perPage, currentPage, agencyId } = this.state;

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
                          agencyId={agencyId}
                          pageStatus={this.props.pageStatus !== "" ? parseInt(this.props.pageStatus) : false}
                          onUpdateList={this.handleUpdateList}
                          dataFilters={data}
                          rapprochements={rapprochements ? JSON.parse(rapprochements) : []}
                          suivis={suivis ? JSON.parse(suivis) : []}
                          contractants={contractants ? JSON.parse(contractants) : []}
                          onOpenSuivi={this.handleOpenSuivi}
                          dataImmuable={this.layout.current.state.dataImmuable}
                          data={currentData} />
    }

    render () {
        return <div className="main-content">
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onChangeCurrentPage={this.handleChangeCurrentPage} />
            <Aside ref={this.aside} content={<Suivi ref={this.suivi} {...this.state} isFromListBien={true} key={i++}/>} />
        </div>
    }
}
