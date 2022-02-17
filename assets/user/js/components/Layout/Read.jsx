import React from "react";

import { ButtonIcon }       from "@dashboardComponents/Tools/Button";
import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";

export function ReadCard (props)
{
    const { displayActions = true, elem, avatar, onChangeContext, totalBiens = null } = props;

    return <div className="item-read-2-container">
        <div className="item-read-2">
            <div className="col-1">
                <div className="image">
                    <img src={avatar ? avatar : "https://robohash.org/" + elem.id + "?size=64x64"} alt="Avatar"/>
                </div>
                <div className="infos">
                    <div className="name">
                        <span>{elem.fullname}</span>
                        {(displayActions && !elem.isGerance) && <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} text="Modifier" />
                        </div>}
                    </div>
                    {elem.agency && <div className="sub-icon">{elem.agency.name}</div>}
                    {elem.code && <div className="badge badge-default">#{elem.code}</div>}
                    {elem.isArchived && <div className="badge badge-warning">Archivé</div>}
                    {elem.lastContactAtAgo && <div className="sub">
                        Dernier contact : {elem.lastContactAtAgo}
                    </div>}
                </div>
            </div>
            <div className="col-2">
                <div className="item">
                    <SubIcon value={elem.email} icon="email" />
                    <SubIcon value={elem.phone} icon="phone" />
                    <SubIcon value={elem.phone1} icon="phone" />
                    <SubIcon value={elem.phone2} icon="phone" />
                    <SubIcon value={elem.phone3} icon="phone" />
                    <SubIcon value={elem.fullAddress} icon="placeholder" />
                </div>

                <div className="item">
                    <div className="badges">
                        {elem.isGerance && <>
                            <div className="badge badge-default">Gérance</div>
                            <div className="badge badge-default">{elem.codeGerance}</div>
                            {totalBiens !== null && <div className="badge">{totalBiens} bien{totalBiens > 1 ? "s" : ""}</div>}
                        </>}
                        {elem.status && <div className={"badge badge-" + elem.status}>{elem.statusString}</div>}
                        {elem.type && <div className="badge badge-default">Type de prospect : {elem.typeString}</div>}
                    </div>
                    <NegotiatorBubble elem={elem.negotiator} txt={null}/>
                </div>

            </div>
        </div>
    </div>
}

function SubIcon ({ value, icon }) {
    return value ? <div className="sub-icon">
            <span className={"icon-" + icon} />
            <span>{value}</span>
        </div> : null
}