<?php

namespace App\Service\Data;

use App\Entity\Mail;

class DataMail extends DataConstructor
{
    public function setData(Mail $obj, $data, $from): Mail
    {
        return ($obj)
            ->setSubject($this->sanitizeData->trimData($data->subject))
            ->setDestinators($this->setTab($data->to))
//            ->setTo($this->setTab($data->to))
//            ->setCc($this->setTab($data->cc))
//           ->setBcc($this->setTab($data->bcc))
            ->setExpeditor($this->sanitizeData->trimData($from))
            ->setMessage($this->sanitizeData->trimData($data->message->html))
        ;
    }

    private function setTab($data): array
    {
        $values = [];
        foreach ($data as $dest){
            $values[] = [
                'value' => $dest->value,
                'label' => $dest->label
            ];
        }

        return $values;
    }
}
