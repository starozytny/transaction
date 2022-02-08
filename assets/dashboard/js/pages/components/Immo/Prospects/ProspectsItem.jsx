import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon, ButtonIconContact } from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class ProspectsItem extends Component {
    render () {
        const { isSelect, isFromRead, isClient, elem, prospects, onDelete, onSelectors, onChangeContext, onSelectProspect } = this.props;

        let active = false;
        if(prospects){
            prospects.forEach(te => {
                if(te.id === elem.id){
                    active = true;
                }
            })
        }

        let routeSearchs = isClient ? "user_prospects_searchs" : "admin_prospects_searchs";

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isSelect && <div className="selector" onClick={() => onSelectProspect(elem)}>
                <label className={"item-selector " + active} />
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1" onClick={isSelect ? () => onSelectProspect(elem) : null}>
                            <ProspectsMainInfos elem={elem} isClient={isClient} />
                        </div>

                        <div className="col-2">
                            <ProspectsNegotiator elem={elem} />
                        </div>

                        <div className="col-3">
                            <div className="badges">
                                <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                                {elem.isArchived && <div className="badge badge-default">Archive</div>}
                            </div>
                            <div className="sub">Type de prospect : {elem.typeString}</div>
                            {elem.lastContactAtAgo && <div className="sub">Dernier contact : {elem.lastContactAtAgo}</div>}
                        </div>

                        <div className="col-4 actions">
                            <ButtonIcon icon="search" element="a" onClick={Routing.generate(routeSearchs, {'id': elem.id})}>Recherches</ButtonIcon>
                            <ButtonIconContact isClient={isClient} email={elem.email} />
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
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

export function ProspectsNegotiator ({ elem }) {
    return <>
        <div className="sub">{elem.negotiator ? elem.negotiator.fullname : "/"}</div>
    </>
}