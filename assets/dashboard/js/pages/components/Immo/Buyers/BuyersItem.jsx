import React, { Component } from 'react';

import Actions from "@userComponents/functions/actions";

import { Selector }     from "@dashboardComponents/Layout/Selector";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";
import { UtContact, UtMainInfos }         from "@dashboardComponents/Tools/Utilitaire";

import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";
import { MailAside }        from "@dashboardPages/components/Mails/MailAside";

export class BuyersItem extends Component {
    constructor(props) {
        super(props);

        this.mail = React.createRef();
    }

    render () {
        const { isClient, elem, buyers, onDelete, onSelectors, onChangeContext } = this.props;

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

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className={"badge badge-" + elem.type}>{elem.typeString}</div>
                            <UtMainInfos elem={elem} isClient={isClient} />
                        </div>

                        <div className="col-2">
                            <UtContact elem={elem} />
                        </div>

                        <div className="col-3">
                            <NegotiatorBubble elem={elem.negotiator} />
                        </div>

                        <div className="col-4 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            <ButtonIconDropdown icon="dropdown" items={Actions.getDefaultAction(isClient, elem, "buyer", this.mail)}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>

            <MailAside ref={this.mail} to={[elem.email]} />
        </div>
    }
}
