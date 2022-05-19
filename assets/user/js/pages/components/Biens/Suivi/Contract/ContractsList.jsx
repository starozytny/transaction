import React, { Component } from 'react';

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { TopSorterPagination }    from "@dashboardComponents/Layout/Pagination";
import { Filter, FilterSelected } from "@dashboardComponents/Layout/Filter";

import { ContractsItem }   from "@userPages/components/Biens/Suivi/Contract/ContractsItem";
import {Button} from "@dashboardComponents/Tools/Button";

export class ContractsList extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    render () {
        const { data, onGetFilters, filters, onPerPage,
            onPaginationClick, currentPage, sorters, onSorter, perPage, taille, onOpenSell } = this.props;

        let filtersLabel = ["Terminé", "En cours", "Annulé"];
        let filtersId    = ["f-end", "f-progressing", "f-canceled"];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0] },
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
            { value: 2, id: filtersId[2], label: filtersLabel[2] },
        ];

        return <>
            <div>
                <div className="toolbar">
                    {onOpenSell && <div className="item create">
                        <Button onClick={onOpenSell}>Bien vendu</Button>
                    </div>}

                    <div className="item filter-search">
                        <Filter ref={this.filter} items={itemsFilter} onGetFilters={onGetFilters} />
                        <FilterSelected filters={filters} items={itemsFilter} onChange={this.handleFilter}/>
                    </div>
                </div>

                <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                     currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                   <div className="infos infos-col-4">
                                        <div className="col-1">Date du contrat</div>
                                        <div className="col-2">Par qui / motif</div>
                                        <div className="col-3">Propriétaire</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <ContractsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}
