<?php

namespace App\Service\Data;

use App\Service\SanitizeData;
use App\Service\ValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class DataConstructor
{
    protected $validator;
    protected $em;
    protected $sanitizeData;

    public function __construct(EntityManagerInterface $entityManager, ValidatorService $validator, SanitizeData $sanitizeData)
    {
        $this->validator = $validator;
        $this->em = $entityManager;
        $this->sanitizeData = $sanitizeData;
    }

    /**
     * @throws Exception
     */
    public function createDate($date, $timezone="Europe/Paris"): ?\DateTime
    {
        if($date == null || $date == ""){
            return null;
        }
        $date = new \DateTime($date);
        $date->setTimezone(new \DateTimeZone($timezone));

        return $date;
    }
}