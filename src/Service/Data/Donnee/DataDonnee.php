<?php

namespace App\Service\Data\Donnee;

use App\Entity\Donnee\DoQuartier;
use App\Service\Data\DataConstructor;

class DataDonnee extends DataConstructor
{
    public function setDataQuartier(DoQuartier $obj, $data, $name = null): DoQuartier
    {
        return ($obj)
            ->setName(mb_strtoupper($this->sanitizeData->trimData($name ?: $data->name)))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setPolygon(isset($data->polygon) ? ($data->polygon ?: null) : null)
        ;
    }
}