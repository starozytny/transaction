import React, { Component } from "react";

import { Users }        from "@userPages/components/Profil/User/Users";
import { Agencies }     from "@userPages/components/Profil/Agency/Agencies";
import { Negotiators } from "@dashboardPages/components/Immo/Negociators/Negotiators";

export class UserContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "users",
            id: parseInt(props.id),
            idAgency: parseInt(props.agencyId),
            idSociety: parseInt(props.societyId),
            isUser: props.isUser === "true",
            users: props.users,
            agencies: props.agencies,
            negotiators: props.negotiators,
            biens: props.biens,
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => {
        this.setState({ context })
    }

    render () {
        const { role } = this.props;
        const { context, id, idAgency, idSociety, isUser, users, agencies, negotiators, biens } = this.state;

        let content;
        switch (context){
            case "negotiators":
                content = <div id="profil-negotiators"><Negotiators donnees={negotiators} biens={biens} idAgency={idAgency} isUser={isUser}
                                                                    isClient={true} classes=" "/></div>
                break;
            case "agencies":
                content = <div id="profil-agencies"><Agencies role={role} donnees={agencies} idSociety={idSociety} idAgency={idAgency} isUser={isUser}/></div>
                break;
            default:
                content = <div id="profil-users"><Users donnees={users} id={id} isUser={isUser} /></div>
                break;
        }

        let tabs = [
            { value: 'users', label: "Utilisateurs" },
            { value: 'negotiators', label: "Négociateurs" },
            { value: 'agencies', label: "Agence" },
        ];

        return <div className="page-default">
            <div>
                <div className="title-col-2">
                    <div className="tab-col-2">
                        {tabs.map(el => {
                            return <div className={"item" + (el.value === context ? " active" : "")} key={el.value}
                                        onClick={() => this.handleChangeContext(el.value)}>
                                {el.label}
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div>
                {content}
            </div>
        </div>
    }
}