import React, { Component } from 'react';

import Actions from "@userComponents/functions/actions";

import { ButtonIcon, ButtonIconContact, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";
import { Selector }  from "@dashboardComponents/Layout/Selector";
import { UtPhones }  from "@dashboardComponents/Tools/Utilitaire";

import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";
import { SearchMainInfos1 } from "@dashboardPages/components/Immo/Searchs/SearchsItem";

export class ProspectsItem extends Component {
    render () {
        const { isSelect, isClient, elem, prospects, onDelete, onDeleteSearch, onSelectors, onChangeContext, onSelectProspect, onSwitchArchived } = this.props;

        let active = false;
        if(prospects){
            prospects.forEach(te => {
                if(te.id === elem.id){
                    active = true;
                }
            })
        }

        let actions = [
            {data: <a onClick={() => onDelete(elem)}>Supprimer</a>},
            {data: <a onClick={() => onSwitchArchived(elem)}>{elem.isArchived ? "Désarchiver" : "Archiver"}</a>}
        ]

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isSelect && <div className="selector" onClick={() => onSelectProspect(elem)}>
                <label className={"item-selector " + active} />
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-5">
                        <div className="col-1">
                            <ProspectsMainInfos elem={elem} isClient={isClient}
                                                onClick={isSelect ? () => onSelectProspect(elem) : () => onChangeContext("read", elem)} />
                            <UtPhones elem={elem} />
                        </div>

                        <div className="col-2" onClick={!isSelect ? () => onChangeContext("read", elem) : null}>
                            <div className="badges">
                                <div className={"badge-prospect badge badge-" + elem.status}>{elem.statusString}</div>
                                {elem.isArchived && <div className="badge badge-default">Archivé</div>}
                            </div>
                            <div className="sub">Type de prospect : {elem.typeString}</div>
                            {elem.lastContactAtAgo && <div className="sub">Dernier contact : {elem.lastContactAtAgo}</div>}
                            <NegotiatorBubble elem={elem.negotiator} txt={null}/>
                        </div>

                        <div className="col-3">
                            {elem.search ? <SearchInfos elem={elem.search} isRa={true} /> : null}
                        </div>

                        <div className="col-4">
                            {elem.search ? <>
                                <div className="actions-crud-search">
                                    <ButtonSearchCrud icon="layer" onClick={() => onChangeContext('read', elem)}>Résultats</ButtonSearchCrud>
                                    <ButtonSearchCrud icon="pencil" onClick={() => onChangeContext('customTwo', elem)}>Modifier</ButtonSearchCrud>
                                    <ButtonSearchCrud icon="trash" onClick={() => onDeleteSearch(elem)}>Supprimer</ButtonSearchCrud>
                                </div>
                            </> : <ButtonSearchCrud icon="add-square" onClick={() => onChangeContext('customOne', elem)}>Ajouter une recherche</ButtonSearchCrud>}
                        </div>

                        <div className="col-5 actions">
                            <ButtonIconContact isClient={isClient} email={elem.email} />
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIconDropdown icon="trash" items={actions}>Suppression</ButtonIconDropdown>
                            <ButtonIconDropdown icon="dropdown" items={Actions.getDefaultAction(isClient, elem, "prospect")}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export function ProspectsMainInfos ({ elem, isClient, onClick }) {
    return <div onClick={onClick}>
        <div className="name">
            <span>{elem.lastname} {elem.firstname}</span>
        </div>
        {!isClient && <div className="sub">{elem.agency.name}</div>}
        <div className="sub">{elem.email}</div>
    </div>
}

export function SearchInfos({ elem, isRa = false }) {
    return <>
        <div className="badges">
            <div className="badge badge-default">{elem.typeAdString}</div>
            <div className="badge badge-default">{elem.typeBienString}</div>
        </div>

        <SearchMainInfos1 elem={elem} isRa={isRa} />
    </>
}

export function ButtonSearchCrud({ onClick, icon, children }) {
    return <div className="sub crud-search" onClick={onClick}>
        <span className={"icon-" + icon} />
        <span>{children}</span>
    </div>
}