const React = require("react");

const Routing = require('@publicFolder/bundles/fosjsrouting/js/router.min.js');

const { LinkContact } = require("@dashboardComponents/Tools/Button");

function getDefaultAction(isClient, elem, type) {
    return [
        {data: <LinkContact isClient={isClient} email={elem.email} />},
        {data: <a href={Routing.generate('user_agenda', {'ty': type, 'se': elem.id})}>Voir ses rendez-vous</a>},
    ]
}

module.exports = {
    getDefaultAction
}