import React, { Component } from 'react';


import Actions from "@userComponents/functions/actions";

import { Selector }  from "@dashboardComponents/Layout/Selector";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";
import { UtContact, UtMainInfos }         from "@dashboardComponents/Tools/Utilitaire";

import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";
import { MailAside }        from "@dashboardPages/components/Mails/MailAside";

export class TenantsItem extends Component {
    constructor(props) {
        super(props);

        this.mail = React.createRef();
    }

    render () {
        const { isClient, isFormBien, tenants, elem,
            onDelete, onSelectors, onChangeContext, onSelectTenant } = this.props;

        let active = false;
        tenants.forEach(te => {
            if(te.id === elem.id){
                active = true;
            }
        })

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isFormBien && <div className="selector" onClick={() => onSelectTenant(elem)}>
                <label className={"item-selector " + active} />
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className={"infos infos-col-" + (isFormBien ? "3" : "4")}>
                        <div className="col-1" onClick={onSelectTenant ? () => onSelectTenant(elem) : null}>
                            <UtMainInfos elem={elem} isClient={isClient} />
                        </div>
                        {!isFormBien && <div className="col-2">
                            <UtContact elem={elem} />
                        </div>}
                        <div className={isFormBien ? "col-2" : "col-3"} onClick={onSelectTenant ? () => onSelectTenant(elem) : null}>
                            <NegotiatorBubble elem={elem.negotiator} />
                        </div>
                        <div className={isFormBien ? "col-3 actions" : "col-4 actions"}>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            {!isFormBien && <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}
                            <ButtonIconDropdown icon="dropdown" items={Actions.getDefaultAction(isClient, elem, "tenant", this.mail)}>Autres</ButtonIconDropdown>
                        </div>
                    </div>
                </div>
            </div>

            <MailAside ref={this.mail} to={[elem.email]} />
        </div>
    }
}
