import React from "react";

import { ButtonIcon }       from "@dashboardComponents/Tools/Button";
import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";

export function ReadCard ({ displayActions = true, elem, avatar, onChangeContext })
{
    return <div className="item-read-2-container">
        <div className="item-read-2">
            <div className="col-1">
                <div className="image">
                    <img src={avatar ? avatar : "https://robohash.org/" + elem.id + "?size=64x64"} alt="Avatar"/>
                </div>
                <div className="infos">
                    <div className="name">
                        <span>{elem.fullname}</span>
                        {displayActions && <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} text="Modifier" />
                        </div>}
                    </div>
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