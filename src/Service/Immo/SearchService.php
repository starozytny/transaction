<?php

namespace App\Service\Immo;

use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImSearch;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;

class SearchService
{
    private $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    private function getEntityManager($nameManager): ObjectManager
    {
        return $this->registry->getManager($nameManager);
    }

    /**
     * @param ImBien[] $biens
     */
    public function getRapprochementBySearchs(array $biens, ImAgency $agency): array
    {
        $em = $this->getEntityManager($agency->getManager());
        $prospects = $em->getRepository(ImProspect::class)->findBy(['agency' => $agency, 'isArchived' => false]);

        //Rapprochement
        $rapprochements = [];
        foreach($biens as $obj){
            foreach($prospects as $prospect){
                $search = $prospect->getSearch();

                if($search && $search->getIsActive()){
                    $find = $this->rapprochement($search, [$obj]);

                    if(count($find) > 0){
                        $rapprochements[] = [
                            'bien' => $obj->getId(),
                            'prospect' => $search->getProspect()->getId()
                        ];
                    }
                }
            }
        }

        return $rapprochements;
    }

    /**
     * @param ImSearch $search
     * @param ImBien[] $biens
     * @param $data
     * @return ImBien[]|array
     */
    public function rapprochement(ImSearch $search, array $biens, $data = null): array
    {

        $biens = $this->filterCode('codeTypeAd',    $biens, $search->getCodeTypeAd());
        $biens = $this->filterCode('codeTypeBien',  $biens, $search->getCodeTypeBien());

        $biens = $this->filterLocalisation('zipcode', $biens, $search->getZipcode());
        $biens = $this->filterLocalisation('city',    $biens, $search->getCity());

        $biens = $this->filterAdvantage('lift',    $biens, $search->getHasLift());
        $biens = $this->filterAdvantage('terrace', $biens, $search->getHasTerrace());
        $biens = $this->filterAdvantage('balcony', $biens, $search->getHasBalcony());
        $biens = $this->filterAdvantage('parking', $biens, $search->getHasParking());
        $biens = $this->filterAdvantage('box',     $biens, $search->getHasBox());

        $biens = $this->filterMinMax('price', $biens, $search->getMinPrice(), $search->getMaxPrice(), $data ? $data->price ?? 0 : 0);
        $biens = $this->filterMinMax('piece', $biens, $search->getMinPiece(), $search->getMaxPiece(), $data ? $data->piece ?? 0 : 0);
        $biens = $this->filterMinMax('room',  $biens, $search->getMinRoom(),  $search->getMaxRoom(), $data ? $data->room ?? 0 : 0);
        $biens = $this->filterMinMax('area',  $biens, $search->getMinArea(),  $search->getMaxArea(), $data ? $data->area ?? 0 : 0);
        return $this->filterMinMax('land',  $biens, $search->getMinLand(),  $search->getMaxLand(), $data ? $data->land ?? 0 : 0);
    }

    /**
     * @param $filter
     * @param array $data
     * @param $search
     * @return array
     */
    public function filterCode($filter, array $data, $search): array
    {
        $nData = [];

        foreach($data as $item){
            switch ($filter){
                case "codeTypeAd":
                    $value = $item->getCodeTypeAd();
                    break;
                case "codeTypeBien":
                    $value = $item->getCodeTypeBien();
                    break;
                default:
                    break;
            }

            if(isset($value) && $value === $search){
                $nData[] = $item;
            }
        }

        return $nData;
    }

    /**
     * @param $filter
     * @param ImBien[] $data
     * @param $min
     * @param $max
     * @param int $delta
     * @return array
     */
    public function filterMinMax($filter, array $data, $min, $max, int $delta = 0): array
    {
        $nData = [];
        if($min != 0 || $max != 0){
            foreach($data as $item){
                switch ($filter){
                    case 'land':
                        $value = $item->getArea()->getLand();
                        break;
                    case 'area':
                        $value = $item->getArea()->getHabitable();
                        break;
                    case 'room':
                        $value = $item->getNumber()->getRoom();
                        break;
                    case 'piece':
                        $value = $item->getNumber()->getPiece();
                        break;
                    case 'price':
                        $value = $item->getFinancial()->getPrice();
                        break;
                    default:
                        break;
                }

                $min = ($min > $delta) ? $min - $delta : 0;
                $max = $min != 0 && $max == 0 ? 9999999999999999999 : $max;
                if(isset($value) && ($value >= $min && $value <= ($max + $delta))){
                    $nData[] = $item;
                }
            }
        }else{
            $nData = $data;
        }

        return $nData;
    }

    /**
     * @param $filter
     * @param ImBien[] $data
     * @param $search
     * @return array
     */
    public function filterLocalisation($filter, array $data, $search): array
    {
        $nData = [];
        if($search){
            foreach($data as $item){
                $value = $filter == "zipcode" ? $item->getLocalisation()->getZipcode() : $item->getLocalisation()->getCity();

                if($value == $search){
                    $nData[] = $item;
                }
            }
        }else{
            $nData = $data;
        }

        return $nData;
    }

    /**
     * @param $filter
     * @param ImBien[] $data
     * @param $search
     * @return array
     */
    public function filterAdvantage($filter, array $data, $search): array
    {
        $nData = [];
        if($search !== 99){
            foreach($data as $item){
                $advantage = $item->getAdvantage();
                $number    = $item->getNumber();

                switch ($filter){
                    case 'box':
                        $value = $this->convertToTrillean($number->getBox());
                        break;
                    case 'parking':
                        $value = $this->convertToTrillean($number->getParking());
                        break;
                    case 'balcony':
                        $value = $this->convertToTrillean($number->getBalcony());
                        break;
                    case 'terrace':
                        $value = $advantage->getHasTerrace();
                        break;
                    case 'lift':
                        $value = $advantage->getHasLift();
                        break;
                    default:
                        break;
                }

                if(isset($value) && ($value == $search || $value == 99)){
                    $nData[] = $item;
                }
            }
        }else{
            $nData = $data;
        }

        return $nData;
    }

    private function convertToTrillean($nb): int
    {
        return $nb ? ($nb > 1 ? 1 : 0) : 99;
    }
}
