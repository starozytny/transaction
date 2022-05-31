<?php

namespace App\Service\Data\Donnee;

use App\Transaction\Entity\Donnee\DoQuartier;
use App\Transaction\Entity\Donnee\DoSol;
use App\Transaction\Entity\Donnee\DoSousType;
use App\Service\Data\DataConstructor;

class DataDonnee extends DataConstructor
{
    private function setNameSanitaze($data, $name = null)
    {
        return mb_strtoupper($this->sanitizeData->trimData($name ?: $data->name));
    }

    public function setDataQuartier(DoQuartier $obj, $data, $name = null): DoQuartier
    {
        $name = $this->setNameSanitaze($data, $name);
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

    public function setDataSol(DoSol $obj, $data, $name = null): DoSol
    {
        $name = $this->setNameSanitaze($data, $name);

        if($name){
            $exist = $this->em->getRepository(DoSol::class)->findOneBy([
                'name' => $name,
                'isNative' => false
            ]);

            if($exist){
                $obj = $exist;
            }
        }

        return ($obj)
            ->setName($name)
        ;
    }

    public function setDataSousType(DoSousType $obj, $data, $name = null): DoSousType
    {
        $name = $this->setNameSanitaze($data, $name);

        if($name){
            $exist = $this->em->getRepository(DoSousType::class)->findOneBy([
                'name' => $name,
                'isNative' => false
            ]);

            if($exist){
                $obj = $exist;
            }
        }

        return ($obj)
            ->setName($name)
            ;
    }
}