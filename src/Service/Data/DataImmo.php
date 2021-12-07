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
        $codeTypeAd     = $data->codeTypeAd;
        $codeTypeBien   = $data->codeTypeBien;

        // validation des données
        $paramsToValidate = [
            ['type' => 'text',  'name' => 'codeTypeAd',      'value' => $codeTypeAd],
            ['type' => 'text',  'name' => 'codeTypeBien',    'value' => $codeTypeBien]
        ];
        $noErrors = $this->validator->validateCustom($paramsToValidate);
        if ($noErrors !== true) {
            return $noErrors;
        }

        // Création de l'objet
        return ($obj)
            ->setSlug(null)
            ->setCodeTypeAd((int) $codeTypeAd)
            ->setCodeTypeBien((int) $codeTypeBien)
            ->setReference(substr(mb_strtoupper(uniqid().bin2hex(random_bytes(1))), 0, 10))
        ;
    }
}