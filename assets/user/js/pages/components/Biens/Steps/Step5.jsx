import React, {Component} from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet/dist/leaflet";
import "leaflet-ajax/dist/leaflet.ajax.min";

import Map from "@commonComponents/functions/map";

import {Checkbox, Input, Radiobox, SelectReactSelectize} from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { Button }       from "@dashboardComponents/Tools/Button";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/functions/helper";
import Sort from "@commonComponents/functions/sort";

const CURRENT_STEP = 5;
let mymap = null;

export class Step5 extends Component {

    componentDidMount () {
        // navigator.geolocation.getCurrentPosition(function (pos) {
        //     let crd = pos.coords;
        //
        //     mymap = Map.createMap(crd.latitude, crd.longitude, 15, 13, 30);
        // }, function () {
        //     mymap = Map.createMap(43.297648, 5.372835, 15, 13, 30);
        // })
        mymap = Map.createMap(43.297648, 5.372835, 15, 13, 30);
    }

    render () {
        const { step, errors, quartiers, onNext, onDraft, onChange, onChangeSelect, onChangeZipcode, onChangeGeo,
            address, hideAddress, zipcode, city, country, departement, newQuartier, quartier, lat, lon, hideMap } = this.props;

        const divStyle = {
            height: '50vh'
        };

        if(lat && lon && mymap){
            let marker = L.marker([lat, lon], {icon: Map.getOriginalLeafletIcon("../")}).addTo(mymap);
        }

        let quartiersItems = [],
            findQuartier   = false
        ;

        quartiers.sort(Sort.compareName)
        quartiers.forEach(ne => {
            if(ne.name === quartier){
                findQuartier = true;
            }
            quartiersItems.push({ value: ne.name, label: ne.name + ", " + ne.zipcode + " - " + ne.city, identifiant: "quart-" + ne.id })
        })

        if(!findQuartier){
            quartiersItems.push({ value: quartier, label: quartier + " (introuvable dans la base de donnée)", identifiant: "quart-custom" })
        }

        let switcherItems = [ { value: 1, label: 'Oui', identifiant: 'oui' } ]

        return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
            <div className="line-infos">
                <Alert iconCustom="exclamation" type="reverse">(*) Champs obligatoires.</Alert>
            </div>

            <div className="line special-line">
                <div className="form-group">
                    <label>Localisation</label>
                </div>
                <div className="line line-2">
                    <Input identifiant="address" valeur={address} errors={errors} onChange={onChange}>
                        <span>Adresse *</span>
                    </Input>
                    <Radiobox items={helper.getItems("answers-simple", 0)} identifiant="hideAddress" valeur={hideAddress} errors={errors} onChange={onChange}>
                        Masquer l'adresse
                    </Radiobox>
                </div>
                <div className="line line-3">
                    <Input identifiant="zipcode" valeur={zipcode} errors={errors} onChange={onChangeZipcode}>
                        <span>Code postal *</span>
                    </Input>
                    <Input identifiant="city" valeur={city} errors={errors} onChange={onChange}>
                        <span>Ville *</span>
                    </Input>
                    <Input identifiant="country" valeur={country} errors={errors} onChange={onChange}>
                        <span>Pays *</span>
                    </Input>
                </div>
                {/*<div className="line line-3">*/}
                {/*    <Input identifiant="departement" valeur={departement} errors={errors} onChange={onChange}>*/}
                {/*        <span>Département</span>*/}
                {/*    </Input>*/}
                {/*    <div className="form-group" />*/}
                {/*    <div className="form-group" />*/}
                {/*</div>*/}
                <div className="line line-2">
                    <Checkbox isSwitcher={true} items={switcherItems} identifiant="newQuartier" valeur={newQuartier} errors={errors} onChange={onChange}>
                        Ajouter un quartier à la base de donnée ?
                    </Checkbox>
                    {newQuartier[0] === 1 ? <Input identifiant="quartier" valeur={quartier} errors={errors} onChange={onChange}>
                            <span>Quartier</span>
                        </Input> : <SelectReactSelectize items={quartiersItems} identifiant="quartier" valeur={quartier} errors={errors}
                                                         onChange={(e) => onChangeSelect('quartier', e)}>
                        Quartier
                    </SelectReactSelectize>}
                </div>
            </div>

            <div className="line special-line">
                <div className="form-group">
                    <label>Géolocalisation</label>
                </div>
                <div className="line">
                    <div className="form-group">
                        <Button type="default" icon="placeholder" onClick={onChangeGeo}>Obtenir les coordonnées GPS</Button>
                    </div>
                </div>
                <div className="line line-3">
                    <Input type="number" step="any" identifiant="lat" valeur={lat} errors={errors} onChange={onChange}>
                        <span>Latitude</span>
                    </Input>
                    <Input type="number" step="any" identifiant="lon" valeur={lon} errors={errors} onChange={onChange}>
                        <span>Longitude</span>
                    </Input>
                    <Radiobox items={helper.getItems("answers-simple", 1)} identifiant="hideMap" valeur={hideMap} errors={errors} onChange={onChange}>
                        Masquer la géolocalisation
                    </Radiobox>
                </div>
            </div>

            <div className="line special-line">
                <div id="mapid" style={divStyle} />
            </div>

            <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
        </div>
    }
}