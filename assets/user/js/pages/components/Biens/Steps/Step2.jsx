import React from "react";

import { Input, Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { DatePick }     from "@dashboardComponents/Tools/DatePicker";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/functions/helper";

const BIEN_PARKING_BOX = 2;
const BIEN_TERRAIN = 3;

const AD_VIAGER = 2;

const CURRENT_STEP = 2;

export function Step2({ step, errors, onNext, onDraft, onChange, onChangeSelect, onChangeDate,
                          caseTypeBien, codeTypeAd, codeTypeBien,
                          areaHabitable, areaLand, areaGarden, areaTerrace, areaCave, areaBathroom, areaLiving,
                          piece, room, bathroom, wc, balcony, parking, box,
                          dispoAt, busy, buildAt, isMeuble, isNew, floor, nbFloor,
                          codeHeater, codeKitchen, isWcSeparate, codeWater, exposition, codeHeater0,
                          nbVehicles, isImmeubleParking, isParkingIsolate, age1, age2 })
{
    let expositionItems = helper.getItems("expositions");
    let chauffage0Items = helper.getItems("chauffages-0");
    let chauffage1Items = helper.getItems("chauffages-1");
    let cuisineItems = helper.getItems("cuisines");
    let waterItems = helper.getItems("water");
    let occupationItems = helper.getItems("occupations");

    let codeTypeBienInt = helper.getIntValue(codeTypeBien);
    let codeTypeAdInt = helper.getIntValue(codeTypeAd);

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line-infos">
            <Alert type="reverse">
                (*) Champs obligatoires. <br/><br/>
                Une fiche bien remplie permet un meilleur référencement de l'agence
                auprès des moteurs de recherche tel que Google. Donc, plus de visiteurs qui verront cette annonce.
            </Alert>
        </div>

        {caseTypeBien === 1 && <div className="line special-line">
            <div className="form-group">
                <label>Nombre de ...</label>
            </div>
            <div className="line line-infinite">
                <Input type="number" min={0} identifiant="piece" valeur={piece} errors={errors} onChange={onChange}>
                    <span>Pièces *</span>
                </Input>
                <Input type="number" min={0} identifiant="room" valeur={room} errors={errors} onChange={onChange}>
                    <span>Chambres</span>
                </Input>
                <Input type="number" min={0} identifiant="bathroom" valeur={bathroom} errors={errors} onChange={onChange}>
                    <span>Salles de bain</span>
                </Input>
                <Input type="number" min={0} identifiant="wc" valeur={wc} errors={errors} onChange={onChange}>
                    <span>WC</span>
                </Input>
                <Input type="number" min={0} identifiant="balcony" valeur={balcony} errors={errors} onChange={onChange}>
                    <span>Blacons</span>
                </Input>
                <Input type="number" min={0} identifiant="parking" valeur={parking} errors={errors} onChange={onChange}>
                    <span>Parkings</span>
                </Input>
                <Input type="number" min={0} identifiant="box" valeur={box} errors={errors} onChange={onChange}>
                    <span>Boxes</span>
                </Input>
            </div>
        </div>}

        <div className="line special-line">
            <div className="form-group">
                <label>Surfaces (m²)</label>
            </div>
            <div className="line line-infinite">
                <Input type="number" step="any" min={0} identifiant="areaHabitable" valeur={areaHabitable} errors={errors} onChange={onChange}>
                    <span>{caseTypeBien === 1 ? "Habitable" : "Total"}</span>
                </Input>
                {caseTypeBien === 1 && <>
                    <Input type="number" step="any" min={0} identifiant="areaLand" valeur={areaLand} errors={errors} onChange={onChange}>
                        <span>Terrain</span>
                    </Input>
                    <Input type="number" step="any" min={0} identifiant="areaGarden" valeur={areaGarden} errors={errors} onChange={onChange}>
                        <span>Jardin</span>
                    </Input>
                    <Input type="number" step="any" min={0} identifiant="areaTerrace" valeur={areaTerrace} errors={errors} onChange={onChange}>
                        <span>Terrasse</span>
                    </Input>
                    <Input type="number" step="any" min={0} identifiant="areaCave" valeur={areaCave} errors={errors} onChange={onChange}>
                        <span>Cave</span>
                    </Input>
                    <Input type="number" step="any" min={0} identifiant="areaBathroom" valeur={areaBathroom} errors={errors} onChange={onChange}>
                        <span>Salle de bain</span>
                    </Input>
                    <Input type="number" step="any" min={0} identifiant="areaLiving" valeur={areaLiving} errors={errors} onChange={onChange}>
                        <span>Salon</span>
                    </Input>
                </>}
            </div>
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>Caractéristiques</label>
            </div>

            {(parseInt(codeTypeAd) === 1 && caseTypeBien === 1) && <div className="line">
                <Radiobox items={helper.getItems("answers", 0)} identifiant="isMeuble" valeur={isMeuble} errors={errors} onChange={onChange}>
                    Meublé ?
                </Radiobox>
            </div>}

            {codeTypeBienInt !== BIEN_TERRAIN && <>
                <div className="line line-2">
                    <Input type="number" min={1600} identifiant="buildAt" valeur={buildAt} errors={errors} onChange={onChange}>
                        <span>Année de construction</span>
                    </Input>
                    <Radiobox items={helper.getItems("answers", 1)} identifiant="isNew" valeur={isNew} errors={errors} onChange={onChange}>
                        Refait à neuf ?
                    </Radiobox>
                </div>
            </>}

            <div className="line line-2">
                <DatePick identifiant="dispoAt" valeur={dispoAt} errors={errors}
                          onChange={(e) => onChangeDate("dispoAt", e)}>
                    Date disponible
                </DatePick>
                {caseTypeBien === 1 ? <Radiobox items={occupationItems} identifiant="busy" valeur={busy} errors={errors} onChange={onChange}>
                    Occupation
                </Radiobox> : <div className="form-group" />}
            </div>
        </div>
        {caseTypeBien === 1 && <>
            <div className="line special-line">
                {codeTypeAdInt === AD_VIAGER && <div className="line line-2">
                    <Input type="number" min={18} identifiant="age1" valeur={age1} errors={errors} onChange={onChange}>
                        <span>Age personne 1</span>
                    </Input>
                    <Input type="number" min={18} identifiant="age2" valeur={age2} errors={errors} onChange={onChange}>
                        <span>Age personne 2</span>
                    </Input>
                </div>}
                <div className="line line-2">
                    <Input type="number" min={0} identifiant="floor" valeur={floor} errors={errors} onChange={onChange}>
                        <span>Etage</span>
                    </Input>
                    <Input type="number" min={floor ? parseInt(floor) : 0} identifiant="nbFloor" valeur={nbFloor} errors={errors} onChange={onChange}>
                        <span>Nombre d'étages</span>
                    </Input>
                </div>
            </div>
            <div className="line special-line">
                <div className="line line-2">
                    <SelectReactSelectize items={chauffage0Items} identifiant="codeHeater0" valeur={codeHeater0} errors={errors}
                                          onChange={(e) => onChangeSelect('codeHeater0', e)}>
                        Type de chauffage (1/2)
                    </SelectReactSelectize>
                    <SelectReactSelectize items={chauffage1Items} identifiant="codeHeater" valeur={codeHeater} errors={errors}
                                          onChange={(e) => onChangeSelect('codeHeater', e)}>
                        Type de chauffage (2/2)
                    </SelectReactSelectize>
                </div>
                <div className="line line-2">
                    <SelectReactSelectize items={cuisineItems} identifiant="codeKitchen" valeur={codeKitchen} errors={errors}
                                          onChange={(e) => onChangeSelect('codeKitchen', e)}>
                        Type de cuisine
                    </SelectReactSelectize>
                    <SelectReactSelectize items={waterItems} identifiant="codeWater" valeur={codeWater} errors={errors}
                                          onChange={(e) => onChangeSelect('codeWater', e)}>
                        Type d'eau chaude
                    </SelectReactSelectize>
                </div>
            </div>
        </>}
        {codeTypeBienInt !== BIEN_PARKING_BOX && <>
            <div className="line special-line">
                {codeTypeBienInt !== BIEN_TERRAIN && <>
                    <div className="line line-2">
                        <Radiobox items={helper.getItems("answers", 2)} identifiant="isWcSeparate" valeur={isWcSeparate} errors={errors} onChange={onChange}>
                            WC séparé ?
                        </Radiobox>
                        <div className="form-group" />
                    </div>
                </>}

                <div className="line line-infinite">
                    <Radiobox items={expositionItems} identifiant="exposition" valeur={exposition} errors={errors} onChange={onChange}>
                        Exposition
                    </Radiobox>
                </div>
            </div>
        </>}

        {codeTypeBienInt === BIEN_PARKING_BOX && <>
            <div className="line special-line">
                <div className="line line-2">
                    <Input type="number" min={0} identifiant="nbVehicles" valeur={nbVehicles} errors={errors} onChange={onChange}>
                        <span>Nombre de véhicules</span>
                    </Input>
                    <div className="form-group"/>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", "p-ip")} identifiant="isImmeubleParking" valeur={isImmeubleParking} errors={errors} onChange={onChange}>
                        Immeuble de parkings ?
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", '"p-pi')} identifiant="isParkingIsolate" valeur={isParkingIsolate} errors={errors} onChange={onChange}>
                        Parking isolé ?
                    </Radiobox>
                </div>
            </div>
        </>}

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
