import React, { Component } from 'react';

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Back }               from "@dashboardComponents/Layout/Elements";

import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";
import { SearchRead }       from "@dashboardPages/components/Immo/Searchs/SearchRead";

export class ProspectRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="item-read-2-container">
                    <div className="item-read-2">
                        <div className="col-1">
                            <div className="image">
                                <img src={"https://robohash.org/" + elem.id + "?size=64x64"} alt="Avatar"/>
                            </div>
                            <div className="infos">
                                <div className="name">
                                    <span>{elem.fullname}</span>
                                    <div className="actions">
                                        <ButtonIcon icon="search" onClick={() => onChangeContext('update', elem)} text="Recherches" />
                                        <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} text="Modifier" />
                                    </div>
                                </div>
                                {elem.isArchived && <div className="badge badge-warning">Archivé</div>}
                                {elem.lastContactAtAgo && <div className="sub">
                                    Dernier contact : {elem.lastContactAtAgo}
                                </div>}
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="item">
                                {elem.email && <div className="sub-icon">
                                    <span className="icon-email" />
                                    <span>{elem.email}</span>
                                </div>}
                                {elem.phone1 && <div className="sub-icon">
                                    <span className="icon-phone" />
                                    <span>{elem.phone1}</span>
                                </div>}

                                {elem.phone2 && <div className="sub-icon">
                                    <span className="icon-phone" />
                                    <span>{elem.phone2}</span>
                                </div>}

                                {elem.phone3 && <div className="sub-icon">
                                    <span className="icon-phone" />
                                    <span>{elem.phone3}</span>
                                </div>}

                                {elem.fullAddress && <div className="sub-icon">
                                    <span className="icon-placeholder" />
                                    <span>{elem.fullAddress}</span>
                                </div>}
                            </div>

                            <div className="item">
                                <div className="badges">
                                    <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                                    <div className="badge badge-default">Type de prospect : {elem.typeString}</div>
                                </div>
                                <NegotiatorBubble elem={elem.negotiator} txt={null}/>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="item-content-2">
                    {elem.search ? <SearchRead elem={elem.search} follows={[]} prospectId={elem.id}
                                               onUpdateFollows={null} onChangeContext={onChangeContext} />
                        : <Button icon="add-square" onClick={() => onChangeContext('customOne', elem)}>Ajouter une recherche</Button>}
                </div>
            </div>
        </>
    }
}