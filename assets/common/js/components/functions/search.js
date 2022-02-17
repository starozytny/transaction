function search(type, dataImmuable, search) {
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        return switchFunction(type, search, v);
    })

    return newData;
}

function switchFunction(type, search, v) {
    switch (type) {
        case "user":
            if(v.username.toLowerCase().startsWith(search)
                || v.email.toLowerCase().startsWith(search)
                || v.firstname.toLowerCase().startsWith(search)
                || v.lastname.toLowerCase().startsWith(search)
            ){
                return v;
            }
            break;
        case "sousTypes":
        case "sol":
        case "changelog":
        case "quartier":
        case "society":
            if(v.name.toLowerCase().startsWith(search)){
                return v;
            }
            break;
        case "negotiator":
            if(v.email.toLowerCase().startsWith(search)
                || v.code.toLowerCase() === search
                || v.firstname.toLowerCase().startsWith(search)
                || v.lastname.toLowerCase().startsWith(search)
                || (v.phone && v.phone.startsWith(search))
                || (v.phone2 && v.phone2.startsWith(search))
            ){
                return v;
            }
            break;
        case "owner":
            if( v.code.toLowerCase().startsWith(search)
                || v.firstname.toLowerCase().startsWith(search)
                || v.lastname.toLowerCase().startsWith(search)
                || (v.phone1 && v.phone1.startsWith(search))
                || (v.phone2 && v.phone2.startsWith(search))
                || (v.phone3 && v.phone3.startsWith(search))
            ){
                return v;
            }
            break;
        case "buyer":
        case "prospect":
        case "tenant":
            if( v.firstname.toLowerCase().startsWith(search)
                || v.lastname.toLowerCase().startsWith(search)
                || (v.phone1 && v.phone1.startsWith(search))
                || (v.phone2 && v.phone2.startsWith(search))
                || (v.phone3 && v.phone3.startsWith(search))
            ){
                return v;
            }
            break;
        default:
            break;
    }
}

module.exports = {
    search
}