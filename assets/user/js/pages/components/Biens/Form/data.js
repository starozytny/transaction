const axios  = require("axios");
const Routing = require("@publicFolder/bundles/fosjsrouting/js/router.min.js");

const Formulaire = require("@dashboardComponents/functions/Formulaire");

function getDataState (props) {
    return {
        codeTypeAd: props.codeTypeAd,
        codeTypeBien: props.codeTypeBien,
        libelle: props.libelle,
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

        typeCalcul: props.typeCalcul,
        price: props.price,
        provisionCharges: props.provisionCharges,
        provisionOrdures: props.provisionOrdures,
        tva: props.tva,
        totalTerme: props.totalTerme,
        caution: props.caution,
        honoraireTtc: props.honoraireTtc,
        honoraireBail: props.honoraireBail,
        edl: props.edl,
        typeCharges: props.typeCharges,
        totalGeneral: props.totalGeneral,
        typeBail: props.typeBail,
        durationBail: props.durationBail,

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

        photos: props.photos,
        photo: null,

        owner: props.owner,
        tenants: props.tenants,
        allOwners: props.allOwners,
        allTenants: props.allTenants,

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

        rooms: props.rooms,

        isDraft: true,
        id: null,

        contentAside: "",
        contentHelpBubble: "",
        arrayPostalCode: [],
        errors: [],
        step: 9,
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

function getTenants (self) {
    axios.get(Routing.generate('api_tenants_user_agency'), {})
        .then(function (response) {
            let data = response.data;
            self.setState({ allTenants: data })
        })
        .catch(function (error) {
            Formulaire.displayErrors(self, error);
        })
        .then(() => {
            Formulaire.loader(false);
        })
}

function getProspects (self) {
    axios.get(Routing.generate('api_prospects_user_agency'), {})
        .then(function (response) {
            let data = response.data;
            self.setState({ allProspects: data })
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
    getTenants,
    getProspects,
    getVisits
}