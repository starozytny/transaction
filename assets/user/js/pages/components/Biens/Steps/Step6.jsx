import React from "react";

import { Input } from "@dashboardComponents/Tools/Fields";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Alert } from "@dashboardComponents/Tools/Alert";
import { Aside } from "@dashboardComponents/Tools/Aside";

import Sanitaze from "@commonComponents/functions/sanitaze";
import Sort     from "@commonComponents/functions/sort";

export function Step6({ step, onChangeLegend, onChangeFile, onSwitchTrashFile, onNext, errors,
                          refAside, onOpenAside, onSaveLegend,
                          onDragStart, onDragLeave, onDrop, photo, photos })
{
    photos.sort(Sort.compareRank);
    let contentAside = "";
    if(photo){
        let srcFormPhoto = photo.is64 ? photo.file : "path/" . photo.file;
        contentAside = <div>
            <div className="line">
                <div className="legend-photo">
                    <img src={srcFormPhoto} alt="Photo to edit"/>
                </div>
            </div>
            <div className="line">
                <Input identifiant="photo" valeur={photo.legend} errors={errors} onChange={(e) => onChangeLegend(e, photo)}>
                    <span>Légende de l'image</span>
                </Input>
            </div>
            <div className="line">
                <Button onClick={onSaveLegend}>Enregistrer</Button>
            </div>
        </div>
    }

    return <div className={"step-section" + (step === 6 ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">
                Les photos peuvent avoir un poids maximum de 1Mb  afin de ne pas réduire le temps de chargement. <br/>
                Pour réduire le poids de vos photos, vous pouvez redimensionner
                la taille et/ou utiliser le compresseur en ligne suivant : <a href="https://tinyjpg.com" target="_blank">tinyjpg.com</a>
            </Alert>
        </div>
        <div className="line special-line">
            <div className="form-group">
                <label>Photos</label>
            </div>
            <div className="items-table">
                <div className="items items-default">
                    {(photos && photos.length !== 0) && <div className="item item-header">
                        <div className="item-content">
                            <div className="item-body item-body-image">
                                <div className="infos infos-col-4">
                                    <div className="col-1">Photo</div>
                                    <div className="col-2">Ordre</div>
                                    <div className="col-3">Taille</div>
                                    <div className="col-4 actions">Actions</div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {photos.map((el, index) => {

                        let src = el.is64 ? el.file : "path/" . el.file;

                        return (<div className={"item-drag item" + (el.isTrash ? " trash" : "")}
                                     draggable="true" key={index}
                                     onDragStart={(e) => onDragStart(e, el.rank)}
                                     onDragOver={(e) => e.preventDefault()}
                                     onDragEnter={onDragLeave}
                                     onDrop={(e) => onDrop(e, el.rank)}
                        >
                            <div className="item-content">
                                <div className="item-body item-body-image">
                                    <div className="item-image">
                                        <img src={src} alt={el.legend} />
                                    </div>
                                    <div className="infos infos-col-4">
                                        <div className="col-1">
                                            <div className="name name-legend">
                                                {!el.isTrash ?
                                                    (el.legend ?
                                                        <><ButtonIcon icon="pencil" onClick={() => onOpenAside(el)} >Modifier</ButtonIcon><span>{el.legend}</span></>
                                                        : <ButtonIcon icon="tag" text="Ajouter une légende" onClick={() => onOpenAside("photo", el)}/>)
                                                    : "Supprimée"}
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            {el.rank}
                                        </div>
                                        <div className="col-3">
                                            {Sanitaze.toFormatBytesToSize(el.size)}
                                        </div>
                                        <div className="col-4 actions">
                                            {el.isTrash ? <ButtonIcon icon="refresh" onClick={() => onSwitchTrashFile(el)}>Annuler la suppression</ButtonIcon>
                                                : <ButtonIcon icon="trash" onClick={() => onSwitchTrashFile(el)}>Supprimer</ButtonIcon>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <div className="form-group" />
                <Input type="file" identifiant="photos" isMultiple={true} valeur={photos}
                       acceptFiles={"image/*"}
                       errors={errors} onChange={onChangeFile}>
                    <span>Photos</span>
                </Input>
            </div>

            <Aside ref={refAside} content={contentAside}>Légende</Aside>
        </div>

        <div className="line line-buttons">
            <Button type="reverse" onClick={() => onNext(5, 6)}>Etape précédente</Button>
            <div/>
            <div className="btns-submit">
                <Button type="warning">Enregistrer le brouillon</Button>
                <Button onClick={() => onNext(7)}>Etape suivante</Button>
            </div>
        </div>
    </div>
}