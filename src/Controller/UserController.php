<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\Agenda\AgEventRepository;
use App\Repository\UserRepository;
use App\Service\Agenda\EventService;
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
    public function agenda(UserRepository $userRepository, AgEventRepository $repository, SerializerInterface $serializer, EventService $eventService): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findAll();
        $users = $userRepository->findAll();

        $data = $eventService->getEvents($objs, $user);

        $objs = $serializer->serialize($data, 'json', ['groups' => User::USER_READ]);
        $users = $serializer->serialize($users, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/agenda/index.html.twig', [
            'donnees' => $objs,
            'users' => $users
        ]);
    }
}
