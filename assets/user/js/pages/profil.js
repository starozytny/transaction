import "../../css/pages/profil.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { UserFormulaire } from "@userPages/components/Profil/User/UserForm";
import { UserContent }    from "@userPages/components/Profil/UserContent";

Routing.setRoutingData(routes);

let el = document.getElementById("profil-update");
if(el){
    render(<div className="main-content">
        <UserFormulaire type="profil"
                        element={JSON.parse(el.dataset.donnees)}
                        negotiators={JSON.parse(el.dataset.negotiators)}
                        societyId={el.dataset.societyId} agencyId={el.dataset.agencyId} />
    </div>, el)
}

el = document.getElementById("profil-content");
if(el){
    render(<UserContent {...el.dataset} />, el)
}

el = document.getElementById("user-create");
if(el){
    render(<div className="main-content">
        <UserFormulaire type="create" societyId={el.dataset.societyId} agencyId={el.dataset.agencyId}
                        negotiators={JSON.parse(el.dataset.negotiators)} />
    </div>, el)
}

el = document.getElementById("user-update");
if(el){
    render(<div className="main-content">
        <UserFormulaire type="update" element={JSON.parse(el.dataset.donnees)} societyId={el.dataset.societyId} agencyId={el.dataset.agencyId}
                        negotiators={JSON.parse(el.dataset.negotiators)} />
    </div>, el)
}