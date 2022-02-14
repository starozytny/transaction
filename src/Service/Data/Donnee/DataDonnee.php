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
            ->setPolygon($data->polygon ?: null)
        ;
    }
}