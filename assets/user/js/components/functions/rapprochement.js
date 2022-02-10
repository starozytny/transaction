function rapprochement(search, biens, data = null)
{
    let compteur = 0;
    [biens, compteur] = filterCode(compteur, 'codeTypeAd', biens, search.codeTypeAd);
    [biens, compteur] = filterCode(compteur, 'codeTypeBien', biens, search.codeTypeBien);

    [biens, compteur] = filterLocalisation(compteur, 'zipcode', biens, search.zipcode);
    [biens, compteur] = filterLocalisation(compteur, 'city',    biens, search.city);

    [biens, compteur] = filterAdvantage(compteur, 'lift',    biens, search.hasLift);
    [biens, compteur] = filterAdvantage(compteur, 'terrace', biens, search.hasTerrace);
    [biens, compteur] = filterAdvantage(compteur, 'balcony', biens, search.hasBalcony);
    [biens, compteur] = filterAdvantage(compteur, 'parking', biens, search.hasParking);
    [biens, compteur] = filterAdvantage(compteur, 'box',     biens, search.hasBox);

    [biens, compteur] = filterMinMax(compteur, 'price', biens, search.minPrice, search.maxPrice, data ? data.price ?? 0 : 0);
    [biens, compteur] = filterMinMax(compteur, 'piece', biens, search.minPiece, search.maxPiece, data ? data.piece ?? 0 : 0);
    [biens, compteur] = filterMinMax(compteur, 'room',  biens, search.minRoom,  search.maxRoom, data ? data.room ?? 0 : 0);
    [biens, compteur] = filterMinMax(compteur, 'area',  biens, search.minArea,  search.maxArea, data ? data.area ?? 0 : 0);
    [biens, compteur] = filterMinMax(compteur, 'land',  biens, search.minLand,  search.maxLand, data ? data.land ?? 0 : 0);

    return [biens, compteur]
}

function filterCode(compteur, filter, data, search) {
    let nData = [];

    data.forEach(item => {
        let value = null;
        switch (filter){
            case "codeTypeAd":
                value = item.codeTypeAd;
                break;
            case "codeTypeBien":
                value = item.codeTypeBien;
                break;
            default:
                break;
        }

        if(value && value === search){
            nData.push(item);
            compteur++;
        }
    })

    return [nData, compteur];
}

function filterMinMax(compteur, filter, data, min, max, delta = 0) {
    let nData = [];

    if(min !== 0 || max !== 0){
        data.forEach(item => {
            let value = null;
            switch (filter){
                case "land":
                    value = item.area.land;
                    break;
                case "area":
                    value = item.area.habitable;
                    break;
                case "room":
                    value = item.number.room;
                    break;
                case "piece":
                    value = item.number.piece;
                    break;
                case "price":
                    value = item.financial.price;
                    break;
                default:
                    break;
            }

            min = (min > delta) ? min - delta : 0;
            max = min !== 0 && max === 0 ? 9999999999999999999 : max;
            if(value && (value >= min && value <= (max + delta))){
                nData.push(item);
                compteur++;
            }
        })
    }else{
        nData = data;
        compteur++;
    }

    return [nData, compteur];
}

function filterLocalisation(compteur, filter, data, search)
{
    let nData = [];
    if(search){
        let value;
        data.forEach(item => {
            value = filter === "zipcode" ? item.localisation.zipcode : item.localisation.city;

            if(value === search){
                nData.push(item);
                compteur++;
            }
        })
    }else{
        nData = data;
        compteur++;
    }

    return [nData, compteur];
}

function filterAdvantage(compteur, filter, data, search)
{
    let nData = [];
    if(search !== 99){
        data.forEach(item => {
            let advantage = item.advantage;
            let number    = item.number;

            console.log(item)

            let value;
            switch (filter){
                case 'box':
                    value = convertToTrillean(number.box);
                    break;
                case 'parking':
                    value = convertToTrillean(number.parking);
                    break;
                case 'balcony':
                    value = convertToTrillean(number.balcony);
                    break;
                case 'terrace':
                    value = advantage.hasTerrace;
                    break;
                case 'lift':
                    value = advantage.hasLift;
                    break;
                default:
                    break;
            }

            if(value && (value === search || value === 99)){
                nData = item;
                compteur++;
            }
        })
    }else{
        nData = data;
        compteur++;
    }

    return [nData, compteur];
}

function convertToTrillean(nb)
{
    return nb ? (nb > 1 ? 1 : 0) : 99;
}

module.exports = {
    rapprochement
}