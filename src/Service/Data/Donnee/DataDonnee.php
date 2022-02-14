<?php

namespace App\Service\Data\Donnee;

use App\Entity\Donnee\DoQuartier;
use App\Service\Data\DataConstructor;

class DataDonnee extends DataConstructor
{
    public function setDataQuartier(DoQuartier $obj, $data): DoQuartier
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setPolygon($data->polygon ?: null)
        ;
    }
}