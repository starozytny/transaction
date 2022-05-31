const Sanitaze = require('@commonComponents/functions/sanitaze')

function compareFirstname(a, b){
    return compareWithoutAccent(a.firstname, b.firstname);
}

function compareLastname(a, b){
    return compareWithoutAccent(a.lastname, b.lastname);
}

function compareUsername(a, b){
    return compareWithoutAccent(a.username, b.username);
}

function compareTitle(a, b){
    return compareWithoutAccent(a.title, b.title);
}

function compareName(a, b){
    return compareWithoutAccent(a.name, b.name);
}

function compareCreatedAt(a, b){
    return comparison(a.createdAt, b.createdAt);
}

function compareCreatedAtInverse(a, b){
    return comparison(b.createdAt, a.createdAt);
}

function compareEmail(a, b){
    return compareWithoutAccent(a.email, b.email);
}

function compareZipcode(a, b){
    return compareWithoutAccent(a.zipcode, b.zipcode);
}

function compareCity(a,b){
    return compareWithoutAccent(a.city, b.city);
}

function compareWithoutAccent(aVal, bVal) {
    let aName = Sanitaze.removeAccents(aVal);
    let bName = Sanitaze.removeAccents(bVal);
    return comparison(aName.toLowerCase(), bName.toLowerCase());
}

function compareRank(a, b){
    return comparison(a.rank, b.rank);
}

function compareAgEventStartAt(a, b){
    return comparison(a.agEvent.startAt, b.agEvent.startAt);
}

function compareCode(a, b){
    return comparison(a.code, b.code);
}

function compareUpdatedAtInverse(a, b){
    return comparison(b.updatedAt, a.updatedAt);
}

function compareLibelle(a, b){
    return comparison(a.libelle, b.libelle);
}

function compareFinancialPrice(a, b){
    return comparison(a.financial.price, b.financial.price);
}

function compareFinancialPriceInverse(a, b){
    return comparison(b.financial.price, a.financial.price);
}

function compareProspectLastname(a, b){
    return comparison(a.prospect.lastname, b.prospect.lastname);
}

function comparison (objA, objB){
    let comparison = 0;
    if (objA > objB) {
        comparison = 1;
    } else if (objA < objB) {
        comparison = -1;
    }
    return comparison;
}

module.exports = {
    compareUsername,
    compareLastname,
    compareFirstname,
    compareTitle,
    compareName,
    compareCreatedAt,
    compareCreatedAtInverse,
    compareEmail,
    compareZipcode,
    compareCity,
    compareRank,
    compareAgEventStartAt,
    compareCode,
    compareUpdatedAtInverse,
    compareLibelle,
    compareFinancialPrice,
    compareFinancialPriceInverse,
    compareProspectLastname,
}