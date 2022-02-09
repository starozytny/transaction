import React, { Component } from 'react';

import { ButtonIcon, ButtonIconContact, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";
import { Selector }         from "@dashboardComponents/Layout/Selector";
import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";
import Sanitaze from "@commonComponents/functions/sanitaze";

export class ProspectsItem extends Component {
    render () {
        const { isSelect, isFromRead, isClient, elem, prospects,
            onDelete, onDeleteSearch, onSelectors, onChangeContext, onSelectProspect, onSwitchArchived } = this.props;

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
                        <div className="col-1" onClick={isSelect ? () => onSelectProspect(elem) : () => onChangeContext("read", elem)}>
                            <ProspectsMainInfos elem={elem} isClient={isClient} />
                        </div>

                        <div className="col-2" onClick={!isSelect ? () => onChangeContext("read", elem) : null}>
                            <div className="badges">
                                <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                                {elem.isArchived && <div className="badge badge-default">Archivé</div>}
                            </div>
                            <div className="sub">Type de prospect : {elem.typeString}</div>
                            {elem.lastContactAtAgo && <div className="sub">Dernier contact : {elem.lastContactAtAgo}</div>}
                            <NegotiatorBubble elem={elem.negotiator} txt={null}/>
                        </div>

                        <div className="col-3">
                            {elem.search ? <>
                                <SearchInfos1 elem={elem.search} />
                            </> : null}
                        </div>

                        <div className="col-4">
                            {elem.search ? <>
                                <SearchInfos2 elem={elem.search} />
                                <div className="actions-crud-search">
                                    <ButtonSearchCrud icon="pencil" onClick={() => onChangeContext('customTwo', elem)}>Modifier</ButtonSearchCrud>
                                    <ButtonSearchCrud icon="trash" onClick={() => onDeleteSearch(elem)}>Supprimer</ButtonSearchCrud>
                                </div>
                            </> : <ButtonSearchCrud icon="add-square" onClick={() => onChangeContext('customOne', elem)}>Ajouter une recherche</ButtonSearchCrud>}
                        </div>

                        <div className="col-5 actions">
                            <ButtonIconContact isClient={isClient} email={elem.email} />
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIconDropdown icon="trash" items={actions}>Suppression</ButtonIconDropdown>
                            {(isFromRead && !isSelect) && <ButtonIcon icon="cancel" onClick={() => onSelectProspect(elem)}>Enlever</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export function ProspectsMainInfos ({ elem, isClient }) {
    return <>
        <div className="name">
            <span>{elem.lastname} {elem.firstname}</span>
        </div>
        {!isClient && <div className="sub">{elem.agency.name}</div>}
        <div className="sub">{elem.email}</div>
        <div className="sub">{elem.phone1}</div>
        <div className="sub">{elem.phone2}</div>
        <div className="sub">{elem.phone3}</div>
    </>
}

export function SearchInfos1({ elem }) {
    return <>
        <div className="badges">
            <div className="badge badge-default">{elem.typeAdString}</div>
            <div className="badge badge-default">{elem.typeBienString}</div>
        </div>

        <div className="sub">
            {Sanitaze.toFormatCurrency(elem.minPrice)} à {Sanitaze.toFormatCurrency(elem.maxPrice)}
        </div>
        <div className="sub">{elem.minPiece} à {elem.maxPiece} pièces</div>
        <div className="sub">{elem.minRoom} à {elem.maxRoom} chambres</div>
        <div className="sub">Surface : {elem.minArea} m² à {elem.maxArea} m²</div>
        <div className="sub">Terrain : {elem.minLand} m² à {elem.maxLand} m²</div>
    </>
}

export function SearchInfos2({ elem }) {
    return <>
        <div className="sub">Ascenseur : {Sanitaze.toTrilleanString(elem.hasLift, "Indifférent")}</div>
        <div className="sub">Terrasse : {Sanitaze.toTrilleanString(elem.hasTerrace, "Indifférent")}</div>
        <div className="sub">Balcon : {Sanitaze.toTrilleanString(elem.hasBalcony, "Indifférent")}</div>
        <div className="sub">Parking : {Sanitaze.toTrilleanString(elem.hasParking, "Indifférent")}</div>
        <div className="sub">Box : {Sanitaze.toTrilleanString(elem.hasBox, "Indifférent")}</div>

        <div className="sub">{elem.zipcode} {elem.city}</div>
    </>
}

export function ButtonSearchCrud({ onClick, icon, children }) {
    return <div className="sub crud-search" onClick={onClick}>
        <span className={"icon-" + icon} />
        <span>{children}</span>
    </div>
}