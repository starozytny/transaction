<?php

namespace App\Service\Data;

use App\Entity\Mail;

class DataMail extends DataConstructor
{
    public function setData(Mail $obj, $data): Mail
    {
        return ($obj)
            ->setSubject($this->sanitizeData->trimData($data->subject))
            ->setDestinators($data->destinators)
            ->setExpeditor($this->sanitizeData->trimData($data->expeditor))
            ->setMessage($this->sanitizeData->trimData($data->message->html))
        ;
    }
}
