import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import FilterFunction from "@commonComponents/functions/filter";

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { Search }                 from "@dashboardComponents/Layout/Search";
import { TopSorterPagination }    from "@dashboardComponents/Layout/Pagination";
import { FilterMultiple, FilterSelected } from "@dashboardComponents/Layout/Filter";
import { Button, ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

import { BuyersItem }   from "./BuyersItem";

export class BuyersList extends Component {
    constructor(props) {
        super(props);

        this.filterMultiple = React.createRef();
    }

    handleFilter = (e) => {
        let elem = document.getElementById(e.currentTarget.dataset.id);
        if(elem) elem.click()
    }

    render () {
        const { isClient, dataImmuable, data, onChangeContext, onDeleteAll, onGetFilters, filters, onSearch,
            onPerPage, onPaginationClick, currentPage, sorters, onSorter, perPage, taille } = this.props;

        let filtersLabel = ["Acheteur", "Investisseur", "Autre"];
        let filtersId    = ["f-buyer", "f-invest", "f-other"];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0] },
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
            { value: 2, id: filtersId[2], label: filtersLabel[2] },
        ];

        let negotiatorsFilter = FilterFunction.getNegotiators(dataImmuable);


        let dropdownItems = [
            {data: <a className="item" download="acquereurs.xlsx" href={Routing.generate('api_buyers_export', {'format': 'excel'})}>
                    <ButtonIcon icon="file" text="Exporter en Excel" />
                </a>}
        ]

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un acquéreur</Button>
                    </div>

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
                            {!isClient && <div className="item-header-selector" />}
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">Acquéreur</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <BuyersItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

                {(data && data.length !== 0) && <div className="page-actions">
                    <div className="selectors-actions">
                        {!isClient && <div className="item" onClick={onDeleteAll}>
                            <ButtonIcon icon="trash" text="Supprimer la sélection"/>
                        </div>}
                    </div>
                    <div className="common-actions">
                        <div className="item">
                            <ButtonIconDropdown icon="download" text="Exporter" items={dropdownItems} />
                        </div>
                    </div>
                </div>}
            </div>
        </>
    }
}