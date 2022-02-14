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
                    case "nego":
                        if(el.negotiator && filter === el.negotiator.id){
                            push = true
                        }
                        break;
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

function filterCustomNego(dataImmuable, filters, property){
    let newData = [], newData1 = [];

    let filtersOne = filters[0];
    let filtersTwo = filters[1];

    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        newData = filter(dataImmuable, filtersOne, property);
        newData1 = filter(newData, filtersTwo, "nego");

        newData = newData1;
    }

    return newData;
}

function filterBuyers(dataImmuable, filters){
    return filterCustomNego(dataImmuable, filters, "type");
}

function filterProspects(dataImmuable, filters){
    return filterCustomNego(dataImmuable, filters, "status");
}

function getNegotiators(dataImmuable)
{
    let nData = [], noDuplicate = [];
    dataImmuable.forEach(elem => {
        let nego = elem.negotiator;
        if(nego){
            if(!noDuplicate.includes(nego.id)){
                noDuplicate.push(nego.id);
                nData.push({ value: nego.id, label: nego.fullname, id: "f-negot" + nego.id, lastname: nego.lastname })
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
    filterBuyers,
    filterProspects,
    getNegotiators,
}