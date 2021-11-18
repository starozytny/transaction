<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
     * @Route("/biens", name="biens")
     */
    public function biens(): Response
    {
        return $this->render('user/pages/biens/index.html.twig');
    }

    /**
     * @Route("/ajouter-un-bien", name="biens_create_view")
     */
    public function createBienView(): Response
    {
        return $this->render('user/pages/biens/create.html.twig');
    }
}
