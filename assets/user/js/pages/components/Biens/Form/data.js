const axios  = require("axios");
const Routing = require("@publicFolder/bundles/fosjsrouting/js/router.min.js");

const Formulaire = require("@dashboardComponents/functions/Formulaire");

function getDataState (props) {
    return {
        context: props.context,
        step: 1,

        caseTypeBien: 1,
        percentageFilled: 0,

        codeTypeAd: props.codeTypeAd,
        codeTypeBien: props.codeTypeBien,
        libelle: props.libelle,
        negotiator: props.negotiator ? props.negotiator : (props.negotiatorId ? props.negotiatorId : props.settings.negotiatorDefault),

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
        busy: props.busy,
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

        nbVehicles: props.nbVehicles,
        isImmeubleParking: props.isImmeubleParking,
        isParkingIsolate: props.isParkingIsolate,

        age1: props.age1,
        age2: props.age2,

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
        newQuartier: props.quartier ? [0] : [0],
        quartier: props.quartier,
        lat: props.lat,
        lon: props.lon,
        hideMap: props.hideMap,

        typeCalcul: props.typeCalcul,
        price: props.price,
        provisionCharges: props.provisionCharges,
        caution: props.caution,
        honoraireTtc: props.honoraireTtc,
        edl: props.edl,
        typeCharges: props.typeCharges,
        totalGeneral: props.totalGeneral,
        typeBail: props.typeBail,
        durationBail: props.durationBail,
        complementLoyer: props.complementLoyer,

        chargesMensuelles: props.chargesMensuelles,
        notaire: props.notaire,
        foncier: props.foncier,
        taxeHabitation: props.taxeHabitation,
        honoraireChargeDe: props.honoraireChargeDe,
        honorairePourcentage: props.honorairePourcentage,
        priceHorsAcquereur: props.priceHorsAcquereur,
        isCopro: props.isCopro,
        nbLot: props.nbLot,
        chargesLot: props.chargesLot,
        isSyndicProcedure: props.isSyndicProcedure,
        detailsProcedure: props.detailsProcedure,

        priceMurs: props.priceMurs,
        rente: props.complementLoyer,
        repartitionCa: props.repartitionCa,
        resultatN2: props.resultatN2,
        resultatN1: props.resultatN1,
        resultatN0: props.resultatN0,
        natureBailCommercial: props.natureBailCommercial,

        photos: props.photos,
        photo: null,

        owners: props.owners,
        allOwners: props.allOwners,

        inform: props.inform,
        lastname: props.lastname,
        phone1: props.phone1,
        email: props.email,
        visiteAt: props.visiteAt,
        keysNumber: props.keysNumber,
        keysWhere: props.keysWhere,

        typeAdvert: props.typeAdvert,
        contentSimple: props.contentSimple,
        contentFull: props.contentFull,

        codeTypeMandat: props.codeTypeMandat,
        startAt: props.startAt,
        endAt: props.endAt,
        nbMonthMandat: props.nbMonthMandat,
        priceEstimate: props.priceEstimate,
        fee: props.fee,
        mandatRaison: props.mandatRaison,
        mandatLastname: props.mandatLastname,
        mandatFirstname: props.mandatFirstname,
        mandatPhone: props.mandatPhone,
        mandatAddress: props.mandatAddress,
        mandatZipcode: props.mandatZipcode,
        mandatCity: props.mandatCity,
        mandatCommentary: props.mandatCommentary,

        rooms: props.rooms,

        supports: props.supports,

        settings: props.settings,
        allSupports: props.allSupports,

        isDraft: true,
        id: null,

        contentAside: "",
        contentHelpBubble: "",
        arrayPostalCode: [],
        errors: [],
    }
}

function getOwners (self) {
    axios.get(Routing.generate('api_owners_user_agency'), {})
        .then(function (response) {
            let data = response.data;
            self.setState({ allOwners: data })
        })
        .catch(function (error) {
            Formulaire.displayErrors(self, error);
        })
        .then(() => {
            Formulaire.loader(false);
        })
}

function getProspects (self, onUpdateData = null) {
    axios.get(Routing.generate('api_prospects_user_agency'), {})
        .then(function (response) {
            let data = response.data;
            self.setState({ allProspects: data, loadDataProspects: true })
            if(onUpdateData){
                onUpdateData(data);
            }
        })
        .catch(function (error) {
            Formulaire.displayErrors(self, error);
        })
        .then(() => {
            Formulaire.loader(false);
        })
}

function getVisits (self, elem) {
    axios.get(Routing.generate('api_visits_bien', {'id': elem.id}), {})
        .then(function (response) {
            let data = response.data;
            self.setState({ allVisits: data })
        })
        .catch(function (error) {
            Formulaire.displayErrors(self, error);
        })
        .then(() => {
            Formulaire.loader(false);
        })
}

module.exports = {
    getDataState,
    getOwners,
    getProspects,
    getVisits
}
