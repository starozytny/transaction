<?php

namespace App\Service\Data;

use App\Service\ValidatorService;
use Doctrine\ORM\EntityManagerInterface;

class DataConstructor
{
    protected $validator;
    protected $em;

    public function __construct(EntityManagerInterface $entityManager, ValidatorService $validator)
    {
        $this->validator = $validator;
        $this->em = $entityManager;
    }
}