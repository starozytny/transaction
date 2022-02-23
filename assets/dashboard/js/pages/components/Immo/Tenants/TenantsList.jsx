import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { Search }                 from "@dashboardComponents/Layout/Search";
import { TopSorterPagination }    from "@dashboardComponents/Layout/Pagination";
import { Button, ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

import { TenantsItem }   from "./TenantsItem";

export class TenantsList extends Component {
    render () {
        const { isFormBien, isClient, data, onSearch, onChangeContext, onDeleteAll, onPerPage,
            onPaginationClick, currentPage, sorters, onSorter, perPage, taille } = this.props;

        let dropdownItems = [
            {data: <a className="item" download="locataires.xlsx" href={Routing.generate('api_tenants_export', {'format': 'excel'})}>
                    <ButtonIcon icon="file" text="Exporter en Excel" />
                </a>}
        ]

        return <>
            <div>
                <div className="toolbar">
                    {!isClient && <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un locataire</Button>
                    </div>}
                    <div className="item filter-search">
                        <Search onSearch={onSearch} placeholder="Recherche par nom, prénom.."/>
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
                                        <div className="col-1">Locataire</div>
                                        <div className="col-2">Négociateur</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div> : <div className="infos infos-col-4">
                                        <div className="col-1">Locataire</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>}

                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <TenantsItem {...this.props} elem={elem} key={elem.id}/>
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