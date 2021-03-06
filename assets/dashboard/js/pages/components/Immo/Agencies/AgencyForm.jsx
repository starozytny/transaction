import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {Input, SelectReactSelectize} from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { Drop }                from "@dashboardComponents/Tools/Drop";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_agencies_create";
const URL_UPDATE_GROUP       = "api_agencies_update";
const TXT_CREATE_BUTTON_FORM = "Ajouter l'agence";
const TXT_UPDATE_BUTTON_FORM = "Modifier l'agence";

export function AgencyFormulaire ({ type, onChangeContext, onUpdateList, element, societies, societyId="", isProfil=false, dirname })
{
    let title = "Ajouter une agence";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté une nouvelle agence !"

    if(type === "update" || type === "profil"){
        title = "Modifier " + element.name;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <AgencyForm
        context={type}
        url={url}
        society={element ? element.society.id : societyId}
        name={element ? element.name : ""}
        dirname={element ? element.dirname : ""}
        website={element ? element.website : ""}
        email={element ? element.email : ""}
        emailLocation={element ? element.emailLocation : ""}
        emailVente={element ? element.emailVente : ""}
        phone={element ? element.phone : ""}
        phoneLocation={element ? element.phoneLocation : ""}
        phoneVente={element ? element.phoneVente : ""}
        address={element ? element.address : ""}
        zipcode={element ? element.zipcode : ""}
        city={element ? element.city : ""}
        lat={element ? element.lat : ""}
        lon={element ? element.lon : ""}
        description={element ? element.description : ""}
        logo={element ? element.logoFile : ""}
        tarif={element ? element.tarif : ""}
        type={element ? element.type : ""}
        siret={element ? element.siret : ""}
        rcs={element ? element.rcs : ""}
        cartePro={element ? element.cartePro : ""}
        garantie={element ? element.garantie : ""}
        affiliation={element ? element.affiliation : ""}
        mediation={element ? element.mediation : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        societies={societies}
        isProfil={isProfil}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class AgencyForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            society: props.society,
            name: props.name,
            dirname: props.dirname,
            website: props.website,
            email: props.email,
            emailLocation: props.emailLocation,
            emailVente: props.emailVente,
            phone: props.phone,
            phoneLocation: props.phoneLocation,
            phoneVente: props.phoneVente,
            address: props.address,
            zipcode: props.zipcode,
            city: props.city,
            lat: props.lat,
            lon: props.lon,
            description: { value: props.description ? props.description : "", html: props.description ? props.description : "" },
            logo: props.logo,
            tarif: props.tarif,
            type: props.type,
            siret: props.siret,
            rcs: props.rcs,
            cartePro: props.cartePro,
            garantie: props.garantie,
            affiliation: props.affiliation,
            mediation: props.mediation,
            errors: [],
            success: false,
            critere: ""
        }

        this.inputLogo = React.createRef();
        this.inputTarif = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        document.getElementById("name").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere, name, dirname, website, email, emailLocation, emailVente,
            phone, phoneLocation, phoneVente, address, zipcode, city, lat, lon,
            description, society
        } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ success: false});

            let paramsToValidate = [
                {type: "text", id: 'society',           value: society},
                {type: "text", id: 'name',              value: name},
                {type: "text", id: 'dirname',           value: dirname},
                {type: "text", id: 'website',           value: website},
                {type: "text", id: 'email',             value: email},
                {type: "text", id: 'emailLocation',     value: emailLocation},
                {type: "text", id: 'emailVente',        value: emailVente},
                {type: "text", id: 'phone',             value: phone},
                {type: "text", id: 'phoneLocation',     value: phoneLocation},
                {type: "text", id: 'phoneVente',        value: phoneVente},
                {type: "text", id: 'address',           value: address},
                {type: "text", id: 'zipcode',           value: zipcode},
                {type: "text", id: 'city',              value: city},
                {type: "text", id: 'lat',               value: lat},
                {type: "text", id: 'lon',               value: lon},
                {type: "text", id: 'description',       value: description.html},
            ];

            let dropLogo = this.inputLogo.current.drop.current.files;
            let dropTarif = this.inputTarif.current.drop.current.files;

            if(context === "create"){
                paramsToValidate = [...paramsToValidate, ...[{type: "array", id: 'logo', value: dropLogo}]];
                paramsToValidate = [...paramsToValidate, ...[{type: "array", id: 'tarif', value: dropTarif}]];
            }

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                let formData = new FormData();
                if(dropLogo[0]){
                    formData.append('logo', dropLogo[0].file);
                }
                if(dropTarif[0]){
                    formData.append('tarif', dropTarif[0].file);
                }

                formData.append("data", JSON.stringify(this.state));

                axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                    .then(function (response) {
                        let data = response.data;
                        Helper.toTop();
                        if(self.props.onUpdateList){
                            self.props.onUpdateList(data);
                        }
                        self.setState({ success: messageSuccess, errors: [] });
                        if(context === "create"){
                            toastr.info(messageSuccess);
                            self.setState( {
                                society: "",
                                name: "",
                                dirname: "",
                                website: "",
                                email: "",
                                emailLocation: "",
                                emailVente: "",
                                phone: "",
                                phoneLocation: "",
                                phoneVente: "",
                                address: "",
                                zipcode: "",
                                city: "",
                                lat: "",
                                lon: "",
                                description: { value: "", html: "" },
                                logo: "",
                                tarif: "",
                                type: "",
                                siret: "",
                                rcs: "",
                                cartePro: "",
                                garantie: "",
                                affiliation: "",
                                mediation: "",
                            })
                        }
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
        const { isProfil, context, societies } = this.props;
        const { critere, errors, success, name, dirname, website, email, emailLocation, emailVente,
                phone, phoneLocation, phoneVente, address, zipcode, city, lat, lon, description, logo, tarif, society,
                type, siret, rcs, cartePro, garantie, affiliation, mediation } = this.state;

        let selectSociety = [];
        if(!isProfil){
            societies.forEach(elem => {
                selectSociety.push({ value: elem.id, label: "#" + elem.codeString + " - " + elem.name, identifiant: elem.name.toLowerCase() })
            });
        }

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                {!isProfil && <div className="line">
                    <SelectReactSelectize items={selectSociety} identifiant="society" valeur={society}
                                          placeholder={"Sélectionner la société"}
                                          errors={errors} onChange={(e) => this.handleChangeSelect("society", e)}
                    >
                        Société
                    </SelectReactSelectize>
                </div>}

                <div className="line line-3">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange}>Nom / raison sociale</Input>
                    {!isProfil ? <Input valeur={dirname} identifiant="dirname" errors={errors} onChange={this.handleChange}>Nom du ZIP</Input> : <div className="form-group" />}
                    <Input valeur={website} identifiant="website" errors={errors} onChange={this.handleChange}>Site internet</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail</Input>
                    <Input valeur={emailLocation} identifiant="emailLocation" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail location</Input>
                    <Input valeur={emailVente} identifiant="emailVente" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail vente</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={phone} identifiant="phone" errors={errors} onChange={this.handleChange}>Téléphone</Input>
                    <Input valeur={phoneLocation} identifiant="phoneLocation" errors={errors} onChange={this.handleChange}>Téléphone location</Input>
                    <Input valeur={phoneVente} identifiant="phoneVente" errors={errors} onChange={this.handleChange}>Téléphone vente</Input>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={address} identifiant="address" errors={errors} onChange={this.handleChange}>Adresse</Input>
                    <Input valeur={zipcode} identifiant="zipcode" errors={errors} onChange={this.handleChange}>Code postal</Input>
                    <Input valeur={city} identifiant="city" errors={errors} onChange={this.handleChange}>Ville</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={lat} identifiant="lat" errors={errors} onChange={this.handleChange} type="number">Latitude</Input>
                    <Input valeur={lon} identifiant="lon" errors={errors} onChange={this.handleChange} type="number">Longitude</Input>
                    <div className="form-group" />
                </div>

                <div className="line line-2">
                    <Drop ref={this.inputLogo} identifiant="logo" previewFile={logo} errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser un logo" labelError="Seules les images sont acceptées.">Logo</Drop>
                    <Drop ref={this.inputTarif} identifiant="tarif" previewFile={tarif} folder="immo/tarifs" errors={errors} accept={"application/pdf"} maxFiles={1}
                          label="Téléverser un PDF Tarif" labelError="Seules les PDFs sont acceptées.">Tarif</Drop>
                </div>

                <div className="line line">
                    <Trumb identifiant="description" valeur={description.value} errors={errors} onChange={this.handleChangeTrumb}>Description</Trumb>
                </div>

                <div className="line line-3">
                    <Input valeur={type} identifiant="type" errors={errors} onChange={this.handleChange}>Type d'entreprise</Input>
                    <Input valeur={siret} identifiant="siret" errors={errors} onChange={this.handleChange}>SIRET</Input>
                    <Input valeur={rcs} identifiant="rcs" errors={errors} onChange={this.handleChange}>Numéro RCS</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={cartePro} identifiant="cartePro" errors={errors} onChange={this.handleChange}>Carte professionnelle</Input>
                    <Input valeur={garantie} identifiant="garantie" errors={errors} onChange={this.handleChange}>Garantie financière</Input>
                    <Input valeur={affiliation} identifiant="affiliation" errors={errors} onChange={this.handleChange}>Affiliation</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={mediation} identifiant="mediation" errors={errors} onChange={this.handleChange}>Médiation</Input>
                    <div className="form-group" />
                    <div className="form-group" />
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}