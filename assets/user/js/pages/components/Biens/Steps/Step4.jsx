import React, { Component } from "react";

import toastr  from "toastr";

import { Input, Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Button }       from "@dashboardComponents/Tools/Button";
import { Aside }        from "@dashboardComponents/Tools/Aside";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper      from "@userPages/components/Biens/helper";
import Validateur  from "@commonComponents/functions/validateur";
import Formulaire  from "@dashboardComponents/functions/Formulaire";

const CURRENT_STEP = 4;
const ARRAY_STRING = ["Autre", "Balcon", "Box", "Cave", "Chambre", "Cuisine", "Jardin", "Parking",
    "Salle à manger", "Salle de bain", "Salon", "Terrasse", "WC" ];
const POSSIBILITIES_EXT = [0,4,5,8,9,10]

export class Step4 extends Component {
    constructor(props) {
        super();

        this.state = {
            type: "",
            name: "",
            area: "",
            sol: "",
            hasBalcony: 99,
            hasTerrace: 99,
            hasGarden: 99,
            areaBalcony: "",
            areaTerrace: "",
            areaGarden: "",
            errors: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value }) }
    handleChangeSelect = (input, e) => {
        const { type, name } = this.state;

        let value = e !== undefined ? e.value : "";
        let nameRoom = name;

        if(input === "type"){
            if(nameRoom !== ARRAY_STRING[value] && (ARRAY_STRING.includes(nameRoom) || nameRoom === "")){
                nameRoom = ARRAY_STRING[value];
            }

            if(POSSIBILITIES_EXT.includes(type !== "" ? parseInt(type) : "")){
                this.setState({
                    hasBalcony: 99,
                    hasTerrace: 99,
                    hasGarden: 99,
                    areaBalcony: "",
                    areaTerrace: "",
                    areaGarden: "",
                })
            }
        }

        this.setState({ [input]: value, name: nameRoom })
    }

    handleClick = (e) => {
        e.preventDefault();

        const { type, name } = this.state;

        this.setState({ errors: [], success: false })

        let paramsToValidate = [
            {type: "text", id: 'type', value: type},
            {type: "text", id: 'name', value: name},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate);
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            toastr.info("Pièce ajoutée avec succès !");
            let label = document.querySelector("label[for='type'] + .react-selectize .simple-value > span");
            if(label){
                label.innerHTML = "";
            }
            this.setState({
                type: "",
                name: "",
                area: "",
                sol: "",
                hasBalcony: 99,
                hasTerrace: 99,
                hasGarden: 99,
                areaBalcony: "",
                areaTerrace: "",
                areaGarden: "",
            })
        }
    }

    render () {
        const { step, onNext, onDraft, refAside, onOpenAside } = this.props;

        const { errors, type, name, area, sol,
            hasBalcony, hasTerrace, hasGarden, areaBalcony, areaTerrace, areaGarden } = this.state;

        let roomItems = helper.getItems("rooms");
        let solItems = helper.getItems("sols");

        let typeInt = type !== "" ? parseInt(type) : "";

        let contentAside = <div>
            <div className="line line-2">
                <SelectReactSelectize items={roomItems} identifiant="type" valeur={type} errors={errors}
                                      onChange={(e) => this.handleChangeSelect('type', e)}>
                    Type de pièce *
                </SelectReactSelectize>
                <Input identifiant="name" valeur={name} errors={errors} onChange={this.handleChange}>
                    <span>Intitulé *</span>
                </Input>
            </div>
            <div className="line line-2">
                <Input identifiant="area" valeur={area} errors={errors} onChange={this.handleChange} type="number" step="any" min={0}>
                    <span>Surface (m²)</span>
                </Input>
                <SelectReactSelectize items={solItems} identifiant="sol" valeur={sol} errors={errors}
                                      onChange={(e) => this.handleChangeSelect('sol', e)}>
                    Type de sol
                </SelectReactSelectize>
            </div>

            {POSSIBILITIES_EXT.includes(typeInt) && <>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", "room-0")} identifiant="hasBalcony" valeur={hasBalcony}
                              errors={errors} onChange={this.handleChange}>
                        Balcon
                    </Radiobox>
                    <Input identifiant="areaBalcony" valeur={areaBalcony} type="number" step="any" min={0}
                           errors={errors} onChange={this.handleChange}>
                        <span>Surface (m²)</span>
                    </Input>
                </div>

                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", "room-1")} identifiant="hasTerrace" valeur={hasTerrace}
                              errors={errors} onChange={this.handleChange}>
                        Terrasse
                    </Radiobox>
                    <Input identifiant="areaTerrace" valeur={areaTerrace} type="number" step="any" min={0}
                           errors={errors} onChange={this.handleChange}>
                        <span>Surface (m²)</span>
                    </Input>
                </div>

                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", "room-2")} identifiant="hasGarden" valeur={hasGarden}
                              errors={errors} onChange={this.handleChange}>
                        Jardin
                    </Radiobox>
                    <Input identifiant="areaGarden" valeur={areaGarden} type="number" step="any" min={0}
                           errors={errors} onChange={this.handleChange}>
                        <span>Surface (m²)</span>
                    </Input>
                </div>
            </>}

            <div className="line line-buttons">
                <Button onClick={this.handleClick}>Enregistrer</Button>
            </div>
        </div>

        return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
            <div className="line special-line">
                <div className="form-group">
                    <label>Les pièces</label>
                </div>
            </div>

            <div className="line">
                <Button type="default" onClick={() => onOpenAside("room")}>Ajouter une pièce</Button>
                <Aside ref={refAside} content={contentAside}>Pièce</Aside>
            </div>

            <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
        </div>
    }
}