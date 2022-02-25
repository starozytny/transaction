<?php

namespace App\Service\History;

use App\Entity\History\HiPrice;
use App\Entity\Immo\ImBien;
use App\Service\Data\DataConstructor;

class HistoryService extends DataConstructor
{
    public function createPrice(ImBien $bien)
    {
        $price = $bien->getFinancial()->getPrice();
        $existe = $this->em->getRepository(HiPrice::class)->findOneBy([
            'bienId' => $bien,
            'price' => $price
        ], ['createdAt' => 'DESC']);

        if(($existe && $existe->getPrice() != $price) || !$existe){
            $history = (new HiPrice())
                ->setBienId($bien->getId())
                ->setPrice($price)
            ;

            $this->em->persist($history);
            $this->em->flush();
        }
    }
}