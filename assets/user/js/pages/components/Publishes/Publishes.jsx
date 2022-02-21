import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { PublishesList } from "./PublishesList";

let SORTER = Sort.compareCreatedAtInverse;

let sorters = [
    { value: 0, label: 'Création',      identifiant: 'sorter-createdAt' },
    { value: 1, label: 'Modification',  identifiant: 'sorter-updatedAt' },
    { value: 2, label: 'Libellé',       identifiant: 'sorter-libelle' },
    { value: 3, label: 'Prix ->',       identifiant: 'sorter-price-desc' },
    { value: 4, label: 'Prix <-',       identifiant: 'sorter-price-asc' },
]

let sortersFunction = [Sort.compareCreatedAtInverse, Sort.compareUpdatedAtInverse, Sort.compareLibelle, Sort.compareFinancialPrice, Sort.compareFinancialPriceInverse];

export class Publishes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "supports.pagination",
            publishes: props.publishes ? JSON.parse(props.publishes) : []
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage, publishes } = this.state;

        return <PublishesList onChangeContext={changeContext}
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
                              publishes={publishes}
                              data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onChangeCurrentPage={this.handleChangeCurrentPage}/>
        </>
    }
}