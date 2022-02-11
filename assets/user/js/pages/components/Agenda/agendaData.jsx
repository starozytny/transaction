const axios      = require("axios");
const Routing    = require("@publicFolder/bundles/fosjsrouting/js/router.min.js");

const Formulaire = require("@dashboardComponents/functions/Formulaire");

function getData(self, url) {
    axios({ method: "GET", url: Routing.generate(url), data: {}})
        .then(function (response) {
            let data = response.data;
            let users = JSON.parse(data.users)
            let managers = JSON.parse(data.managers)
            let negotiators = JSON.parse(data.negotiators)
            let owners = JSON.parse(data.owners)
            let tenants = JSON.parse(data.tenants)
            let prospects = JSON.parse(data.prospects)
            let buyers = JSON.parse(data.buyers)
            let biens = JSON.parse(data.biens)
            self.setState({ users, managers, negotiators, owners, tenants, prospects, biens, buyers })
        })
        .catch(function (error) {
            Formulaire.displayErrors(self, error)
            self.setState({ loadPageError: true });
        })
        .then(function () {
            Formulaire.loader(false);
            self.setState({ loadData: false });
        })
    ;
}

function createEventStructure(elem, visit) {
    return {
        id: elem.id,
        title: elem.name,
        start: elem.startAtAgenda,
        end: elem.endAtAgenda,
        allDay: elem.allDay,
        extendedProps: {
            location: elem.location,
            comment: elem.comment,
            persons: elem.persons,
            startAtJavascript: elem.startAtJavascript,
            endAtJavascript: elem.endAtJavascript,
            status: elem.status,
            statusString: elem.statusString,
            visibilities: elem.visibilities,
            visit: visit ? visit.id : null,
            bien: visit ? visit.bien : null,
        },
        classNames: "event event-" + elem.status
    }
}

function createElement(elem) {
    let props = elem.extendedProps;

    return {
        id: parseInt(elem.id),
        name: elem.title,
        allDay: elem.allDay,
        startAtJavascript: props.startAtJavascript,
        endAtJavascript: props.endAtJavascript,
        location: props.location,
        comment: props.comment,
        persons: props.persons,
        status: props.status,
        visibilities: props.visibilities,
        visit: props.visit,
        bien: props.bien ? props.bien.id : null
    }
}

module.exports = {
    getData,
    createElement,
    createEventStructure
}