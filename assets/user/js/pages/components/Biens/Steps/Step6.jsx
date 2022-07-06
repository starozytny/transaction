import React, {Component} from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet/dist/leaflet";
import "leaflet-ajax/dist/leaflet.ajax.min";

import Map      from "@commonComponents/functions/map";
import helper   from "@userPages/components/Biens/functions/helper";

import { Checkbox, Input, Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Alert }        from "@dashboardComponents/Tools/Alert";
import { Button }       from "@dashboardComponents/Tools/Button";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

const CURRENT_STEP = 6;
let mymap = null;
let marker = null;

export class Step6 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            init: false
        }

        this.handleShowMap = this.handleShowMap.bind(this);
    }

    handleShowMap = () => {
        // navigator.geolocation.getCurrentPosition(function (pos) {
        //     let crd = pos.coords;
        //
        //     mymap = Map.createMap(crd.latitude, crd.longitude, 15, 13, 30);
        // }, function () {
        //     mymap = Map.createMap(43.297648, 5.372835, 15, 13, 30);
        // })

        if(!this.state.init){
            mymap = Map.createMap(43.297648, 5.372835, 15, 13, 30);
        }

        this.setState({ init: true })
    }

    render () {
        const { step, errors, quartiers, onNext, onDraft, onChange, onChangeSelect, onChangeZipcode, onChangeGeo,
            address, hideAddress, zipcode, city, country, departement, newQuartier, quartier, lat, lon, hideMap } = this.props;

        if(lat && lon && mymap){
            if(marker) mymap.removeLayer(marker)
            marker = L.marker([lat, lon], {icon: Map.getOriginalLeafletIcon("../../")}).addTo(mymap);
        }

        let quartiersItems = helper.getItemsFromDB(quartiers, quartier, 'quart', true);
        let switcherItems = [ { value: 1, label: 'Oui', identifiant: 'oui' } ]

        return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
            <div className="line-infos">
                <Alert type="reverse">(*) Champs obligatoires.</Alert>
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
                        <Button type="default" outline={true} icon="placeholder" onClick={onChangeGeo}>Obtenir les coordonnées GPS</Button>
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
                <div className="line line-3">
                    <div className="form-group">
                        <Button outline={true} type="default" icon="map" onClick={this.handleShowMap}>Afficher la carte</Button>
                    </div>
                    <div className="form-group" />
                    <div className="form-group" />
                </div>
            </div>

            {!this.state.init && <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />}

            <div className="line line-buttons">
                <div id="mapid"/>
            </div>

            {this.state.init && <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />}
        </div>
    }
}
