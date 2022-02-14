import React, { Component } from 'react';

import FilterFunction from "@commonComponents/functions/filter";

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon }     from "@dashboardComponents/Tools/Button";
import { Search }                 from "@dashboardComponents/Layout/Search";
import { TopSorterPagination }    from "@dashboardComponents/Layout/Pagination";
import { FilterMultiple, FilterSelected } from "@dashboardComponents/Layout/Filter";

import { OwnersItem }   from "./OwnersItem";

export class OwnersList extends Component {
    constructor(props) {
        super(props);

        this.filterMultiple = React.createRef();
    }

    handleFilter = (e) => {
        let elem = document.getElementById(e.currentTarget.dataset.id);
        if(elem) elem.click()
    }

    render () {
        const { isFormBien, isClient, data, dataImmuable, onChangeContext, onDeleteAll, onGetFilters, filters, onSearch, onPerPage,
            onPaginationClick, currentPage, sorters, onSorter, perPage, taille } = this.props;

        let filtersLabel = ["Libre", "Gérance"];
        let filtersId    = ["f-libre", "f-gerance"];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0] },
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
        ];

        let negotiatorsFilter = FilterFunction.getNegotiators(dataImmuable);

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un propriétaire</Button>
                    </div>
                    <div className="item filter-search">
                        <FilterMultiple ref={this.filterMultiple} data={dataImmuable} onGetFilters={onGetFilters} filters={filters}
                                        itemsOne={itemsFilter} itemsTwo={negotiatorsFilter}
                                        titleTwo="Négociateurs" iconTwo="group" widthTwo={164} classesTwo="filter-nego"
                        />
                        <Search onSearch={onSearch} placeholder="Recherche par code, nom, prénom ou téléphone"/>
                        <FilterSelected filters={filters[0]} items={itemsFilter} onChange={this.handleFilter}/>
                        <FilterSelected filters={filters[1]} items={negotiatorsFilter} onChange={this.handleFilter}/>
                    </div>
                </div>

                <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                     currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            {(!isClient || isFormBien) && <div className="item-header-selector" />}
                            <div className="item-content">
                                <div className="item-body">
                                    {isFormBien ? <div className="infos infos-col-3">
                                        <div className="col-1">Propriétaire</div>
                                        <div className="col-2">Négociateur</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div> : <div className="infos infos-col-4">
                                        <div className="col-1">Propriétaire</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <OwnersItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

                {(data && data.length !== 0 && !isClient) && <div className="page-actions">
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