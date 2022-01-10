import React from "react";

import { Input, Radiobox } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/helper";

const CURRENT_STEP = 5;

export function Step5({ step, onChange, onChangeZipcode, onNext, onDraft, errors,
                      address, hideAddress, zipcode, city, country, departement, quartier, lat, lon, hideMap })
{

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
            <div className="line line-3">
                <Input identifiant="departement" valeur={departement} errors={errors} onChange={onChange}>
                    <span>Département</span>
                </Input>
                <Input identifiant="quartier" valeur={quartier} errors={errors} onChange={onChange}>
                    <span>Quartier</span>
                </Input>
                <div className="form-group" />
            </div>
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>Géolocalisation</label>
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

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}