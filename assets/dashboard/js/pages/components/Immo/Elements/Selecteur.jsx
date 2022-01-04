import React from "react";

import { SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Alert } from "@dashboardComponents/Tools/Alert";

import Helper from "@commonComponents/functions/helper";

export function SelecteurNegociateur ({ isClient, society, agency, negotiator, errors, onChangeSelect, societies, agencies, negotiators })
{
    let selectSociety = [];
    let selectAgency = [];
    let selectNegotiator = [];
    if(!isClient){
        let selectorsData = Helper.selectorsImmo(societies, society, agencies, agency, negotiators, negotiator);
        selectSociety = selectorsData[0];
        selectAgency = selectorsData[1];
        selectNegotiator = selectorsData[2];
    }else{
        negotiators.forEach(elem => {
            let add = agency === "" ? true : (elem.agency.id === agency);
            if(add){
                selectNegotiator.push({ value: elem.id, label: elem.fullname, identifiant: "nego-" + elem.id })
            }
        })
    }

    return <>
        {!isClient && <div className="line">
            <SelectReactSelectize items={selectSociety} identifiant="society" valeur={society}
                                  placeholder={"Sélectionner la société"}
                                  errors={errors} onChange={(e) => onChangeSelect("society", e)}
            >
                Société
            </SelectReactSelectize>
            <SelectReactSelectize items={selectAgency} identifiant="agency" valeur={agency}
                                  placeholder={"Sélectionner l'agence"}
                                  errors={errors} onChange={(e) => onChangeSelect("agency", e)}
            >
                Agence
            </SelectReactSelectize>
        </div>}

        {(society && agency) ? <div className="line">
            <SelectReactSelectize items={selectNegotiator} identifiant="negotiator" valeur={negotiator}
                                  placeholder={"Sélectionner le négociateur"}
                                  errors={errors} onChange={(e) => onChangeSelect("negotiator", e)}
            >
                Négociateur
            </SelectReactSelectize>
        </div> : <Alert type="reverse">Veuillez choisir la société et l'agence avant de pouvoir affecter un négociateur.</Alert>}
    </>
}