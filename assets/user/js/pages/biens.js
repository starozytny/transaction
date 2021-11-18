import "../../css/pages/biens.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";

import { BienFormulaire } from "./components/Biens/BienForm";

Routing.setRoutingData(routes);

let el = document.getElementById("create-bien");
if(el){
    render(<BienFormulaire type="create" />, el)
}
