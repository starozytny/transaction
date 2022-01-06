<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\Agenda\AgSlotRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre", name="user_")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        return $this->render('user/pages/index.html.twig');
    }

    /**
     * @Route("/profil", options={"expose"=true}, name="profil")
     */
    public function profil(): Response
    {
        /** @var User $obj */
        $obj = $this->getUser();

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj
        ]);
    }

    /**
     * @Route("/modifier-profil", name="profil_update")
     */
    public function profilUpdate(SerializerInterface $serializer): Response
    {
        /** @var User $data */
        $data = $this->getUser();
        $data = $serializer->serialize($data, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('user/pages/profil/update.html.twig',  ['donnees' => $data]);
    }

    /**
     * @Route("/agenda", name="agenda")
     */
    public function agenda(UserRepository $userRepository, AgSlotRepository $repository, SerializerInterface $serializer): Response
    {
        $objs = $repository->findBy(['creator' => $this->getUser()]);

//        $userIds = [];
//        foreach($objs as $obj){
//            $persons = json_decode($obj->getPersons());
//
//            if(isset($persons->users)){
//                foreach($persons->users as $el){
//                    if(!in_array($el->value, $userIds)){
//                        $userIds[] = $el->value;
//                    }
//
//                }
//            }
//        }
//        $users = $userRepository->findBy(['id' => $userIds]);
        $users = $userRepository->findAll();

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::USER_READ]);
        $users = $serializer->serialize($users, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/agenda/index.html.twig', [
            'donnees' => $objs,
            'users' => $users
        ]);
    }
}
