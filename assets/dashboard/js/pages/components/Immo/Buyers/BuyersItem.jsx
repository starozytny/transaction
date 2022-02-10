import React, { Component } from 'react';

import { Selector }     from "@dashboardComponents/Layout/Selector";
import { ButtonIcon, ButtonIconContact } from "@dashboardComponents/Tools/Button";
import { UtContact, UtMainInfos }        from "@dashboardComponents/Tools/Utilitaire";

import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";

export class BuyersItem extends Component {
    render () {
        const { isSelect, isFromRead, isClient, elem, buyers, onDelete, onSelectors, onChangeContext, onSelectBuyer } = this.props;

        let active = false;
        if(buyers){
            buyers.forEach(item => {
                if(item.id === elem.id){
                    active = true;
                }
            })
        }

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isSelect && <div className="selector" onClick={() => onSelectBuyer(elem)}>
                <label className={"item-selector " + active} />
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1" onClick={isSelect ? () => onSelectBuyer(elem) : null}>
                            <UtMainInfos elem={elem} isClient={isClient} />
                            <div className="sub">Type d'acquéreur : {elem.typeString}</div>
                        </div>

                        <div className="col-2">
                            <UtContact elem={elem} />
                        </div>

                        <div className="col-3">
                            <NegotiatorBubble elem={elem.negotiator} />
                        </div>

                        <div className="col-4 actions">
                            <ButtonIconContact isClient={isClient} email={elem.email} />
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            {(isFromRead && !isSelect) && <ButtonIcon icon="cancel" onClick={() => onSelectBuyer(elem)}>Enlever</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}