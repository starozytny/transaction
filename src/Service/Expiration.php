<?php

namespace App\Service;

class Expiration
{
    private function getInterval($a, $b)
    {
        return date_diff($a, $b);
    }

    public function isExpiredBySecondes($a, $b, $value = 0): bool
    {
        $interval = $this->getInterval($a, $b);
        if($interval->s > $value || $interval->i > 0 || $interval->h > 0 || $interval->d > 0 || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByMinutes($a, $b, $value = 0): bool
    {
        $interval = $this->getInterval($a, $b);
        if($interval->i > $value || $interval->h > 0 || $interval->d > 0 || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByHours($a, $b, $value = 0): bool
    {
        $interval = $this->getInterval($a, $b);
        if($interval->h > $value || $interval->d > 0 || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByDays($a, $b, $value = 0): bool
    {
        $interval = $this->getInterval($a, $b);
        if($interval->d > $value || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByMonths($a, $b, $value = 0): bool
    {
        $interval = $this->getInterval($a, $b);
        if($interval->m > $value || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByYears($a, $b, $value = 0): bool
    {
        $interval = $this->getInterval($a, $b);
        if($interval->y > $value){
            return true;
        }

        return false;
    }
}