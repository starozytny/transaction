import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Form } from "@userPages/components/Biens/Form/Form";

const URL_CREATE_ELEMENT     = "api_biens_create";
const URL_UPDATE_GROUP       = "api_biens_update";

function setValueBoolean (parentValue, value) {
    return parentValue ? (value ? 1 : 0) : 0;
}

function setValueEmptyIfNull (parentValue, value) {
    if(parentValue){
        if(value === 0){
            return value;
        }
        if(value){
            return value;
        }
    }

    return ""
}

export function BienFormulaire ({ type, element, tenants, rooms, photos, negotiators, allOwners, allTenants, societyId, agencyId })
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
    let financial = element ? element.financial : null;
    let confidential = element ? element.confidential : null;
    let advert = element ? element.advert : null;

    let form = <Form
        title={title}
        context={type}
        url={url}

        codeTypeAd={element ? element.codeTypeAd : ""}
        codeTypeBien={element ? element.codeTypeBien : ""}
        libelle={element ? element.libelle : "Brouillon"}
        codeTypeMandat={element ? element.codeTypeMandat : 0}
        negotiator={element ? element.negotiator.id : ""}

        areaTotal={element ? setValueEmptyIfNull(area, area.total) : 0}
        areaHabitable={element ? setValueEmptyIfNull(area, area.habitable) : ""}
        areaLand={element ? setValueEmptyIfNull(area, area.land) : ""}
        areaGarden={element ? setValueEmptyIfNull(area, area.garden) : ""}
        areaTerrace={element ? setValueEmptyIfNull(area, area.terrace) : ""}
        areaCave={element ? setValueEmptyIfNull(area, area.cave) : ""}
        areaBathroom={element ? setValueEmptyIfNull(area, area.bathroom) : ""}
        areaLiving={element ? setValueEmptyIfNull(area, area.living) : ""}
        areaDining={element ? setValueEmptyIfNull(area, area.dining) : ""}

        piece={element ? setValueEmptyIfNull(number, number.piece) : 1}
        room={element ? setValueEmptyIfNull(number, number.room) : ""}
        bathroom={element ? setValueEmptyIfNull(number, number.bathroom) : ""}
        wc={element ? setValueEmptyIfNull(number, number.wc) : ""}
        balcony={element ? setValueEmptyIfNull(number, number.balcony) : ""}
        parking={element ? setValueEmptyIfNull(number, number.parking) : ""}
        box={element ? setValueEmptyIfNull(number, number.box) : ""}

        dispoAt={element ? (setValueEmptyIfNull(feature, feature.dispoAtJavascript) !== "" ? new Date(feature.dispoAtJavascript) : "" ) : ""}
        busy={element ? setValueEmptyIfNull(feature, feature.busy) : 0}
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
        createdAtDpe={element ? (setValueEmptyIfNull(diag, diag.createdAtDpeJavascript) !== "" ? new Date(diag.createdAtDpeJavascript) : "" ) : ""}
        referenceDpe={element ? setValueEmptyIfNull(diag, diag.referenceDpe) : ""}
        dpeLetter={element ? setValueEmptyIfNull(diag, diag.dpeLetter) : ""}
        gesLetter={element ? setValueEmptyIfNull(diag, diag.gesLetter) : ""}
        dpeValue={element ? setValueEmptyIfNull(diag, diag.dpeValue) : ""}
        gesValue={element ? setValueEmptyIfNull(diag, diag.gesValue) : ""}
        minAnnual={element ? setValueEmptyIfNull(diag, diag.minAnnual) : ""}
        maxAnnual={element ? setValueEmptyIfNull(diag, diag.maxAnnual) : ""}

        address={element ? setValueEmptyIfNull(localisation, localisation.address) : ""}
        hideAddress={element ? setValueBoolean(localisation, localisation.hideAddress) : 0}
        zipcode={element ? setValueEmptyIfNull(localisation, localisation.zipcode) : ""}
        city={element ? setValueEmptyIfNull(localisation, localisation.city) : ""}
        country={element ? setValueEmptyIfNull(localisation, localisation.country) : "France"}
        departement={element ? setValueEmptyIfNull(localisation, localisation.departement) : ""}
        quartier={element ? setValueEmptyIfNull(localisation, localisation.quartier) : ""}
        lat={element ? setValueEmptyIfNull(localisation, localisation.lat) : ""}
        lon={element ? setValueEmptyIfNull(localisation, localisation.lon) : ""}
        hideMap={element ? setValueBoolean(localisation, localisation.hideMap) : 0}

        typeCalcul={element ? setValueEmptyIfNull(financial, financial.typeCalcul) : 0}
        price={element ? setValueEmptyIfNull(financial, financial.price) : ""}
        provisionCharges={element ? setValueEmptyIfNull(financial, financial.provisionCharges) : ""}
        provisionOrdures={element ? setValueEmptyIfNull(financial, financial.provisionOrdures) : ""}
        tva={element ? setValueEmptyIfNull(financial, financial.tva) : ""}
        totalTerme={element ? setValueEmptyIfNull(financial, financial.totalTerme) : ""}
        caution={element ? setValueEmptyIfNull(financial, financial.caution) : ""}
        honoraireTtc={element ? setValueEmptyIfNull(financial, financial.honoraireTtc) : ""}
        honoraireBail={element ? setValueEmptyIfNull(financial, financial.honoraireBail) : ""}
        edl={element ? setValueEmptyIfNull(financial, financial.edl) : ""}
        typeCharges={element ? setValueEmptyIfNull(financial, financial.typeCharges) : 0}
        totalGeneral={element ? setValueEmptyIfNull(financial, financial.totalGeneral) : ""}
        typeBail={element ? setValueEmptyIfNull(financial, financial.typeBail) : ""}
        durationBail={element ? setValueEmptyIfNull(financial, financial.durationBail) : ""}

        chargesMensuelles={element ? setValueEmptyIfNull(financial, financial.chargesMensuelles) : ""}
        notaire={element ? setValueEmptyIfNull(financial, financial.notaire) : ""}
        foncier={element ? setValueEmptyIfNull(financial, financial.foncier) : ""}
        taxeHabitation={element ? setValueEmptyIfNull(financial, financial.taxeHabitation) : ""}
        honoraireChargeDe={element ? setValueEmptyIfNull(financial, financial.honoraireChargeDe) : 1}
        honorairePourcentage={element ? setValueEmptyIfNull(financial, financial.honorairePourcentage) : ""}
        prixHorsAcquereur={element ? setValueEmptyIfNull(financial, financial.prixHorsAcquereur) : ""}
        isCopro={element ? setValueBoolean(financial, financial.isCopro) : 0}
        nbLot={element ? setValueEmptyIfNull(financial, financial.nbLot) : ""}
        chargesLot={element ? setValueEmptyIfNull(financial, financial.chargesLot) : ""}
        isSyndicProcedure={element ? setValueBoolean(financial, financial.isSyndicProcedure) : 0}
        detailsProcedure={element ? setValueEmptyIfNull(financial, financial.detailsProcedure) : ""}

        photos={photos}

        owner={element ? (element.owner ? element.owner.id : "") : ""}
        tenants={tenants ? tenants : []}

        inform={element ? setValueEmptyIfNull(confidential, confidential.inform) : 0}
        lastname={element ? setValueEmptyIfNull(confidential, confidential.lastname) : ""}
        phone1={element ? setValueEmptyIfNull(confidential, confidential.phone1) : ""}
        email={element ? setValueEmptyIfNull(confidential, confidential.email) : ""}
        visiteAt={element ? (setValueEmptyIfNull(confidential, confidential.visiteAtJavascript) !== "" ? new Date(confidential.visiteAtJavascript) : "" ) : ""}
        visiteTo={element ? setValueEmptyIfNull(confidential, confidential.visiteTo) : ""}
        keysNumber={element ? setValueEmptyIfNull(confidential, confidential.keysNumber) : ""}
        keysWhere={element ? setValueEmptyIfNull(confidential, confidential.keysWhere) : ""}

        typeAdvert={element ? setValueEmptyIfNull(advert, advert.typeAdvert) : 0}
        contentSimple={element ? setValueEmptyIfNull(advert, advert.contentSimple) : ""}
        contentFull={element ? setValueEmptyIfNull(advert, advert.contentFull) : ""}

        rooms={element ? rooms : []}

        messageSuccess={msg}

        negotiators={negotiators}
        allOwners={allOwners}
        allTenants={allTenants}
        societyId={societyId}
        agencyId={agencyId}
    />

    return <div className="main-content">{form}</div>
}