<?php

namespace App\Service\Agenda;

use App\Entity\Agenda\AgEvent;
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

            if($obj->getCreator()->getId() == $user->getId()){ // creator of event
                $data[] = $obj;
            }else{

                // check visibilities of event
                $checkAll = false;
                $checkRelatedPeople = false;
                $checkUsers = false;
                foreach($obj->getVisibilities() as $visibility){
                    switch ($visibility){
                        case AgEvent::VISIBILITY_UTILISATEURS;
                            $checkUsers = true;
                            $checkRelatedPeople = true;
                            break;
                        case AgEvent::VISIBILITY_RELATED:
                            $checkRelatedPeople = true;
                            break;
                        case AgEvent::VISIBILITY_ALL:
                            $checkAll = true;
                            break;
                        default: // only me
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
                    if(count($persons["users"]) !== 0){
                        foreach($persons["users"] as $el){
                            if($el->value == $user->getId()){ // event related to user
                                if(!$alreadyAdded) {
                                    $data[] = $obj;
                                    $alreadyAdded = true;
                                }
                            }
                        }
                    }
                }


                if($checkUsers){
                    if($user->getHighRoleCode() == User::CODE_ROLE_USER){
                        if(!$alreadyAdded) { // event related to anybody
                            $data[] = $obj;
                            $alreadyAdded = true;
                        }
                    }
                }
            }
        }

        return $data;
    }
}