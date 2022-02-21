import "../../css/pages/publication.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Publishes } from "@userPages/components/Publishes/Publishes";

Routing.setRoutingData(routes);

let el = document.getElementById("list-publishes");
if(el){
    render(<Publishes {...el.dataset} />, el)
}