import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_UPDATE_GROUP       = "api_immo_supports_update";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function SupportFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Modifier " + element.name;
    let url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    let msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";

    let form = <SupportForm
        context={type}
        url={url}

        code={Formulaire.setValueEmptyIfNull(element.code)}
        name={Formulaire.setValueEmptyIfNull(element.name)}
        filename={Formulaire.setValueEmptyIfNull(element.filename)}
        ftpServer={Formulaire.setValueEmptyIfNull(element.ftpServer)}
        ftpPort={Formulaire.setValueEmptyIfNull(element.ftpPort)}
        ftpUser={Formulaire.setValueEmptyIfNull(element.ftpUser)}
        ftpPassword={Formulaire.setValueEmptyIfNull(element.ftpPassword)}
        maxPhotos={Formulaire.setValueEmptyIfNull(element.maxPhotos)}

        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>

}

export class SupportForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: props.code,
            name: props.name,
            filename: props.filename,
            ftpServer: props.ftpServer,
            ftpPort: props.ftpPort,
            ftpUser: props.ftpUser,
            ftpPassword: props.ftpPassword,
            maxPhotos: props.maxPhotos,
            errors: [],
            success: false,
            critere: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        document.getElementById("filename").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { critere, filename } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ errors: [], success: false });

            let paramsToValidate = [
                {type: "text", id: 'filename', value: filename},
            ];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                axios({ method: "PUT", url: url, data: this.state })
                    .then(function (response) {
                        let data = response.data;
                        Helper.toTop();

                        if(self.props.onUpdateList){
                            self.props.onUpdateList(data);
                        }

                        self.setState({ success: messageSuccess, errors: [] });
                    })
                    .catch(function (error) {
                        Formulaire.displayErrors(self, error);
                    })
                    .then(() => {
                        Formulaire.loader(false);
                    })
                ;
            }
        }
    }

    render () {
        const { critere, errors, success, filename, ftpServer, ftpPort, ftpUser, ftpPassword } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Informations générales</div>
                        </div>

                        <div className="line">
                            <Input valeur={filename} identifiant="filename" errors={errors} onChange={this.handleChange}>
                                Nom du fichier
                            </Input>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Serveur FTP</div>
                        </div>

                        <div className="line line-2">
                            <Input valeur={ftpServer} identifiant="ftpServer" errors={errors} onChange={this.handleChange}>
                                Nom du serveur
                            </Input>
                            <Input valeur={ftpPort} identifiant="ftpPort" errors={errors} onChange={this.handleChange}>
                                Port
                            </Input>
                        </div>

                        <div className="line line-2">
                            <Input valeur={ftpUser} identifiant="ftpUser" errors={errors} onChange={this.handleChange}>
                                Identifiant
                            </Input>
                            <Input valeur={ftpPassword} identifiant="ftpPassword" errors={errors} onChange={this.handleChange}>
                                Mot de passe
                            </Input>
                        </div>
                    </div>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line line-buttons">
                    <div className="form-button">
                        <Button isSubmit={true}>{TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}