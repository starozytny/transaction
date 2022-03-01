<?php

namespace App\Service\History;

use App\Entity\Agenda\AgEvent;
use App\Entity\History\HiPrice;
use App\Entity\History\HiVisite;
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

    public function createVisit($status, $bienId, $visitId, AgEvent $event, $prospects = [])
    {
        $history = (new HiVisite())
            ->setBienId($bienId)
            ->setVisiteId($visitId)
            ->setStatus($status)
            ->setFullDate($event->getFullDate())
            ->setName($event->getName())
            ->setLocation($event->getLocation())
            ->setProspects($prospects)
        ;

        $this->em->persist($history);
        $this->em->flush();
    }
}
