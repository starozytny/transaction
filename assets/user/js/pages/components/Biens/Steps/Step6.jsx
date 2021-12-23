import React from "react";

import { Input } from "@dashboardComponents/Tools/Fields";

import { Alert }    from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

import Sanitaze from "@commonComponents/functions/sanitaze";
import Sort     from "@commonComponents/functions/sort";

export function Step6({ step, onChangeFile, onSwitchTrashFile, onNext, errors,
                          onDragStart, onDragLeave, onDrop, photos })
{

    photos.sort(Sort.compareRank)

    return <div className={"step-section" + (step === 6 ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">
                Les photos peuvent avoir un poids maximum de 1Mb  afin de ne pas réduire le temps de chargement. <br/>
                Pour réduire le poids de vos photos, vous pouvez redimensionner
                la taille et/ou utiliser le compresseur en ligne suivant : <a href="https://tinyjpg.fr">tinyjpg.fr</a>
            </Alert>
        </div>
        <div className="line special-line">
            <div className="form-group">
                <label>Photos</label>
            </div>
            <div className="items-table">
                <div className="items items-default">
                    <div className="item item-header">
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
                    </div>
                    {photos.map((el, index) => {

                        let src = el.is64 ? el.file : "path/" . el.file;

                        return (<div className={"item-drag item" + (el.isTrash ? " trash" : "")} key={index}
                                     draggable="true"
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
                                            <div className="name">
                                                {!el.isTrash ? (el.legend ? el.legend : <ButtonIcon icon="tag" text="Ajouter une légende" />) : "Supprimée"}
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