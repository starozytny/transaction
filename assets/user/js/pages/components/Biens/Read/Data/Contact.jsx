import React     from "react";

import helper    from "@userPages/components/Biens/functions/helper";

import { OwnersItem }  from "@dashboardPages/components/Immo/Owners/OwnersItem";
import { TenantsItem } from "@dashboardPages/components/Immo/Tenants/TenantsItem";

export function Contact({ elem, tenants }){
    return (<div className="details-tab-infos">
        <div className="details-tab-infos-content">
            <div className="content contacts">
                <div className="label">Qui prévenir ?</div>
                <Confidential confidential={elem.confidential}/>
            </div>
            <div className="content contacts">
                <div className="label">Agence</div>
                <div className="contact">
                    <div>{elem.agency.name}</div>
                    <div>{helper.getRightPhoneBien(elem.agency, elem.codeTypeAd)}</div>
                    <div>{helper.getRightEmailBien(elem.agency, elem.codeTypeAd)}</div>
                </div>
            </div>
            <div className="content contacts">
                <div className="label">Négociateur</div>
                <div className="contact">
                    <div>{elem.negotiator.fullname}</div>
                    <div>{elem.negotiator.phone}</div>
                    <div>{elem.negotiator.phone2}</div>
                    <div>{elem.negotiator.email}</div>
                </div>
            </div>
            <div className="content">
                <div className="label">Propriétaire</div>
                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Propriétaire</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {elem.owner ? <OwnersItem isReadBien={true} isClient={true} isFormBien={false} elem={elem.owner} biens={[]}/>
                            : <div className="item">Aucun propriétaire</div>}
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="label">Locataire(s)</div>
                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Locataire</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {tenants.length !== 0 ? tenants.map(el => {
                            return <TenantsItem isReadBien={true} isClient={true} isFormBien={false} elem={el} tenants={[]} key={el.id} />
                        }) : <div className="item">Aucun locataire</div>}

                    </div>
                </div>
            </div>
        </div>
    </div>)
}

function Confidential({ confidential }){

    let lastname = "Aucun contact en particulier.", phone, email;
    switch (confidential.inform){
        case 1:
            lastname = "Propriétaire";
            break;
        case 2:
            lastname = "Locataire";
            break;
        case 3:
            lastname = confidential.lastname;
            phone = confidential.phone1;
            email = confidential.email;
            break;
        default:
            break;
    }

    return <>
        {confidential.inform !== 0 && <div className="contact">
            <div><span className="icon-user" /> {lastname}</div>
            {phone ? <div>{phone}</div> : ""}
            {email ? <div>{email}</div> : ""}
        </div>}
    </>
}