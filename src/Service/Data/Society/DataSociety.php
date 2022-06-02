<?php


namespace App\Service\Data\Society;


use App\Entity\Society;
use App\Service\SanitizeData;

class DataSociety
{
    private $sanitizeData;

    public function __construct(SanitizeData $sanitizeData)
    {
        $this->sanitizeData = $sanitizeData;
    }

    public function setData(Society $obj, $data, $code): Society
    {
        return ($obj)
            ->setName(ucfirst($this->sanitizeData->sanitizeString($data->name)))
            ->setManager($this->sanitizeData->trimData($data->manager))
            ->setCode($code)
        ;
    }
}