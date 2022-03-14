<?php

namespace App\Service\History;

use App\Entity\Agenda\AgEvent;
use App\Entity\History\HiBien;
use App\Entity\History\HiPrice;
use App\Entity\History\HiVisite;
use App\Entity\Immo\ImBien;
use App\Entity\User;
use App\Service\Data\DataConstructor;
use Symfony\Component\Serializer\SerializerInterface;

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

    public function createBien(SerializerInterface $serializer, $old, ImBien $bien, User $user)
    {
        $history = (new HiBien())
            ->setBienId($bien->getId())
            ->setUserFullname($user->getFullname())
        ;

        $bien = $serializer->serialize($bien, 'json', ['groups' => User::USER_READ]);
        $bien = json_decode($bien, true);

        $differences = [];
        foreach ($old as $key => $value){
            if($key != "slug" && $key != "updatedAtString"){

                if($key == "area" || $key == "negotiator" || $key == "user" || $key == "number" || $key == "feature"
                    || $key == "advantage" || $key == "diag" || $key == "localisation" || $key == "financial"
                    || $key == "confidential" || $key == "advert" || $key == "mandat"
                ){

                    foreach ($value as $key2 => $value2){
                        if($key == "number"){
                            dump($key2, $value, $value2, $bien[$key][$key2]);
                        }
                        if($value2 != $bien[$key][$key2]){
                            $differences[] = [
                                "type" => $key . " - " . $key2,
                                "old" => $value2,
                                "new" => $bien[$key][$key2]
                            ];
                        }
                    }
                }else{
                    if($value != $bien[$key]){
                        $differences[] = [
                            "type" => $key,
                            "old" => $value,
                            "new" => $bien[$key]
                        ];
                    }
                }
            }
        }
        $history->setModifications($differences);

        if(count($differences) != 0){
            $this->em->persist($history);
        }
    }
}
