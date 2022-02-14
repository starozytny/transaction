<?php

namespace App\Service\Data\Donnee;

use App\Entity\Donnee\DoQuartier;
use App\Service\Data\DataConstructor;

class DataDonnee extends DataConstructor
{
    public function setDataQuartier(DoQuartier $obj, $data, $name = null): DoQuartier
    {
        $name = mb_strtoupper($this->sanitizeData->trimData($name ?: $data->name));
        $zipcode = $this->sanitizeData->trimData($data->zipcode);
        $city = $this->sanitizeData->trimData($data->city);

        if($name){
            $exist = $this->em->getRepository(DoQuartier::class)->findOneBy([
                'name' => $name,
                'zipcode' => $zipcode,
                'city' => $city,
                'isNative' => false
            ]);

            if($exist){
                $obj = $exist;
            }
        }

        return ($obj)
            ->setName($name)
            ->setZipcode($zipcode)
            ->setCity($city)
            ->setPolygon(isset($data->polygon) ? ($data->polygon ?: null) : null)
        ;
    }
}