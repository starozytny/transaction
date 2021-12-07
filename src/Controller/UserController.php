<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\Immo\ImBienRepository;
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
     * @Route("/styleguide", name="styleguide")
     */
    public function styleguide(): Response
    {
        return $this->render('user/pages/styleguide/index.html.twig');
    }

    /**
     * @Route("/biens", options={"expose"=true}, name="biens")
     */
    public function biens(ImBienRepository $repository, SerializerInterface $serializer): Response
    {
        $objs = $repository->findAll();
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/biens/index.html.twig', ['data' => $objs]);
    }

    /**
     * @Route("/ajouter-un-bien", options={"expose"=true}, name="biens_create")
     */
    public function createBien(): Response
    {
        return $this->render('user/pages/biens/create.html.twig');
    }

    /**
     * @Route("/modifier-un-bien",options={"expose"=true},  name="biens_update")
     */
    public function updateBien(ImBienRepository $repository, SerializerInterface $serializer): Response
    {
//        $element = $repository->findOneBy();
//        $element = $serializer->serialize($element, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/biens/update.html.twig', ['element' => $element]);
    }
}
