<?php

namespace App\Controller;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOwner;
use App\Entity\Immo\ImPhoto;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImRoom;
use App\Entity\Immo\ImSearch;
use App\Entity\Immo\ImSuivi;
use App\Entity\Immo\ImTenant;
use App\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Repository\Immo\ImBienRepository;
use App\Repository\Immo\ImBuyerRepository;
use App\Repository\Immo\ImOwnerRepository;
use App\Repository\Immo\ImProspectRepository;
use App\Repository\Immo\ImTenantRepository;
use App\Repository\UserRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use App\Repository\Agenda\AgEventRepository;
use App\Service\Agenda\EventService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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
    public function index(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $biensAgency    = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgency()]);
        $biensArchived  = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgency(), 'status' => ImBien::STATUS_ARCHIVE]);
        $biensUsers     = $em->getRepository(ImBien::class)->findBy(['user' => $user]);
        $biensActif     = $em->getRepository(ImBien::class)->findBy(['user' => $user, 'status' => ImBien::STATUS_ACTIF]);
        $biensInactif   = $em->getRepository(ImBien::class)->findBy(['user' => $user, 'status' => ImBien::STATUS_INACTIF]);
        $biensDraft     = $em->getRepository(ImBien::class)->findBy(['user' => $user, 'isDraft' => true]);

        $visits = $em->getRepository(ImVisit::class)->findBy(['bien' => $biensUsers]);

        $visits = $serializer->serialize($visits, 'json', ['groups' => ImVisit::VISIT_READ]);

        return $this->render('user/pages/index.html.twig', [
            'biensAgency' => abs(count($biensAgency) - count($biensArchived)),
            'biensArchived' => count($biensArchived),
            'biensActif' => count($biensActif),
            'biensInactif' => count($biensInactif),
            'biensDraft' => count($biensDraft),
            'visits' => $visits
        ]);
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
    public function biens(Request $request, ImBienRepository $repository, ImTenantRepository $tenantRepository,
                          SerializerInterface $serializer): Response
    {
        $status = $request->query->get('st');
        $draft = $request->query->get('dr');
        $filterOwner = $request->query->get('fo');
        $filterTenant = $request->query->get('ft');
        $filterNego = $request->query->get('fn');
        $filterUser = $request->query->get('fu');

        /** @var User $user */
        $user = $this->getUser();

        if($status == null){
            if($draft){
                $objs = $repository->findBy(['agency' => $user->getAgency(), 'isDraft' => true]);
            }else{
                $objs = $repository->findBy(['agency' => $user->getAgency()]);
            }

        }else{
            $objs = $repository->findBy(['agency' => $user->getAgency(), 'status' => (int) $status, 'isDraft' => (bool)$draft]);
        }

        $tenants = $tenantRepository->findBy(['bien' => $objs]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::USER_READ]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/biens/index.html.twig', [
            'data' => $objs,
            'tenants' => $tenants,
            'filterOwner' => $filterOwner,
            'filterTenant' => $filterTenant,
            'filterNego' => $filterNego,
            'filterUser' => $filterUser,
            'st' => $status,
            'dr' => $draft
        ]);
    }

    /**
     * Common return createBien and updateBien
     */
    private function formBien(SerializerInterface $serializer, $route, $element = null, $tenants = "[]", $rooms = "[]", $photos="[]"): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);
        $allOwners = $em->getRepository(ImOwner::class)->findBy(['agency' => $user->getAgency()]);

        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);
        $allOwners = $serializer->serialize($allOwners, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render($route, [
            'element' => $element,
            'tenants' => $tenants,
            'rooms' => $rooms,
            'photos' => $photos,
            'negotiators' => $negotiators,
            'allOwners' => $allOwners,
            'user' => $user,
        ]);
    }

    private function bienData($type, Request $request, SerializerInterface $serializer, $slug): Response
    {
        $em = $this->doctrine->getManager();
        $obj = $em->getRepository(ImBien::class)->findOneBy(["slug" => $slug]);
        $tenants = $em->getRepository(ImTenant::class)->findBy(["bien" => $obj]);
        $photos = $em->getRepository(ImPhoto::class)->findBy(["bien" => $obj]);
        $rooms = $em->getRepository(ImRoom::class)->findBy(["bien" => $obj]);

        $element = $serializer->serialize($obj, 'json', ['groups' => User::USER_READ]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => User::ADMIN_READ]);
        $rooms   = $serializer->serialize($rooms,   'json', ['groups' => User::USER_READ]);
        $photos  = $serializer->serialize($photos,  'json', ['groups' => User::USER_READ]);

        if($type !== "update"){
            $context = $request->query->get("ct");
            $suivis = $em->getRepository(ImSuivi::class)->findBy(['bien' => $obj]);
            $visits = $em->getRepository(ImVisit::class)->findBy(['bien' => $obj]);
            $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj->getAgency()]);

            $prospects = [];
            foreach($suivis as $suivi){
                $prospects[] = $suivi->getProspect();
            }
            $prospects      = $serializer->serialize($prospects,    'json', ['groups' => User::ADMIN_READ]);
            $negotiators    = $serializer->serialize($negotiators,  'json', ['groups' => User::ADMIN_READ]);
            $visits         = $serializer->serialize($visits,       'json', ['groups' => ImVisit::VISIT_READ]);
        }

        return $type === "update" ? $this->formBien($serializer, 'user/pages/biens/update.html.twig',
            $element, $tenants, $rooms, $photos)
            : $this->render($type === "read" ? "user/pages/biens/read.html.twig" : "user/pages/biens/suivi.html.twig", [
                'elem' => $obj,
                'data' => $element,
                'tenants' => $tenants,
                'rooms' => $rooms,
                'photos' => $photos,
                'prospects' => $prospects,
                'negotiators' => $negotiators,
                'visits' => $visits,
                'context' => $context
        ]);
    }

    /**
     * @Route("/biens/bien/ajouter", options={"expose"=true}, name="biens_create")
     */
    public function createBien(SerializerInterface $serializer): Response
    {
        return $this->formBien($serializer, 'user/pages/biens/create.html.twig');
    }

    /**
     * @Route("/biens/bien/modifier/{slug}",options={"expose"=true}, name="biens_update")
     */
    public function updateBien(Request $request, $slug, SerializerInterface $serializer): Response
    {
        return $this->bienData("update", $request, $serializer, $slug);
    }

    /**
     * @Route("/biens/bien/details/{slug}",options={"expose"=true}, name="biens_read")
     */
    public function readBien(Request $request, $slug, SerializerInterface $serializer): Response
    {
        return $this->bienData("read", $request, $serializer, $slug);
    }

    /**
     * @Route("/biens/bien/suivi/{slug}",options={"expose"=true}, name="biens_suivi")
     */
    public function suiviBien(Request $request, $slug, SerializerInterface $serializer): Response
    {
        return $this->bienData("suivi", $request, $serializer, $slug);
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
        $biens       = $em->getRepository(ImBien::class)->findBy(['agency' => $agencies]);

        $users       = $serializer->serialize($users, 'json', ['groups' => User::ADMIN_READ]);
        $agencies    = $serializer->serialize($agencies, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);
        $biens       = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj,
            'users' => $users,
            'agencies' => $agencies,
            'negotiators' => $negotiators,
            'biens' => $biens
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
    public function owners(Request $request, ImOwnerRepository $repository, SerializerInterface $serializer): Response
    {
        $route = 'user/pages/owners/index.html.twig';

        $em = $this->doctrine->getManager();
        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findBy(['agency' => $user->getAgency()]);
        $biens = $em->getRepository(ImBien::class)->findBy(['owner' => $objs]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);
        $biens = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);

        $params = [
            'data' => $objs,
            'user' => $user,
            'negotiators' => $negotiators,
            'biens' => $biens,
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
    }

    /**
     * Return render and route for tenant, prospects, buyers...
     *
     * @param Request $request
     * @param SerializerInterface $serializer
     * @param $repository
     * @param $routeName
     * @return Response
     */
    private function getDataPersons(Request $request, SerializerInterface $serializer, $repository, $routeName): Response
    {
        $em = $this->doctrine->getManager();

        $getArchived = (bool)$request->query->get('ar');

        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findBy(['agency' => $user->getAgency(), 'isArchived' => $getArchived]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        $route = "user/pages/" . $routeName . "/" . ($getArchived ? "archived" : "index") . ".html.twig";
        $params = [
            'data' => $objs,
            'user' => $user,
            'negotiators' => $negotiators
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
    }

    /**
     * @Route("/locataires", name="tenants")
     */
    public function tenants(Request $request, ImTenantRepository $repository, SerializerInterface $serializer): Response
    {
        return $this->getDataPersons($request, $serializer, $repository, "tenants");
    }

    /**
     * @Route("/prospects", options={"expose"=true}, name="prospects")
     */
    public function prospects(Request $request, ImProspectRepository $repository, SerializerInterface $serializer): Response
    {
        return $this->getDataPersons($request, $serializer, $repository, "prospects");
    }

    /**
     * @Route("/acquereurs", name="buyers")
     */
    public function buyers(Request $request, ImBuyerRepository $repository, SerializerInterface $serializer): Response
    {
        return $this->getDataPersons($request, $serializer, $repository, "buyers");
    }

    /**
     * @Route("/agenda", name="agenda")
     */
    public function agenda(AgEventRepository $repository, SerializerInterface $serializer, EventService $eventService): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findAll();
        $data = $eventService->getEvents($objs, $user);
        $objs = $serializer->serialize($data, 'json', ['groups' => User::AGENDA_READ]);

        return $this->render('user/pages/agenda/index.html.twig', [
            'donnees' => $objs,
        ]);
    }

    /**
     * @Route("/prospects/prospect/{id}/recherches", options={"expose"=true}, name="prospects_searchs")
     */
    public function searchs(ImProspect $obj, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $objs    = $em->getRepository(ImSearch::class)->findBy(['prospect' => $obj]);
        $follows = $em->getRepository(ImSuivi::class)->findBy(['prospect' => $obj]);

        $objs    = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $follows = $serializer->serialize($follows, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/searchs/index.html.twig', [
            'elem' => $obj,
            'donnees' => $objs,
            'follows' => $follows,
        ]);
    }

    /**
     * @Route("/boite-reception/envoyer", options={"expose"=true}, name="mails_send")
     */
    public function mailsSend(Request $request, UserRepository $userRepository, SerializerInterface $serializer): Response
    {
        $dest = $request->query->get('dest');

        /** @var User $user */
        $user = $this->getUser();
        $users = $userRepository->findBy(['agency' => $user->getAgency()]);

        $users = $serializer->serialize($users, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/mails/send.html.twig', [
            'users' => $users,
            'dest' => $dest
        ]);
    }


    /**
     * @Route("/visites", options={"expose"=true}, name="visites")
     */
    public function visits(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $biens   = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgency()]);
        $objs    = $em->getRepository(ImVisit::class)->findBy(['bien' => $biens]);

        $objs    = $serializer->serialize($objs, 'json', ['groups' => ImVisit::VISIT_READ]);

        return $this->render('user/pages/visits/index.html.twig', [
            'donnees' => $objs,
        ]);
    }
}
