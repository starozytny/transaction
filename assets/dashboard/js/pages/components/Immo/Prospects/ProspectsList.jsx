import React, { Component } from 'react';

import FilterFunction from "@commonComponents/functions/filter";

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon }     from "@dashboardComponents/Tools/Button";
import { Search }                 from "@dashboardComponents/Layout/Search";
import {Filter, FilterMultiple, FilterSelected} from "@dashboardComponents/Layout/Filter";
import { TopSorterPagination }    from "@dashboardComponents/Layout/Pagination";

import { ProspectsItem }   from "./ProspectsItem";

export class ProspectsList extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.filterMultiple = React.createRef();
    }

    handleFilter = (e) => {
        let elem = document.getElementById(e.currentTarget.dataset.id);
        if(elem) elem.click()
    }

    render () {
        const { isSelect=false, isClient, data, dataImmuable, onSearch, onChangeContext, onDeleteAll, onGetFilters, filters,
            sorters, onSorter, currentPage, perPage, onPerPage, taille, onPaginationClick } = this.props;

        let filtersLabel = ["Aucun", "En recherche", "A compléter", "A contacter", "En offre"];
        let filtersId    = ["f-aucun", "f-search", "f-complete", 'f-contact', 'f-offer'];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0] },
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
            { value: 2, id: filtersId[2], label: filtersLabel[2] },
            { value: 3, id: filtersId[3], label: filtersLabel[3] },
            { value: 4, id: filtersId[4], label: filtersLabel[4] }
        ];

        let negotiatorsFilter = FilterFunction.getNegotiators(dataImmuable);

        return <>
            <div>
                <div className="toolbar toolbar-prospect">
                    {!isSelect && <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un prospect</Button>
                    </div>}
                    <div className="item filter-search">
                        <FilterMultiple ref={this.filterMultiple} data={dataImmuable} onGetFilters={onGetFilters} filters={filters}
                                        itemsOne={itemsFilter} itemsTwo={negotiatorsFilter}
                                        titleTwo="Négociateurs" iconTwo="group" widthTwo={164} classesTwo="filter-nego"
                        />
                        <Search onSearch={onSearch} placeholder="Recherche par nom, prénom ou téléphone"/>
                        <FilterSelected filters={filters[0]} items={itemsFilter} onChange={this.handleFilter}/>
                        <FilterSelected filters={filters[1]} items={negotiatorsFilter} onChange={this.handleFilter}/>
                    </div>
                </div>

                <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                     currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            {(!isClient || isSelect) && <div className="item-header-selector" />}
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-5">
                                        <div className="col-1">Prospect</div>
                                        <div className="col-3">Status</div>
                                        <div className="col-3">Recherche</div>
                                        <div className="col-4" />
                                        <div className="col-5 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <ProspectsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

                {(!isSelect && data && data.length !== 0 && !isClient) && <div className="page-actions">
                    <div className="selectors-actions">
                        <div className="item" onClick={onDeleteAll}>
                            <ButtonIcon icon="trash" text="Supprimer la sélection" />
                        </div>
                    </div>
                </div>}
            </div>
        </>
    }
}