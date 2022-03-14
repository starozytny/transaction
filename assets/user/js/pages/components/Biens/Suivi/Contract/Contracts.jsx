import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { ContractsList }       from "@userPages/components/Biens/Suivi/Contract/ContractsList";
import { ContractFormulaire } from "@userPages/components/Biens/Suivi/Contract/ContractForm";
import Swal from "sweetalert2";
import SwalOptions from "@commonComponents/functions/swalOptions";

const URL_SWITCH_STATUS  = 'api_contracts_switch_status';
const URL_DELETE_ELEMENT = 'api_owners_delete';
const MSG_DELETE_ELEMENT = 'Supprimer ce propriétaire ?';
let SORTER = Sort.compareCreatedAtInverse;

let sorters = [
    { value: 0, label: 'Création',    identifiant: 'sorter-create' },
];

let sortersFunction = [Sort.compareCreatedAtInverse];

export class Contracts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "contracts.pagination",
            contractants: props.contractants ? props.contractants : [],
            classes: props.classes !== null ? props.classes : "main-content",
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, "read", "id", this.state.filters, Filter.filterStatus); }

    handleUpdateList = (element, newContext=null) => {
        this.layout.current.handleUpdateList(element, newContext);
        this.props.onUpdateContracts(element, "update");
    }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterStatus); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleSwitchStatus = (element, status) => {
        let text = "Action irréversible";
        if(status === 2){
            text = "Contrat annulé";
        }else if(status === 0){
            text = "Contract terminé."
        }

        Swal.fire(SwalOptions.options("Etes-vous sur de vouloir modifier le status de ce contrat ?", text))
            .then((result) => {
                if (result.isConfirmed) {
                    this.layout.current.handleSwitchData(this, status,
                        Routing.generate(URL_SWITCH_STATUS, {'id': element.id, 'status': status}),
                        "Statut" , " modifié", " modifié"
                    )
                }
            })
        ;
        }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage, contractants } = this.state;

        return <ContractsList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
            //filter-search
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
                           onSwitchStatus={this.handleSwitchStatus}
                           contractants={contractants}
                           data={currentData} />
    }

    handleContentUpdate = (changeContext, element) => {
        return  <ContractFormulaire type="update" element={element} bien={this.props.bien}
                                    onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>;
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
                    onChangeCurrentPage={this.handleChangeCurrentPage}/>
        </>
    }
}
