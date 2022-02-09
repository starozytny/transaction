import React, { Component } from 'react';

import axios        from "axios";
import Swal         from "sweetalert2";
import SwalOptions  from "@commonComponents/functions/swalOptions";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { ProspectsList }       from "./ProspectsList";
import { ProspectFormulaire }  from "./ProspectForm";
import { ProspectRead }        from "@dashboardPages/components/Immo/Prospects/ProspectRead";
import { SearchFormulaire }    from "@dashboardPages/components/Immo/Searchs/SearchForm";

const URL_ARCHIVED_ELEMENT = 'api_prospects_switch_archived';
const URL_DELETE_SEARCH  = 'api_searchs_delete';
const URL_DELETE_ELEMENT = 'api_prospects_delete';
const URL_DELETE_GROUP   = 'api_prospects_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer ce prospect ?';
const MSG_DELETE_GROUP   = 'Aucun prospect sélectionné.';
let SORTER = Sort.compareLastname;

let sorters = [
    { value: 0, label: 'Nom',           identifiant: 'sorter-nom' },
    { value: 1, label: 'Email',         identifiant: 'sorter-email' },
]

let sortersFunction = [Sort.compareLastname, Sort.compareEmail];

export class Prospects extends Component {
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
            sessionName: "prospects.pagination",
            idAgency: parseInt(props.agencyId),
            idSociety: parseInt(props.societyId),
            societies: props.societies ? JSON.parse(props.societies) : [],
            agencies: props.agencies ? JSON.parse(props.agencies) : [],
            negotiators: props.negotiators ? JSON.parse(props.negotiators) : [],
            isClient: props.isClient ? props.isClient : false,
            isSelect: props.isSelect ? props.isSelect : false,
            classes: props.classes ? props.classes : "main-content",
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSwitchArchived = this.handleSwitchArchived.bind(this);
        this.handleDeleteSearch = this.handleDeleteSearch.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentRead = this.handleContentRead.bind(this);
        this.handleContentCustomOne = this.handleContentCustomOne.bind(this);
        this.handleContentCustomTwo = this.handleContentCustomTwo.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, "read", "id"); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "prospect", true, Filter.filterStatus); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterStatus); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleSwitchArchived = (element) => {
        let title = element.isArchived ? "Rétablir ce prospect ?" : "Archiver ce prospect ?"

        const self = this;
        Swal.fire(SwalOptions.options(title, ""))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    axios.post(Routing.generate(URL_ARCHIVED_ELEMENT, {'id': element.id}), {})
                        .then(function (response) {
                            self.handleUpdateList(element, "delete");
                        })
                        .catch(function (error) {
                            Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                        .then(() => {
                            Formulaire.loader(false);
                        })
                    ;
                }
            })
        ;
    }

    handleDeleteSearch = (element) => {
        const self = this;
        Swal.fire(SwalOptions.options("Supprimer cette recherche ?", "Cette action est irréversible"))
            .then((result) => {
                if (result.isConfirmed) {
                    Formulaire.loader(true);
                    axios.delete(Routing.generate(URL_DELETE_SEARCH, {'id': element.search.id}), {})
                        .then(function (response) {
                            element.search = null;
                            self.handleUpdateList(element, "update");
                        })
                        .catch(function (error) {
                            Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                        .then(() => {
                            Formulaire.loader(false);
                        })
                    ;
                }
            })
        ;
    }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <ProspectsList onChangeContext={changeContext}
                              onDelete={this.layout.current.handleDelete}
                              onDeleteAll={this.layout.current.handleDeleteGroup}
                              onDeleteSearch={this.handleDeleteSearch}
                              //filter-search
                              onSearch={this.handleSearch}
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
                              isClient={this.state.isClient}
                              isSelect={this.state.isSelect}
                              onSwitchArchived={this.handleSwitchArchived}
                              onSelectProspect={this.props.onSelectProspect}
                              data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <ProspectFormulaire type="create" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <ProspectFormulaire type="update" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency} element={element}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <ProspectRead elem={element} onChangeContext={changeContext} />
    }

    handleContentCustomOne = (changeContext, element) => {
        return <SearchFormulaire type="create" prospectId={element.id} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentCustomTwo = (changeContext, element) => {
        return <SearchFormulaire type="update" element={element.search} prospectId={element.id} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} search={this.props.search} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
                    onContentCustomOne={this.handleContentCustomOne} onContentCustomTwo={this.handleContentCustomTwo}
                    onChangeCurrentPage={this.handleChangeCurrentPage} />
        </>
    }
}