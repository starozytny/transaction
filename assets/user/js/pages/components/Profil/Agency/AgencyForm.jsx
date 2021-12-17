import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Form }         from "@dashboardPages/components/User/UserForm";
import { FormLayout }   from "@dashboardComponents/Layout/Elements";

const URL_UPDATE_GROUP  = "api_users_update";

export function UserFormulaire ({ type, element, societyId })
{
    let title = "Modifier " + element.name;
    let url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    let msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";

    let form = <Form
        context={type}
        url={url}
        messageSuccess={msg}
        isProfil={true}
    />

    return <FormLayout url={Routing.generate('user_profil')} form={form} text="Retour à mon profil">{title}</FormLayout>
}