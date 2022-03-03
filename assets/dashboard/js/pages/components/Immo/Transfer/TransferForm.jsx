import React, { Component } from 'react';

import axios         from "axios";
import toastr        from "toastr";
import Swal          from "sweetalert2";
import SwalOptions   from "@commonComponents/functions/swalOptions";
import Routing       from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_immo_transfer_start";
const TXT_CREATE_BUTTON_FORM = "Transférer";

export function TransferFormulaire ({ donnees, negotiators, users })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Le transfert s'est bien déroulé !"

    let form = <Form
        context={"create"}
        url={url}
        agencies={JSON.parse(donnees)}
        negotiators={JSON.parse(negotiators)}
        users={JSON.parse(users)}
        messageSuccess={msg}
    />

    return <div className="form">
        <h2>Transfert des biens d'une agence vers une autre</h2>
        {form}
    </div>

}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            from: "",
            to: "",
            negotiator: "",
            user: "",
            errors: [],
            success: false,
            critere: ""
        }

        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { critere, from, to, negotiator, user } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ errors: [], success: false });

            let paramsToValidate = [
                {type: "text",       id: 'from', value: from},
                {type: "text",       id: 'to',   value: to},
                {type: "text",       id: 'negotiator',   value: negotiator},
                {type: "text",       id: 'user',   value: user},
            ];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                let self = this;
                Swal.fire(SwalOptions.options("Confirmer le transfer", ""))
                    .then((result) => {
                        if (result.isConfirmed) {

                            Formulaire.loader(true);
                            axios({ method: "POST", url: url, data: this.state })
                                .then(function (response) {
                                    Helper.toTop();

                                    self.setState({ success: messageSuccess, errors: [] });
                                    toastr.info(messageSuccess);
                                })
                                .catch(function (error) {
                                    Formulaire.displayErrors(self, error);
                                })
                                .then(() => {
                                    Formulaire.loader(false);
                                })
                            ;
                        }
                    })
                ;
            }
        }
    }

    render () {
        const { agencies, negotiators, users } = this.props;
        const { critere, errors, success, from, to, negotiator, user } = this.state;

        let selectAgencies = [], selectNegotiators = [], selectUsers = [];
        agencies.forEach(agency => {
            selectAgencies.push({ value: agency.id, label: agency.name, id: "ag-" + agency.id })
        })

        negotiators.forEach(ne => {
            selectNegotiators.push({ value: ne.id, label: ne.fullname, id: "ne-" + ne.id })
        })

        users.forEach(user => {
            selectUsers.push({ value: user.id, label: user.fullname, id: "us-" + user.id })
        })


        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">De</div>
                        </div>

                        <div className="line">
                            <SelectReactSelectize items={selectAgencies} identifiant="from" valeur={from} errors={errors}
                                                  onChange={(e) => this.handleChangeSelect('from', e)}>
                                Depuis l'agence
                            </SelectReactSelectize>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Vers</div>
                        </div>

                        <div className="line">
                            <SelectReactSelectize items={selectAgencies} identifiant="to" valeur={to} errors={errors}
                                                  onChange={(e) => this.handleChangeSelect('to', e)}>
                                Vers l'agence
                            </SelectReactSelectize>
                        </div>

                        {to && <>
                            <div className="line">
                                <SelectReactSelectize items={selectNegotiators} identifiant="negotiator" valeur={negotiator} errors={errors}
                                                      onChange={(e) => this.handleChangeSelect('negotiator', e)}>
                                    Négociateurs
                                </SelectReactSelectize>
                            </div>
                            <div className="line">
                                <SelectReactSelectize items={selectUsers} identifiant="user" valeur={user} errors={errors}
                                                      onChange={(e) => this.handleChangeSelect('user', e)}>
                                    Utilisateurs
                                </SelectReactSelectize>
                            </div>
                        </>}
                    </div>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line line-buttons">
                    <div className="form-button">
                        <Button isSubmit={true}>{TXT_CREATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}
