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
            let biens = JSON.parse(data.biens)
            self.setState({ users, managers, negotiators, owners, tenants, prospects, biens })
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

module.exports = {
    getData
}