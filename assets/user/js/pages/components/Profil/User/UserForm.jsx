import React from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Form }         from "@dashboardPages/components/User/UserForm";
import {FormLayout} from "@dashboardComponents/Layout/Elements";

const URL_CREATE_ELEMENT  = "api_users_create";
const URL_UPDATE_GROUP  = "api_users_update";

export function UserFormulaire ({ type, element, societyId, agencyId, negotiators })
{
    let title = "Ajouter un utilisateur";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouvel utilisateur !"

    if(type !== "create"){
        title = "Modifier " + element.username;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        username={element ? element.username : ""}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        email={element ? element.email : ""}
        avatar={element ? element.avatarFile : null}
        roles={element ? element.roles : []}
        society={element ? element.society.id : societyId}
        agency={element ? element.agency.id : agencyId}
        messageSuccess={msg}
        negotiators={negotiators}
        isProfil={true}
    />

    return <FormLayout url={Routing.generate('user_profil')} form={form} text="Retour à mon profil">{title}</FormLayout>
}