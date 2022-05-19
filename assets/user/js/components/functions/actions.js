const React = require("react");

const Routing = require('@publicFolder/bundles/fosjsrouting/js/router.min.js');

function getDefaultAction(isClient, elem, type, refMail) {
    return [
        {data: <a onClick={() => refMail.current.handleOpenAside("Envoyer un mail")}>Envoyer un mail</a>},
        {data: <a href={Routing.generate('user_agenda', {'ty': type, 'se': elem.id})}>Voir ses rendez-vous</a>},
    ]
}

module.exports = {
    getDefaultAction
}
