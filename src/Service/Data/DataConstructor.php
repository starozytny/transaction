<?php

namespace App\Service\Data;

use App\Service\SanitizeData;
use App\Service\ValidatorService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class DataConstructor
{
    protected $em;
    protected $registry;
    protected $validator;
    protected $sanitizeData;

    public function __construct(ManagerRegistry $registry, ValidatorService $validator, SanitizeData $sanitizeData)
    {
        $this->em = $registry->getManager("default");
        $this->registry = $registry;
        $this->validator = $validator;
        $this->sanitizeData = $sanitizeData;
    }

    /**
     * @throws Exception
     */
    protected function createDate($date, $timezone="Europe/Paris"): ?\DateTime
    {
        if($date == null || $date == ""){
            return null;
        }
        $date = new \DateTime($date);
        $date->setTimezone(new \DateTimeZone($timezone));

        return $date;
    }
}