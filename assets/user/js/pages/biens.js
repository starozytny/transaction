import "../../css/pages/biens.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";

import { Biens }          from "./components/Biens/Biens";
import { BienFormulaire } from "./components/Biens/Form/Form";
import { Visits }         from "@dashboardPages/components/Immo/Visits/Visits";
import { AdItem }         from "@userPages/components/Biens/Read/AdItem";
import { Suivi }          from "@userPages/components/Biens/Suivi/Suivi";

Routing.setRoutingData(routes);

let el = document.getElementById("list-biens");
if(el){
    render(<Biens {...el.dataset} />, el)
}

el = document.getElementById("read-bien");
if(el){
    render(<AdItem {...el.dataset} />, el)
}

el = document.getElementById("suivi-bien");
if(el){
    render(<Suivi {...el.dataset} />, el)
}

el = document.getElementById("create-bien");
if(el){
    render(<BienFormulaire type="create"
                           societyId={parseInt(el.dataset.societyId)}
                           agencyId={parseInt(el.dataset.agencyId)}
                           negotiators={JSON.parse(el.dataset.negotiators)}
                           quartiers={JSON.parse(el.dataset.quartiers)}
                           allOwners={JSON.parse(el.dataset.allOwners)} />, el)
}

el = document.getElementById("update-bien");
if(el){
    render(<BienFormulaire type="update" element={JSON.parse(el.dataset.element)}
                           rooms={JSON.parse(el.dataset.rooms)}
                           photos={JSON.parse(el.dataset.photos)}
                           societyId={parseInt(el.dataset.societyId)}
                           agencyId={parseInt(el.dataset.agencyId)}
                           negotiators={JSON.parse(el.dataset.negotiators)}
                           quartiers={JSON.parse(el.dataset.quartiers)}
                           allOwners={JSON.parse(el.dataset.allOwners)} />, el)
}

el = document.getElementById("list-visits");
if(el){
    render(<Visits {...el.dataset} />, el)
}