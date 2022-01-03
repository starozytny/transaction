<?php

namespace App\Controller;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOwner;
use App\Entity\Immo\ImTenant;
use App\Entity\User;
use App\Repository\Immo\ImBienRepository;
use App\Repository\Immo\ImOwnerRepository;
use App\Repository\Immo\ImTenantRepository;
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
     * Common return createBien and updateBien
     */
    private function formBien(SerializerInterface $serializer, $route, $element = null, $tenants = "[]"): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);
        $allOwners = $em->getRepository(ImOwner::class)->findBy(['agency' => $user->getAgency()]);
        $allTenants = $em->getRepository(ImTenant::class)->findBy(['agency' => $user->getAgency()]);

        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);
        $allOwners = $serializer->serialize($allOwners, 'json', ['groups' => User::ADMIN_READ]);
        $allTenants = $serializer->serialize($allTenants, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render($route, [
            'element' => $element,
            'tenants' => $tenants,
            'negotiators' => $negotiators,
            'allOwners' => $allOwners,
            'allTenants' => $allTenants,
            'user' => $user,
        ]);
    }

    /**
     * @Route("/ajouter-un-bien", options={"expose"=true}, name="biens_create")
     */
    public function createBien(SerializerInterface $serializer): Response
    {
        return $this->formBien($serializer, 'user/pages/biens/create.html.twig');
    }

    /**
     * @Route("/modifier-un-bien/{slug}",options={"expose"=true},  name="biens_update")
     */
    public function updateBien($slug, ImBienRepository $repository, ImTenantRepository $tenantRepository, SerializerInterface $serializer): Response
    {
        $element = $repository->findOneBy(["slug" => $slug]);
        $tenants = $tenantRepository->findBy(["bien" => $element]);

        $element = $serializer->serialize($element, 'json', ['groups' => User::USER_READ]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => ImBien::BIEN_TENANTS_READ]);

        return $this->formBien($serializer, 'user/pages/biens/update.html.twig', $element, $tenants);
    }

    /**
     * @Route("/compte", options={"expose"=true}, name="profil")
     */
    public function profil(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $obj */
        $obj = $this->getUser();

        $users       = $em->getRepository(User::class)->findBy(['society' => $obj->getSociety()]);
        $agencies    = $em->getRepository(ImAgency::class)->findBy(['society' => $obj->getSociety()]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $agencies]);

        $users       = $serializer->serialize($users, 'json', ['groups' => User::ADMIN_READ]);
        $agencies    = $serializer->serialize($agencies, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj,
            'users' => $users,
            'agencies' => $agencies,
            'negotiators' => $negotiators
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

    /**
     * @Route("/proprietaires", name="owners")
     */
    public function owners(ImOwnerRepository $repository, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findBy(['agency' => $user->getAgency()]);
        $biens = $em->getRepository(ImBien::class)->findBy(['owner' => $objs]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);
        $biens = $serializer->serialize($biens, 'json', ['groups' => ImBien::TOTAL_READ_BY_OWNER]);

        return $this->render('user/pages/owners/index.html.twig', [
            'data' => $objs,
            'user' => $user,
            'negotiators' => $negotiators,
            'biens' => $biens,
        ]);
    }

    /**
     * @Route("/locataires", name="tenants")
     */
    public function tenants(ImTenantRepository $repository, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findBy(['agency' => $user->getAgency()]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/tenants/index.html.twig', [
            'data' => $objs,
            'user' => $user,
            'negotiators' => $negotiators
        ]);
    }
}
