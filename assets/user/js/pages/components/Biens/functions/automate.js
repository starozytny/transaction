const { uid } = require("uid");
const toastr  = require("toastr");

function getValueFloat(value){
    return value !== "" ? parseFloat(value) : 0;
}

function consequenceValueToBoolean(self, name, value, compareName, compareValue, toName, booleanValue=99) {
    if(name === compareName){
        if(value > parseFloat(compareValue)){
            self.setState({ [toName]: 1 })
        }else{
            self.setState({ [toName]: booleanValue })
        }
    }
}

function consequenceValueToRooms(self, name, value, rooms, compareName, codeTypeRoom, elStep) {
    if(name === compareName){
        let iteration = value !== "" ? parseInt(value) : 0;

        let nRooms = [];
        let total = 0;
        rooms.forEach(ro => {
            if(ro.typeRoom === codeTypeRoom){
                total++;
            }

            if(!ro.isGenerique){
                nRooms.push(ro);
            }

            if(ro.isGenerique && ro.typeRoom !== codeTypeRoom){
                nRooms.push(ro);
            }
        })
        iteration = iteration - total;

        rooms.filter(r => {return (r.isGenerique !== false && r.isGenerique !== undefined) || r.typeRoom !== codeTypeRoom});
        for(let i = 0 ; i < (iteration > 0 ? iteration : 0) ; i++){
            let newRoom = elStep.handleAddGeneriqueRoom(null, codeTypeRoom);
            nRooms.push(newRoom)
        }

        self.setState({ rooms: nRooms })
    }
}

function calculateFinancial(self, name, value, codeTypeAd,
                            price, notaire, honoraireTtc, honorairePourcentage, provisionCharges, provisionOrdures,
                            typeCalcul, tva, honoraireBail, honoraireChargeDe)
{
    let nPrice      = name === "price" ? value : price;
    let nNotaire    = name === "notaire" ? value : notaire;
    let nHonoTtc    = name === "honoraireTtc" ? value : honoraireTtc;
    let nHonoPour   = name === "honorairePourcentage" ? value : honorairePourcentage;
    let nProvChar   = name === "provisionCharges" ? value : provisionCharges;
    let nProvOrd    = name === "provisionOrdures" ? value : provisionOrdures;
    let nTva        = name === "tva" ? value : tva;
    let nHonoBail   = name === "honoraireBail" ? value : honoraireBail;
    let nTypeCalcul = name === "typeCalcul" ? value : typeCalcul;

    if(parseInt(codeTypeAd) !== 1){
        if(name === "price" || name === "honorairePourcentage"){
            nHonoTtc = (getValueFloat(nPrice) * getValueFloat(nHonoPour)) / 100
            self.setState({ honoraireTtc: nHonoTtc })
        }

        if(name === "honoraireTtc"){
            nHonoPour = (getValueFloat(nHonoTtc)/getValueFloat(nPrice)) * 100;
            self.setState({ honorairePourcentage: nHonoPour })
        }

        let nPriceHoAcq = 0;
        if(parseInt(honoraireChargeDe) === 1){
            nPriceHoAcq = getValueFloat(nPrice) - getValueFloat(nHonoTtc);
        }

        let totalGeneral = getValueFloat(nPrice) + getValueFloat(nNotaire) + getValueFloat(nHonoTtc);
        self.setState({ totalGeneral: totalGeneral, priceHorsAcquereur: nPriceHoAcq })
    }else{
        let totalTerme, totalGeneral;
        switch (nTypeCalcul){
            case 2:
                totalTerme = getValueFloat(nPrice) + getValueFloat(nProvChar) + getValueFloat(nTva) + getValueFloat(nProvOrd);
                break;
            case 1:
                totalTerme = getValueFloat(nPrice) + getValueFloat(nProvChar) + getValueFloat(nTva);
                break;
            default:
                totalTerme = getValueFloat(nPrice) + getValueFloat(nProvChar) + getValueFloat(nProvOrd);
                break;
        }

        totalGeneral = totalTerme + getValueFloat(nHonoTtc) + getValueFloat(nHonoBail);

        self.setState({ totalTerme, totalGeneral })
    }
}

function getBase64(file, self, rank) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        self.setState({ photos: [...self.state.photos, ...[{
                uid: uid(),
                file: reader.result,
                name: file.name,
                legend: "",
                size: file.size,
                rank: rank,
                is64: true,
                isTrash: false
            }]] })
    };
    reader.onerror = function (error) {
        toastr.error('Error: ', error);
    };
}

module.exports = {
    consequenceValueToBoolean,
    consequenceValueToRooms,
    calculateFinancial,
    getBase64
}
