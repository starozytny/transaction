import "../../css/pages/mails.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Mails } from "@dashboardPages/components/Mails/Mails";
import { MailFormulaire } from "@dashboardPages/components/Mails/MailForm";

Routing.setRoutingData(routes);

let el = document.getElementById("mails");
if(el){
    render(<Mails {...el.dataset} />, el)
}

el = document.getElementById("send-mail");
if(el){
    render(<MailFormulaire type="create" {...el.dataset} />, el)
}

