import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Actions from "@userComponents/functions/actions";

import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";
import { Selector }  from "@dashboardComponents/Layout/Selector";
import { UtContact } from "@dashboardComponents/Tools/Utilitaire";

import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";

export class OwnersItem extends Component {
    render () {
        const { isReadBien=false, isClient, isFormBien, owner, biens, elem,
            onDelete, onSelectors, onChangeContext, onSelectOwner } = this.props;

        let totalBiens = 0;
        if(biens) {
            biens.forEach(bien => {
                if (bien.owner && bien.owner.id === elem.id) {
                    totalBiens++;
                }
            })
        }

        let actions = Actions.getDefaultAction(isClient, elem, "owner");
        actions = actions.concat([
            {data: <a target="_blank" href={Routing.generate('user_printer_owner', {'id': elem.id})}>Imprimer rapport</a>},
        ])

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isFormBien && <div className="selector" onClick={onSelectOwner ? () => onSelectOwner(elem) : null}>
                <label className={"item-selector " + (owner === elem.id)}/>
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className={"infos infos-col-" + ((isReadBien || isFormBien) ? "3" : "4")}>
                        <div className="col-1" onClick={onSelectOwner ? () => onSelectOwner(elem) : () => onChangeContext("read", elem)}>
                            <OwnerMainInfos elem={elem} />
                            {!isClient && <div className="sub">{elem.society.fullname}</div>}
                            {biens.length !== 0 && <div className="sub">{totalBiens} bien{totalBiens > 1 ? "s" : ""}</div>}
                        </div>

                        {!isFormBien && <div className="col-2">
                            <UtContact elem={elem} />
                        </div>}

                        <div className={isFormBien ? "col-2" : "col-3"} onClick={onSelectOwner ? () => onSelectOwner(elem) : () => onChangeContext("read", elem)}>
                            <NegotiatorBubble elem={elem.negotiator} />
                        </div>
                        {!isReadBien && <div className={isFormBien ? "col-3 actions" : "col-4 actions"}>
                            {(biens.length !== 0 && totalBiens !== 0) &&
                                <ButtonIcon icon="layer" element="a" onClick={Routing.generate('user_biens', {'fo': elem.id})}>
                                    Biens
                                </ButtonIcon>}
                            {!elem.isGerance && <>
                                <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                {!isFormBien && <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}
                            </>}
                            <ButtonIconDropdown icon="dropdown" items={actions}>Autres</ButtonIconDropdown>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    }
}

export function OwnerMainInfos ({ elem }) {
    return <>
        <div className="badges">
            <div className="badge">{elem.code}</div>
            {elem.isGerance && <>
                <div className="badge badge-default">Gérance</div>
                <div className="badge badge-default">#{elem.codeGerance}</div>
            </>}
        </div>
        <div className="name">
            <span>{elem.fullname}</span>
        </div>
    </>
}