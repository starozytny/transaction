import React, { Component } from "react";

import { Users } from "@userPages/components/Profil/User/Users";

export class UserContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "users",
            users: props.users,
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => {
        this.setState({ context })
    }

    render () {
        const { id, isUser } = this.props;
        const { context, users } = this.state;

        let content;
        switch (context){
            case "negotiators":
                content = <div>Hello négociateurs</div>
                break;
            case "agency":
                content = <div>Hello Agency</div>
                break;
            default:
                content = <div id="profil-users"><Users donnees={users} id={id} isUser={isUser} /></div>
                break;
        }

        let tabs = [
            { value: 'users', label: "Utilisateurs" },
            { value: 'negotiators', label: "Négociateurs" },
            { value: 'agency', label: "Agence" },
        ]

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