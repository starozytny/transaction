<?php

namespace App\Service\Data;

use App\Entity\Immo\ImBien;

class DataImmo extends DataConstructor
{
    public function setDataBien(ImBien $obj, $data)
    {
        $codeTypeAd = $data->codeTypeAd;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text', 'name' => 'codeTypeAd', 'value' => $codeTypeAd]
        ];
        $noErrors = $this->validator->validateCustom($paramsToValidate);
        if ($noErrors !== true) {
            return $noErrors;
        }

        // Création de l'objet
        return ($obj)
            ->setCodeTypeAd((int) $codeTypeAd)
        ;
    }
}