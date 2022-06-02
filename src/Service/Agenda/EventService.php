<?php

namespace App\Service\Agenda;

use App\Transaction\Entity\Agenda\AgEvent;
use App\Entity\User;

class EventService
{
    /**
     * @param AgEvent[] $objs
     * @param User $user
     * @return array
     */
    public function getEvents(array $objs, User $user): array
    {
        $data = [];
        foreach($objs as $obj){
            $persons = $obj->getPersons();

            if($obj->getCreator() == $user->getId()){ // creator of event
                $data[] = $obj;
            }else{

                // check visibilities of event
                $checkAll = false;
                $checkRelatedPeople = true;
                $checkUsers = false;
                $checkManager = false;
                foreach($obj->getVisibilities() as $visibility){
                    switch ($visibility){
                        case AgEvent::VISIBILITY_MANAGERS;
                            $checkManager = true;
                            break;
                        case AgEvent::VISIBILITY_UTILISATEURS;
                            $checkUsers = true;
                            break;
                        case AgEvent::VISIBILITY_RELATED:
                            break;
                        case AgEvent::VISIBILITY_ALL:
                            $checkAll = true;
                            $checkRelatedPeople = false;
                            break;
                        default: // only me
                            $checkRelatedPeople = false;
                            break;
                    }
                }

                //consequence visibilities
                $alreadyAdded = false;

                if($checkAll){
                    $data[] = $obj;
                    $alreadyAdded = true;
                }

                if($checkRelatedPeople){
                    foreach($persons["users"] as $el){
                        $el = json_decode(json_encode($el));
                        if($el->value == $user->getId()){ // event related to user
                            if(!$alreadyAdded) {
                                $data[] = $obj;
                                $alreadyAdded = true;
                            }
                        }
                    }
                }


                if($checkUsers){
                    if(!$alreadyAdded) {
                        $data[] = $obj;
                        $alreadyAdded = true;
                    }
                }

                if($checkManager){
                    if(($user->getHighRoleCode() === User::CODE_ROLE_MANAGER
                            || $user->getHighRoleCode() === User::CODE_ROLE_DEVELOPER
                            || $user->getHighRoleCode() === User::CODE_ROLE_ADMIN
                        ) && !$alreadyAdded) {
                        $data[] = $obj;
                        $alreadyAdded = true;
                    }
                }
            }
        }

        return $data;
    }
}