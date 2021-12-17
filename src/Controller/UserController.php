<?php

namespace App\Controller;

use App\Entity\Immo\ImAgency;
use App\Entity\User;
use App\Repository\Immo\ImBienRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre", name="user_")
 */
class UserController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

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
     * @Route("/modifier-un-bien/{slug}",options={"expose"=true},  name="biens_update")
     */
    public function updateBien($slug, ImBienRepository $repository, SerializerInterface $serializer): Response
    {
        $element = $repository->findOneBy(["slug" => $slug]);
        $element = $serializer->serialize($element, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/biens/update.html.twig', ['element' => $element]);
    }

    /**
     * @Route("/profil", options={"expose"=true}, name="profil")
     */
    public function profil(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $obj */
        $obj = $this->getUser();

        $users    = $em->getRepository(User::class)->findBy(['society' => $obj->getSociety()]);
        $agencies = $em->getRepository(ImAgency::class)->findBy(['society' => $obj->getSociety()]);

        $users    = $serializer->serialize($users, 'json', ['groups' => User::ADMIN_READ]);
        $agencies = $serializer->serialize($agencies, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj,
            'users' => $users,
            'agencies' => $agencies,
        ]);
    }

    /**
     * @Route("/modifier-profil", name="profil_update")
     */
    public function profilUpdate(SerializerInterface $serializer): Response
    {
        /** @var User $obj */
        $obj = $this->getUser();
        $data = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('user/pages/profil/update.html.twig',  ['elem' => $obj, 'donnees' => $data]);
    }

    /**
     * @Route("/utilisateur/ajouter", options={"expose"=true}, name="user_create")
     *
     * @Security("is_granted('ROLE_MANAGER')")
     */
    public function userCreate(): Response
    {
        /** @var User $obj */
        $obj = $this->getUser();
        return $this->render('user/pages/profil/user/create.html.twig', ['elem' => $obj]);
    }

    /**
     * @Route("/utilisateur/modifier/{username}", options={"expose"=true}, name="user_update")
     *
     * @Security("is_granted('ROLE_MANAGER')")
     */
    public function userUpdate(User $obj, SerializerInterface $serializer): Response
    {
        $data = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('user/pages/profil/user/update.html.twig', ['elem' => $obj, 'donnees' => $data]);
    }
}
