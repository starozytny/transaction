import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import helper                  from "@userPages/components/Biens/helper";

const URL_CREATE_ELEMENT     = "api_searchs_create";
const URL_UPDATE_GROUP       = "api_searchs_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

let arrayZipcodeSave = [];

export function SearchFormulaire ({ type, onChangeContext, onUpdateList, element, prospectId })
{
    let title = "Ajouter une recherche";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté une nouvelle recherche !"

    if(type === "update"){
        title = "Modifier la recherche";
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <SearchForm
        context={type}
        url={url}
        codeTypeAd={element ? Formulaire.setValueEmptyIfNull(element.codeTypeAd, 0) : 0}
        codeTypeBien={element ? Formulaire.setValueEmptyIfNull(element.codeTypeBien, 0) : 0}
        minPrice={element ? Formulaire.setValueEmptyIfNull(element.minPrice, 0) : 0}
        maxPrice={element ? Formulaire.setValueEmptyIfNull(element.maxPrice, 0) : 0}
        minPiece={element ? Formulaire.setValueEmptyIfNull(element.minPiece, 0) : 0}
        maxPiece={element ? Formulaire.setValueEmptyIfNull(element.maxPiece, 0) : 0}
        minRoom={element ? Formulaire.setValueEmptyIfNull(element.minRoom, 0) : 0}
        maxRoom={element ? Formulaire.setValueEmptyIfNull(element.maxRoom, 0) : 0}
        minArea={element ? Formulaire.setValueEmptyIfNull(element.minArea, 0) : 0}
        maxArea={element ? Formulaire.setValueEmptyIfNull(element.maxArea, 0) : 0}
        minLand={element ? Formulaire.setValueEmptyIfNull(element.minLand, 0) : 0}
        maxLand={element ? Formulaire.setValueEmptyIfNull(element.maxLand, 0) : 0}
        zipcode={element ? Formulaire.setValueEmptyIfNull(element.zipcode) : ""}
        city={element ? Formulaire.setValueEmptyIfNull(element.city) : ""}
        hasLift={element ? Formulaire.setValueEmptyIfNull(element.hasLift, 99) : 99}
        hasTerrace={element ? Formulaire.setValueEmptyIfNull(element.hasTerrace, 99) : 99}
        hasBalcony={element ? Formulaire.setValueEmptyIfNull(element.hasBalcony, 99) : 99}
        hasParking={element ? Formulaire.setValueEmptyIfNull(element.hasParking, 99) : 99}
        hasBox={element ? Formulaire.setValueEmptyIfNull(element.hasBox, 99) : 99}

        prospectId={prospectId}

        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>

}

export class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codeTypeAd: props.codeTypeAd,
            codeTypeBien: props.codeTypeBien,
            minPrice: props.minPrice,
            maxPrice: props.maxPrice,
            minPiece: props.minPiece,
            maxPiece: props.maxPiece,
            minRoom: props.minRoom,
            maxRoom: props.maxRoom,
            minArea: props.minArea,
            maxArea: props.maxArea,
            minLand: props.minLand,
            maxLand: props.maxLand,
            zipcode: props.zipcode,
            city: props.city,
            hasLift: props.hasLift,
            hasTerrace: props.hasTerrace,
            hasBalcony: props.hasBalcony,
            hasParking: props.hasParking,
            hasBox: props.hasBox,

            prospectId: props.prospectId,

            errors: [],
            success: false,
            critere: "",
            arrayPostalCode: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeZipcode = this.handleChangeZipcode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        Helper.getPostalCodes(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : ""}) }

    handleChangeZipcode = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode ? arrayPostalCode : arrayZipcodeSave)
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { critere } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            this.setState({ success: false});

            let paramsToValidate = [];

            // validate global
            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code){
                Formulaire.showErrors(this, validate);
            }else{
                Formulaire.loader(true);
                let self = this;

                let method = context === "create" ? "POST" : "PUT";

                arrayZipcodeSave = this.state.arrayPostalCode;
                delete this.state.arrayPostalCode;

                axios({ method: method, url: url, data: this.state })
                    .then(function (response) {
                        let data = response.data;
                        Helper.toTop();

                        if(self.props.onUpdateList){
                            self.props.onUpdateList(data, "update");
                            self.props.onChangeContext('list')
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
        const { context } = this.props;
        const { critere, errors, success, codeTypeAd, codeTypeBien, minPrice, maxPrice, minPiece, maxPiece,
            minRoom, maxRoom, minArea, maxArea, minLand, maxLand, zipcode, city,
            hasLift, hasTerrace, hasBalcony, hasParking, hasBox,  } = this.state;

        let typeAdItems = helper.getItems("ads");
        let typeBienItems = helper.getItems("biens");

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <Radiobox items={typeAdItems} identifiant="codeTypeAd" valeur={codeTypeAd} errors={errors} onChange={this.handleChange}>
                        Type d'annonce *
                    </Radiobox>

                    <Radiobox items={typeBienItems} identifiant="codeTypeBien" valeur={codeTypeBien} errors={errors} onChange={this.handleChange}>
                        Type de bien *
                    </Radiobox>
                </div>

                <div className="line line-2">
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Informations générales</div>
                        </div>

                        <div className="line line-2">
                            <Input type="number" min={0} step="any" identifiant="minPrice" valeur={minPrice} errors={errors} onChange={this.handleChange}>
                                <span>Min prix (€)</span>
                            </Input>
                            <Input type="number" min={0} step="any" identifiant="maxPrice" valeur={maxPrice} errors={errors} onChange={this.handleChange}>
                                <span>Max prix (€)</span>
                            </Input>
                        </div>

                        <div className="line line-2">
                            <Input type="number" min={0} identifiant="minPiece" valeur={minPiece} errors={errors} onChange={this.handleChange}>
                                <span>Min pièce</span>
                            </Input>
                            <Input type="number" min={0} identifiant="maxPiece" valeur={maxPiece} errors={errors} onChange={this.handleChange}>
                                <span>Max pièce</span>
                            </Input>
                        </div>

                        <div className="line line-2">
                            <Input type="number" min={0} identifiant="minRoom" valeur={minRoom} errors={errors} onChange={this.handleChange}>
                                <span>Min chambre</span>
                            </Input>
                            <Input type="number" min={0} identifiant="maxRoom" valeur={maxRoom} errors={errors} onChange={this.handleChange}>
                                <span>Max chambre</span>
                            </Input>
                        </div>

                        <div className="line line-2">
                            <Input type="number" min={0} step="any" identifiant="minArea" valeur={minArea} errors={errors} onChange={this.handleChange}>
                                <span>Min surface (m²)</span>
                            </Input>
                            <Input type="number" min={0} step="any" identifiant="maxArea" valeur={maxArea} errors={errors} onChange={this.handleChange}>
                                <span>Max surface (m²)</span>
                            </Input>
                        </div>

                        <div className="line line-2">
                            <Input type="number" min={0} step="any" identifiant="minLand" valeur={minLand} errors={errors} onChange={this.handleChange}>
                                <span>Min terrain (m²)</span>
                            </Input>
                            <Input type="number" min={0} step="any" identifiant="maxLand" valeur={maxLand} errors={errors} onChange={this.handleChange}>
                                <span>Max terrain (m²)</span>
                            </Input>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="line-separator">
                            <div className="title">Localisation</div>
                        </div>

                        <div className="line line-2">
                            <Input identifiant="zipcode" valeur={zipcode} errors={errors} onChange={this.handleChangeZipcode}>
                                <span>Code postal</span>
                            </Input>
                            <Input identifiant="city" valeur={city} errors={errors} onChange={this.handleChange}>
                                <span>Ville</span>
                            </Input>
                        </div>

                        <div className="line-separator">
                            <div className="title">Avantages</div>
                        </div>

                        <div className="line line-2">
                            <Radiobox items={helper.getItems("answers-search", 0)} identifiant="hasLift" valeur={hasLift} errors={errors} onChange={this.handleChange}>
                                Ascenseur
                            </Radiobox>
                            <div className="form-group" />
                        </div>

                        <div className="line line-2">
                            <Radiobox items={helper.getItems("answers-search", 1)} identifiant="hasTerrace" valeur={hasTerrace} errors={errors} onChange={this.handleChange}>
                                Terrasse
                            </Radiobox>
                            <Radiobox items={helper.getItems("answers-search", 2)} identifiant="hasBalcony" valeur={hasBalcony} errors={errors} onChange={this.handleChange}>
                                Balcon
                            </Radiobox>
                        </div>

                        <div className="line line-2">
                            <Radiobox items={helper.getItems("answers-search", 3)} identifiant="hasParking" valeur={hasParking} errors={errors} onChange={this.handleChange}>
                                Parking
                            </Radiobox>
                            <Radiobox items={helper.getItems("answers-search", 4)} identifiant="hasBox" valeur={hasBox} errors={errors} onChange={this.handleChange}>
                                Box
                            </Radiobox>
                        </div>
                    </div>
                </div>

                <div className="line line-critere">
                    <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
                </div>

                <div className="line line-buttons">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}