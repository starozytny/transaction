import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Form } from "@userPages/components/Biens/Form/Form";

const URL_CREATE_ELEMENT     = "api_biens_create";
const URL_UPDATE_GROUP       = "api_biens_update";

function setValueEmptyIfNull (parentValue, value) {
    return parentValue ? value : ""
}

export function BienFormulaire ({ type, element, negotiators })
{
    let title = "Ajouter un bien";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouveau bien !"

    if(type === "update"){
        title = "Modifier " + element.id;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let area = element ? element.area : null;
    let number = element ? element.number : null;
    let feature = element ? element.feature : null;
    let advantage = element ? element.advantage : null;
    let diag = element ? element.diag : null;
    let localisation = element ? element.localisation : null;

    let form = <Form
        title={title}
        context={type}
        url={url}

        codeTypeAd={element ? element.codeTypeAd : ""}
        codeTypeBien={element ? element.codeTypeBien : ""}
        libelle={element ? element.libelle : ""}
        codeTypeMandat={element ? element.codeTypeMandat : ""}
        negotiator={element ? element.negotiator.id : ""}

        areaTotal={element ? setValueEmptyIfNull(area, area.total) : ""}
        areaHabitable={element ? setValueEmptyIfNull(area, area.habitable) : ""}
        areaLand={element ? setValueEmptyIfNull(area, area.land) : ""}
        areaGarden={element ? setValueEmptyIfNull(area, area.garden) : ""}
        areaTerrace={element ? setValueEmptyIfNull(area, area.terrace) : ""}
        areaCave={element ? setValueEmptyIfNull(area, area.cave) : ""}
        areaBathroom={element ? setValueEmptyIfNull(area, area.bathroom) : ""}
        areaLiving={element ? setValueEmptyIfNull(area, area.living) : ""}
        areaDining={element ? setValueEmptyIfNull(area, area.dining) : ""}

        piece={element ? setValueEmptyIfNull(number, number.piece) : ""}
        room={element ? setValueEmptyIfNull(number, number.room) : ""}
        bathroom={element ? setValueEmptyIfNull(number, number.bathroom) : ""}
        wc={element ? setValueEmptyIfNull(number, number.wc) : ""}
        balcony={element ? setValueEmptyIfNull(number, number.balcony) : ""}
        parking={element ? setValueEmptyIfNull(number, number.parking) : ""}
        box={element ? setValueEmptyIfNull(number, number.box) : ""}

        dispoAt={element ? (setValueEmptyIfNull(feature, feature.dispoAtJavascript) !== "" ? new Date(feature.dispoAtJavascript) : "" ) : ""}
        buildAt={element ? setValueEmptyIfNull(feature, feature.buildAt) : ""}
        isMeuble={element ? setValueEmptyIfNull(feature, feature.isMeuble) : 99}
        isNew={element ? setValueEmptyIfNull(feature, feature.isNew) : 99}
        floor={element ? setValueEmptyIfNull(feature, feature.floor) : ""}
        nbFloor={element ? setValueEmptyIfNull(feature, feature.nbFloor) : ""}
        codeHeater0={element ? setValueEmptyIfNull(feature, feature.codeHeater0) : ""}
        codeHeater={element ? setValueEmptyIfNull(feature, feature.codeHeater) : ""}
        codeKitchen={element ? setValueEmptyIfNull(feature, feature.codeKitchen) : ""}
        isWcSeparate={element ? setValueEmptyIfNull(feature, feature.isWcSeparate) : 99}
        codeWater={element ? setValueEmptyIfNull(feature, feature.codeWater) : ""}
        exposition={element ? setValueEmptyIfNull(feature, feature.exposition) : 99}

        hasGarden={element ? setValueEmptyIfNull(advantage, advantage.hasGarden) : 99}
        hasTerrace={element ? setValueEmptyIfNull(advantage, advantage.hasTerrace) : 99}
        hasPool={element ? setValueEmptyIfNull(advantage, advantage.hasPool) : 99}
        hasCave={element ? setValueEmptyIfNull(advantage, advantage.hasCave) : 99}
        hasDigicode={element ? setValueEmptyIfNull(advantage, advantage.hasDigicode) : 99}
        hasInterphone={element ? setValueEmptyIfNull(advantage, advantage.hasInterphone) : 99}
        hasGuardian={element ? setValueEmptyIfNull(advantage, advantage.hasGuardian) : 99}
        hasAlarme={element ? setValueEmptyIfNull(advantage, advantage.hasAlarme) : 99}
        hasLift={element ? setValueEmptyIfNull(advantage, advantage.hasLift) : 99}
        hasClim={element ? setValueEmptyIfNull(advantage, advantage.hasClim) : 99}
        hasCalme={element ? setValueEmptyIfNull(advantage, advantage.hasCalme) : 99}
        hasInternet={element ? setValueEmptyIfNull(advantage, advantage.hasInternet) : 99}
        hasHandi={element ? setValueEmptyIfNull(advantage, advantage.hasHandi) : 99}
        hasFibre={element ? setValueEmptyIfNull(advantage, advantage.hasFibre) : 99}
        situation={element ? setValueEmptyIfNull(advantage, advantage.situation) : ""}
        sousType={element ? setValueEmptyIfNull(advantage, advantage.sousType) : ""}
        sol={element ? setValueEmptyIfNull(advantage, advantage.sol) : ""}

        beforeJuly={element ? setValueEmptyIfNull(diag, diag.beforeJuly) : 1}
        isVirgin={element ? setValueEmptyIfNull(diag, diag.isVirgin) : 0}
        isSend={element ? setValueEmptyIfNull(diag, diag.isSend) : 0}
        createdAtDpe={element ?  (setValueEmptyIfNull(feature, feature.createdAtDpeJavascript) !== "" ? new Date(feature.createdAtDpeJavascript) : "" ) : ""}
        referenceDpe={element ? setValueEmptyIfNull(diag, diag.referenceDpe) : ""}
        dpeLetter={element ? setValueEmptyIfNull(diag, diag.dpeLetter) : ""}
        gesLetter={element ? setValueEmptyIfNull(diag, diag.gesLetter) : ""}
        dpeValue={element ? setValueEmptyIfNull(diag, diag.dpeValue) : ""}
        gesValue={element ? setValueEmptyIfNull(diag, diag.gesValue) : ""}
        minAnnual={element ? setValueEmptyIfNull(diag, diag.minAnnual) : ""}
        maxAnnual={element ? setValueEmptyIfNull(diag, diag.maxAnnual) : ""}

        address={element ? setValueEmptyIfNull(localisation, localisation.address) : ""}
        hideAddress={element ? setValueEmptyIfNull(localisation, localisation.hideAddress) : 0}
        zipcode={element ? setValueEmptyIfNull(localisation, localisation.zipcode) : ""}
        city={element ? setValueEmptyIfNull(localisation, localisation.city) : ""}
        country={element ? setValueEmptyIfNull(localisation, localisation.country) : ""}
        departement={element ? setValueEmptyIfNull(localisation, localisation.departement) : ""}
        quartier={element ? setValueEmptyIfNull(localisation, localisation.quartier) : ""}
        lat={element ? setValueEmptyIfNull(localisation, localisation.lat) : ""}
        lon={element ? setValueEmptyIfNull(localisation, localisation.lon) : ""}
        hideMap={element ? setValueEmptyIfNull(localisation, localisation.hideMap) : 0}

        messageSuccess={msg}

        negotiators={negotiators}
    />

    return <div className="main-content">{form}</div>
}