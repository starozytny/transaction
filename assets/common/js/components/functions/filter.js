const Sort = require("@commonComponents/functions/sort");

function filter(dataImmuable, filters, property) {
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                let push = false;
                switch (property){
                    case "gerance":
                        if((filter === 1 && el.isGerance) || (filter === 0 && !el.isGerance)){
                            push = true;
                        }
                        break;
                    default:
                        if(filter === el[property]){
                            push = true;
                        }
                        break;
                }

                if(push){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }

            })
        })
    }

    return newData;
}

function filterHighRoleCode(dataImmuable, filters){
    return filter(dataImmuable, filters, "highRoleCode");
}

function filterStatus(dataImmuable, filters){
    return filter(dataImmuable, filters, "status");
}

function filterType(dataImmuable, filters){
    return filter(dataImmuable, filters, "type");
}

function filterGerance(dataImmuable, filters){
    return filter(dataImmuable, filters, "gerance");
}

function filterNego(dataImmuable, filters){
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                if(el.negotiator && filter === el.negotiator.id){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }
            })
        })
    }

    return newData;
}

function getNegotiators(dataImmuable){
    let nData = [], noDuplication = [];
    dataImmuable.forEach(el => {
        let nego = el.negotiator;
        if(nego){
            if(!noDuplication.includes(nego.id)){
                noDuplication.push(nego.id);
                nData.push({ value: nego.id, label: nego.fullname, id: 'f-nego-' + nego.id, lastname: nego.lastname })
            }
        }
    })
    nData.sort(Sort.compareLastname);

    return nData;
}

module.exports = {
    filter,
    filterHighRoleCode,
    filterStatus,
    filterType,
    filterGerance,
    getNegotiators,
    filterNego,
}