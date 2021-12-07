<?php

namespace App\Service\Data;

use App\Entity\Immo\ImBien;
use Exception;

class DataImmo extends DataConstructor
{
    /**
     * @throws Exception
     */
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
            ->setSlug(null)
            ->setCodeTypeAd((int) $codeTypeAd)
            ->setReference(substr(mb_strtoupper(uniqid().bin2hex(random_bytes(1))), 0, 10))
        ;
    }
}