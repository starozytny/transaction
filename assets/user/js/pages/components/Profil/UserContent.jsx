import React, { Component } from "react";

import { Users } from "@userPages/components/Profil/User/Users";

export class UserContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "users",
            users: props.users,
        }
    }

    render () {
        const { id, isUser } = this.props;
        const { context, users } = this.state;

        let content;
        switch (context){
            default:
                content = <div id="profil-users"><Users donnees={users} id={id} isUser={isUser} /></div>
                break;
        }

        return <div className="page-default">
            <div>
                <div className="title-col-2">
                    <div className="tab-col-2">
                        <div className="item active">Utilisateurs</div>
                        <div className="item">Négociateurs</div>
                        <div className="item">Agence</div>
                    </div>
                </div>
            </div>
            <div>
                {content}
            </div>
        </div>
    }
}