function getDataState (props) {
    return {
        codeTypeAd: props.codeTypeAd,
        codeTypeBien: props.codeTypeBien,
        libelle: props.libelle,
        codeTypeMandat: props.codeTypeMandat,
        negotiator: props.negotiator,

        areaTotal: props.areaTotal,
        areaHabitable: props.areaHabitable,
        areaLand: props.areaLand,
        areaGarden: props.areaGarden,
        areaTerrace: props.areaTerrace,
        areaCave: props.areaCave,
        areaBathroom: props.areaBathroom,
        areaLiving: props.areaLiving,
        areaDining: props.areaDining,

        piece: props.piece,
        room: props.room,
        bathroom: props.bathroom,
        wc: props.wc,
        balcony: props.balcony,
        parking: props.parking,
        box: props.box,

        dispoAt: props.dispoAt,
        buildAt: props.buildAt,
        isMeuble: props.isMeuble,
        isNew: props.isNew,
        floor: props.floor,
        nbFloor: props.nbFloor,
        codeHeater0: props.codeHeater0,
        codeHeater: props.codeHeater,
        codeKitchen: props.codeKitchen,
        isWcSeparate: props.isWcSeparate,
        codeWater: props.codeWater,
        exposition: props.exposition,

        hasGarden: props.hasGarden,
        hasTerrace: props.hasTerrace,
        hasPool: props.hasPool,
        hasCave: props.hasCave,
        hasDigicode: props.hasDigicode,
        hasInterphone: props.hasInterphone,
        hasGuardian: props.hasGuardian,
        hasAlarme: props.hasAlarme,
        hasLift: props.hasLift,
        hasClim: props.hasClim,
        hasCalme: props.hasCalme,
        hasInternet: props.hasInternet,
        hasHandi: props.hasHandi,
        hasFibre: props.hasFibre,
        situation: props.situation,
        sousType: props.sousType,
        sol: props.sol,

        beforeJuly: props.beforeJuly,
        isVirgin: props.isVirgin,
        isSend: props.isSend,
        createdAtDpe: props.createdAtDpe,
        referenceDpe: props.referenceDpe,
        dpeLetter: props.dpeLetter,
        gesLetter: props.gesLetter,
        dpeValue: props.dpeValue,
        gesValue: props.gesValue,
        minAnnual: props.minAnnual,
        maxAnnual: props.maxAnnual,

        address: props.address,
        hideAddress: props.hideAddress,
        zipcode: props.zipcode,
        city: props.city,
        country: props.country,
        departement: props.departement,
        quartier: props.quartier,
        lat: props.lat,
        lon: props.lon,
        hideMap: props.hideMap,

        contentHelpBubble: "",
        arrayPostalCode: [],
        errors: [],
        step: 5
    }
}

module.exports = {
    getDataState
}