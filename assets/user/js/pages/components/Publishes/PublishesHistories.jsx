import React, { Component } from 'react';

import Sort              from "@commonComponents/functions/sort";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { Layout }        from "@dashboardComponents/Layout/Page";

import { PublishesHistoriesList } from "@userPages/components/Publishes/PublishesHistoriesList";

let SORTER = Sort.compareCreatedAtInverse;

let sorters = [
    { value: 0, label: 'Création',      identifiant: 'sorter-createdAt' },
]

let sortersFunction = [Sort.compareCreatedAtInverse];

export class PublishesHistories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "publishes.histories.pagination",
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
        const { perPage, currentPage } = this.state;

        return <PublishesHistoriesList onChangeContext={changeContext}
                              perPage={perPage}
                              onPerPage={this.handlePerPage}
                              currentPage={currentPage}
                              onPaginationClick={this.layout.current.handleGetPaginationClick(this)}
                              taille={data.length}
                              sorters={sorters}
                              onSorter={this.handleSorter}
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
