<?php

namespace App\Service\Immo;

use App\Entity\Immo\ImBien;

class SearchService
{
    /**
     * @param $filter
     * @param ImBien[] $data
     * @param $min
     * @param $max
     * @return array
     */
    public function filterMinMax($filter, array $data, $min, $max): array
    {
        $nData = [];
        if($min != 0 && $max != 0){
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

                if(isset($value) && ($value >= $min && $value <= $max)){
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
                    $nData = $item;
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