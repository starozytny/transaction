import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox }     from "@dashboardComponents/Tools/Fields";
import { Button, ButtonIcon }  from "@dashboardComponents/Tools/Button";
import { HelpBubble }          from "@dashboardComponents/Tools/HelpBubble";

import Validateur              from "@commonComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_biens_create";
const URL_UPDATE_GROUP       = "api_biens_update";

export function BienFormulaire ({ type, element })
{
    let title = "Ajouter un bien";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouveau bien !"

    if(type === "update"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        title={title}
        context={type}
        url={url}
        codeTypeAd={element ? element.codeTypeAd : ""}
        codeTypeBien={element ? element.codeTypeBien : ""}
        libelle={element ? element.libelle : ""}
        mandat={element ? element.mandat : ""}
        messageSuccess={msg}
    />

    return <div className="main-content">
        {form}
    </div>
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codeTypeAd: props.codeTypeAd,
            codeTypeBien: props.codeTypeBien,
            libelle: props.libelle,
            mandat: props.mandat,
            contentHelpBubble: "",
            errors: [],
            step: 1
        }

        this.helpBubble = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenHelp = this.handleOpenHelp.bind(this);
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        this.setState({[name]: value})
    }

    handleNext = (stepClicked, stepInitial = null) => {
        const { codeTypeAd, codeTypeBien, libelle, mandat } = this.state;

        let paramsToValidate = [];
        switch (stepClicked){
            case 2:
                paramsToValidate = [
                    {type: "text",      id: 'codeTypeAd',    value: codeTypeAd},
                    {type: "text",      id: 'codeTypeBien',  value: codeTypeBien},
                    {type: "text",      id: 'libelle',       value: libelle},
                    {type: "text",      id: 'mandat',        value: mandat},
                    {type: "length",    id: 'libelle',       value: libelle, min: 0, max: 64},
                ];
                break;
            default:
                break;
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors });
        }else{
            this.setState({ step: stepInitial ? stepInitial : stepClicked })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;

        let self = this;
        Formulaire.loader(true);

        let formData = new FormData();
        formData.append("data", JSON.stringify(this.state));

        axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
            .then(function (response) {
                let data = response.data;
                toastr.info(messageSuccess);
                //message success + redirect to index
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
            .then(() => {
                Formulaire.loader(false);
            })
        ;
    }

    handleOpenHelp = (type) => {
        let content = "";
        switch (type) {
            default:
                content = "Un titre comme \"Appartement T1 centre ville 20m²\" est parfait pour le référencement\n" +
                          "et donc obtenir une meilleure visibilité de votre annonce sur les moteurs de recherches et plateformes.";
                break;
        }

        this.setState({ contentHelpBubble: content })
        this.helpBubble.current.handleOpen();
    }

    render () {
        const { step, errors, contentHelpBubble, codeTypeAd, codeTypeBien, libelle, mandat } = this.state;

        let steps = [
            {id: 1, label: "Informations globales"},
            {id: 2, label: "Details du bien"},
            {id: 3, label: "Localisation"},
            {id: 4, label: "Financier"},
            {id: 5, label: "Photos"},
            {id: 6, label: "Propriétaire"},
            {id: 7, label: "Publication"},
        ];

        let stepTitle = "Etape 1 : Informations globales";
        let stepsItems = [];
        {steps.forEach(el => {
            let active = "";
            if(el.id === step){
                active = " active";
                stepTitle = "Etape " + el.id + " : " + el.label;
            }
            stepsItems.push(<div className={"item" + active} key={el.id} onClick={() => this.handleNext(el.id, step)}>
                <span className="number">{el.id}</span>
                <span className="label">{el.label}</span>
            </div>)
        })}

        let typeAdItems = [
            { value: 0, label: 'Vente',                         identifiant: 'vente' },
            { value: 1, label: 'Location',                      identifiant: 'location' },
            { value: 2, label: 'Viager',                        identifiant: 'viager' },
            { value: 3, label: 'Cession de bail',               identifiant: 'cession-de-bail' },
            { value: 4, label: 'Produit d\'investissement',     identifiant: 'produit-investissement' },
            { value: 5, label: 'Location vacances',             identifiant: 'location-vacances' },
            { value: 6, label: 'Vente de prestige',             identifiant: 'vente-de-prestige' },
            { value: 7, label: 'Fond de commerce',              identifiant: 'fond-de-commerce' },
        ];

        let typeBienItems = [
            { value: 0, label: 'Appartement',       identifiant: 'appartement' },
            { value: 1, label: 'Maison',            identifiant: 'maison' },
            { value: 2, label: 'Parking/Box',       identifiant: 'parking-box' },
            { value: 3, label: 'Terrain',           identifiant: 'terrain' },
            { value: 4, label: 'Boutique',          identifiant: 'boutique' },
            { value: 5, label: 'Bureau',            identifiant: 'bureau' },
            { value: 6, label: 'Château',           identifiant: 'chateau' },
            { value: 7, label: 'Immeuble',          identifiant: 'immeuble' },
            { value: 8, label: 'Terrain + Maison',  identifiant: 'terrain-maison' },
            { value: 9, label: 'Divers',            identifiant: 'divers' },
        ];

        let typeMandatItems = [
            { value: 0, label: 'Simple',            identifiant: 'simple' },
            { value: 1, label: 'Exclusif',          identifiant: 'exclusif' },
            { value: 2, label: 'Semi-exclusif',     identifiant: 'semi-exclusif' },
        ];

        return <div className="page-default">
            <div className="page-col-1">
                <div className="comeback">
                    <Button type="reverse" element="a" onClick={Routing.generate('user_biens')}>Retour à la liste</Button>
                </div>
                <div className="body-col-1">
                    <div className="title-col-1">
                        <span>Etapes :</span>
                    </div>
                    <div className="content-col-1 steps">
                        {stepsItems}
                    </div>
                </div>
            </div>
            <div className="page-col-2">
                <div className="title-col-2">
                    <div className="tab-col-2">
                        <div className="item active">{stepTitle}</div>
                    </div>
                    <Button type="warning">Enregistrer le brouillon</Button>
                </div>
                <section>
                    <form className="form-bien" onSubmit={this.handleSubmit}>
                        <div className={"step-section" + (step === 1 ? " active" : "")}>
                            <div className="line special-line">
                                <Radiobox items={typeAdItems} identifiant="codeTypeAd" valeur={codeTypeAd} errors={errors} onChange={this.handleChange}>
                                    Type d'annonce
                                </Radiobox>
                            </div>

                            <div className="line special-line">
                                <Radiobox items={typeBienItems} identifiant="codeTypeBien" valeur={codeTypeBien} errors={errors} onChange={this.handleChange}>
                                    Type de bien
                                </Radiobox>
                            </div>

                            <div className="line special-line">
                                <Input identifiant="libelle" valeur={libelle} errors={errors} onChange={this.handleChange}
                                       placeholder="Exemple : Appartement T1 Centre ville (max 64 caractères)"
                                >
                                    <span>Libellé de l'annonce</span>
                                    <div className="input-label-help">
                                        <ButtonIcon icon="question-1" onClick={() => this.handleOpenHelp("libelle")}>Aide</ButtonIcon>
                                    </div>
                                </Input>
                            </div>

                            <div className="line special-line">
                                <Radiobox items={typeMandatItems} identifiant="mandat" valeur={mandat} errors={errors} onChange={this.handleChange}>
                                    Type de mandat
                                </Radiobox>
                            </div>

                            <div className="line line-buttons">
                                {/*<Button type="reverse">Etape précédente</Button>*/}
                                <div/>
                                <div className="btns-submit">
                                    <Button type="warning">Enregistrer le brouillon</Button>
                                    <Button onClick={() => this.handleNext( 2)}>Etape suivante</Button>
                                </div>
                            </div>

                            <div className="line">
                                <Button isSubmit={true}>Enregistrer le bien</Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Aide</HelpBubble>
        </div>
    }
}