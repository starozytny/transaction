<?php


namespace App\Service\Data\Agenda;


use App\Entity\Agenda\AgSlot;
use App\Service\Data\DataConstructor;
use Exception;

class DataSlot extends DataConstructor
{
    /**
     * @throws Exception
     */
    public function setDataSlot(AgSlot $obj, $data): AgSlot
    {
        return ($obj)
            ->setName($this->sanitizeData->sanitizeString($data->name))
            ->setStartAt($this->createDate($data->startAt))
            ->setEndAt($this->createDate($data->endAt))
            ->setAllDay((int) $data->allDay[0])
            ->setLocation($this->sanitizeData->trimData($data->location))
            ->setComment($this->sanitizeData->trimData($data->comment))
            ->setStatus((int) $data->status)
            ->setPersons($this->sanitizeData->trimData($data->persons))
        ;
    }
}