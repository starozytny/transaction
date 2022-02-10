import React from "react";

import { Input } from "@dashboardComponents/Tools/Fields";

export function LocalisationContact ({ errors, onChange, address, complement, zipcode, city, country, email, phone1, phone2, phone3 }) {
    return <>
        <div className="form-group">
            <div className="line-separator">
                <div className="title">Localisation</div>
            </div>

            <div className="line line-2">
                <Input valeur={address} identifiant="address" errors={errors} onChange={onChange}>Adresse</Input>
                <Input valeur={complement} identifiant="complement" errors={errors} onChange={onChange}>Complément</Input>
            </div>

            <div className="line line-3">
                <Input valeur={zipcode} identifiant="zipcode" errors={errors} onChange={onChange}>Code postal</Input>
                <Input valeur={city} identifiant="city" errors={errors} onChange={onChange}>Ville</Input>
                <Input valeur={country} identifiant="country" errors={errors} onChange={onChange}>Pays</Input>
            </div>
        </div>
        <div className="form-group">
            <div className="line-separator">
                <div className="title">Contact</div>
            </div>

            <div className="line">
                <Input valeur={email} identifiant="email" errors={errors} onChange={onChange} type="email" >Adresse e-mail *</Input>
            </div>

            <div className="line line-3">
                <Input valeur={phone1} identifiant="phone1" errors={errors} onChange={onChange}>Téléphone 1 *</Input>
                <Input valeur={phone2} identifiant="phone2" errors={errors} onChange={onChange}>Téléphone 2</Input>
                <Input valeur={phone3} identifiant="phone3" errors={errors} onChange={onChange}>Téléphone 3</Input>
            </div>
        </div>
    </>
}