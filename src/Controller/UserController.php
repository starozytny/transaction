<?php

namespace App\Controller;

use App\Entity\Changelog;
use App\Entity\Immo\ImContractant;
use App\Entity\Immo\ImProspect;
use App\Entity\Mail;
use App\Entity\Donnee\DoQuartier;
use App\Entity\Donnee\DoSol;
use App\Entity\Donnee\DoSousType;
use App\Entity\History\HiVisite;
use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImContract;
use App\Entity\Immo\ImNegotiator;
use App\Entity\Immo\ImOffer;
use App\Entity\Immo\ImOwner;
use App\Entity\Immo\ImPhoto;
use App\Entity\Immo\ImPublish;
use App\Entity\Immo\ImRoom;
use App\Entity\Immo\ImSettings;
use App\Entity\Immo\ImStat;
use App\Entity\Immo\ImSuivi;
use App\Entity\Immo\ImSupport;
use App\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Repository\Immo\ImNegotiatorRepository;
use App\Repository\Immo\ImSettingsRepository;
use App\Service\MailerService;
use Doctrine\Common\Persistence\ManagerRegistry;
use App\Repository\Immo\ImOwnerRepository;
use App\Repository\Immo\ImProspectRepository;
use App\Repository\Immo\ImTenantRepository;
use App\Repository\UserRepository;
use App\Service\Immo\SearchService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use App\Repository\Agenda\AgEventRepository;
use App\Service\Agenda\EventService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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

    private function getDonneeData($em, $class, User $user, ?SerializerInterface $serializer, $group = User::DONNEE_READ)
    {
        $natives = $em->getRepository($class)->findBy(['isNative' => true]);
        $customs = $em->getRepository($class)->findBy(['agency' => $user->getAgency()]);
        $data = array_merge($natives, $customs);

        if($serializer){
            $data = $serializer->serialize($data, 'json', ['groups' => $group]);
        }

        return $data;
    }

    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $changelogs     = $em->getRepository(Changelog::class)->findBy(['isPublished' => true], ['createdAt' => 'DESC'], 5);
        $biensAgency    = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgency(), 'status' => ImBien::STATUS_ACTIF, 'isArchived' => false, 'isDraft' => false]);
        $biensVisits    = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgency()]);
        $biensUser      = $em->getRepository(ImBien::class)->findBy(['user' => $user, 'isArchived' => false, 'isDraft' => false]);
        $biensDraft     = $em->getRepository(ImBien::class)->findBy(['user' => $user,  'isArchived' => false, 'isDraft' => true]);
        $stats          = $em->getRepository(ImStat::class)->findBy(['agency' => $user->getAgency()], ['createdAt' => 'DESC']);
        $visits         = $em->getRepository(ImVisit::class)->findBy(['bien' => $biensVisits]);
        $statsAds       = $em->getRepository(ImStat::class)->findBy(['agency' => $user->getAgency()], ['publishedAt' => 'ASC'], 7);

        $lastPublish = null;

        foreach($stats as $stat){
            if($lastPublish == null && $stat->getPublishedAt()){
                $lastPublish = $stat->getPublishedAtString();
                break;
            }
        }


        $visits   = $serializer->serialize($visits, 'json', ['groups' => ImVisit::VISIT_READ]);
        $statsAds = $serializer->serialize($statsAds, 'json', ['groups' => ImStat::STAT_READ]);

        return $this->render('user/pages/index.html.twig', [
            'changelogs' => $changelogs,
            'biensAgency' => count($biensAgency),
            'biensUser' => count($biensUser),
            'biensDraft' => count($biensDraft),
            'visits' => $visits,
            'stats' => $stats,
            'lastPublish' => $lastPublish,
            'statsAds' => $statsAds
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
    public function biens(Request $request, SerializerInterface $serializer, SearchService $searchService): Response
    {
        $em = $this->doctrine->getManager();

        $status = $request->query->get('st');
        $filterNego = $request->query->get('fn');
        $filterUser = $request->query->get('fu');

        /** @var User $user */
        $user = $this->getUser();
        $agencies = $em->getRepository(ImAgency::class)->findBy(['society' => $user->getSociety()]);

        if($status == null){
            $objs = $em->getRepository(ImBien::class)->findBy(['agency' => $agencies]);
        }else{
            $objs = $em->getRepository(ImBien::class)->findBy(['agency' => $agencies, 'status' => (int) $status]);
        }

        $rapprochements = $searchService->getRapprochementBySearchs($objs, $user->getAgency());
        $suivis         = $em->getRepository(ImSuivi::class)->findByStatusProcessAndBiens($objs);
        $contrats       = $em->getRepository(ImContract::class)->findBy(['bien' => $objs, 'status' => ImContract::STATUS_PROCESSING]);
        $contractants   = $em->getRepository(ImContractant::class)->findBy(['contract' => $contrats]);

        $objs           = $serializer->serialize($objs, 'json', ['groups' => User::USER_READ]);
        $suivis         = $serializer->serialize($suivis, 'json', ['groups' => ImSuivi::SUIVI_READ]);
        $contractants   = $serializer->serialize($contractants, 'json', ['groups' => ImContractant::CONTRACTANT_OWNER_READ]);

        return $this->render('user/pages/biens/index.html.twig', [
            'user' => $user,
            'data' => $objs,
            'st' => $status,
            'filterNego' => $filterNego,
            'filterUser' => $filterUser,
            'rapprochements' => json_encode($rapprochements),
            'suivis' => $suivis,
            'contractants' => $contractants,
        ]);
    }

    /**
     * @Route("/biens/carte", name="biens_map")
     */
    public function carte(Request $request, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $objs = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgency(), 'status' => ImBien::STATUS_ACTIF]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/biens/map.html.twig', [
            'user' => $user,
            'data' => $objs,
        ]);
    }

    /**
     * Common return createBien and updateBien
     */
    private function formBien(SerializerInterface $serializer, $route, $obj = null, $element = null, $rooms = "[]", $photos="[]"): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $negotiators  = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);
        $allOwners    = $em->getRepository(ImOwner::class)->findBy(['agency' => $user->getAgency()]);
        $settings     = $em->getRepository(ImSettings::class)->findOneBy(['agency' => $user->getAgency()]);
        $allSupports  = $em->getRepository(ImSupport::class)->findBy(['agency' => $user->getAgency()]);
        $publishes    = $em->getRepository(ImPublish::class)->findBy(['bien' => $obj]);
        $contracts    = $em->getRepository(ImContract::class)->findBy(['bien' => $obj, 'status' => ImContract::STATUS_PROCESSING]);
        $contractants = $em->getRepository(ImContractant::class)->findBy(['contract' => $contracts]);

        $owners = [];
        foreach($contractants as $contractant){
            $owners[] = $contractant->getOwner();
        }

        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);
        $owners      = $serializer->serialize($owners, 'json', ['groups' => User::ADMIN_READ]);
        $allOwners   = $serializer->serialize($allOwners, 'json', ['groups' => User::ADMIN_READ]);
        $settings    = $serializer->serialize($settings,'json', ['groups' => User::USER_READ]);
        $allSupports = $serializer->serialize($allSupports,'json', ['groups' => User::USER_READ]);
        $publishes   = $serializer->serialize($publishes,'json', ['groups' => ImPublish::PUBLISH_READ]);

        $quartiers = $this->getDonneeData($em, DoQuartier::class, $user, $serializer);
        $sols      = $this->getDonneeData($em, DoSol::class, $user, $serializer);
        $sousTypes = $this->getDonneeData($em, DoSousType::class, $user, $serializer);

        return $this->render($route, [
            'element' => $element,
            'rooms' => $rooms,
            'photos' => $photos,
            'negotiators' => $negotiators,
            'owners' => $owners,
            'allOwners' => $allOwners,
            'settings' => $settings,
            'user' => $user,
            'quartiers' => $quartiers,
            'sols' => $sols,
            'sousTypes' => $sousTypes,
            'allSupports' => $allSupports,
            'publishes' => $publishes,
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
        $em = $this->doctrine->getManager();

        $obj     = $em->getRepository(ImBien::class)->findOneBy(["slug" => $slug]);
        $photos  = $em->getRepository(ImPhoto::class)->findBy(["bien" => $obj]);
        $rooms   = $em->getRepository(ImRoom::class)->findBy(["bien" => $obj]);

        $element = $serializer->serialize($obj, 'json', ['groups' => User::USER_READ]);
        $photos  = $serializer->serialize($photos,  'json', ['groups' => User::USER_READ]);
        $rooms   = $serializer->serialize($rooms,   'json', ['groups' => User::USER_READ]);

        return $this->formBien($serializer, 'user/pages/biens/update.html.twig', $obj, $element, $rooms, $photos);
    }

    /**
     * @Route("/biens/bien/suivi/{slug}",options={"expose"=true}, name="biens_suivi")
     */
    public function suiviBien(Request $request, $slug, SerializerInterface $serializer, SearchService $searchService): Response
    {
        $em = $this->doctrine->getManager();
        $context     = $request->query->get("ct");
        $contextRapp = $request->query->get('ctra');

        $obj       = $em->getRepository(ImBien::class)->findOneBy(["slug" => $slug]);
        $photos    = $em->getRepository(ImPhoto::class)->findBy(["bien" => $obj]);
        $rooms     = $em->getRepository(ImRoom::class)->findBy(["bien" => $obj]);
        $visits    = $em->getRepository(ImVisit::class)->findBy(['bien' => $obj]);
        $suivis    = $em->getRepository(ImSuivi::class)->findBy(['bien' => $obj]);
        $offers    = $em->getRepository(ImOffer::class)->findBy(['bien' => $obj]);
        $contracts = $em->getRepository(ImContract::class)->findBy(['bien' => $obj]);
        $contractants = $em->getRepository(ImContractant::class)->findBy(['contract' => $contracts]);

        $element      = $serializer->serialize($obj,       'json', ['groups' => User::USER_READ]);
        $photos       = $serializer->serialize($photos,    'json', ['groups' => User::USER_READ]);
        $rooms        = $serializer->serialize($rooms,     'json', ['groups' => User::USER_READ]);
        $suivis       = $serializer->serialize($suivis,    'json', ['groups' => ImSuivi::SUIVI_READ]);
        $visits       = $serializer->serialize($visits,    'json', ['groups' => ImVisit::VISIT_READ]);
        $offers       = $serializer->serialize($offers,    'json', ['groups' => ImOffer::OFFER_READ]);
        $contracts    = $serializer->serialize($contracts, 'json', ['groups' => ImContract::CONTRACT_READ]);
        $contractants = $serializer->serialize($contractants, 'json', ['groups' => ImContractant::CONTRACTANT_OWNER_READ]);

        $historiesVisits = $em->getRepository(HiVisite::class)->findBy(['bienId' => $obj->getId()], ['createdAt' => 'DESC']);
        $historiesVisits = $serializer->serialize($historiesVisits, 'json', ['groups' => HiVisite::HISTORY_VISITE]);
        $rapprochements  = $searchService->getRapprochementBySearchs([$obj], $obj->getAgency());
        $rapprochements  = json_encode($rapprochements);

        return $this->render("user/pages/biens/suivi.html.twig", [
            'context' => $context,
            'ctRa' => $contextRapp ?: "tous",
            'elem' => $obj,
            'data' => $element,
            'rooms' => $rooms,
            'photos' => $photos,
            'suivis' => $suivis,
            'visits' => $visits,
            'offers' => $offers,
            'contracts' => $contracts,
            'rapprochements' => $rapprochements,
            'historiesVisits' => $historiesVisits,
            'contractants' => $contractants,
        ]);
    }

    /**
     * @Route("/compte", options={"expose"=true}, name="profil")
     */
    public function profil(Request $request, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();
        $context = $request->query->get('ct');

        /** @var User $obj */
        $obj = $this->getUser();

        $users       = $em->getRepository(User::class)->findBy(['agency' => $obj->getAgency()]);
        $agencies    = $em->getRepository(ImAgency::class)->findBy(['society' => $obj->getSociety()]);

        $users       = $serializer->serialize($users, 'json', ['groups' => User::ADMIN_READ]);
        $agencies    = $serializer->serialize($agencies, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj,
            'users' => $users,
            'agencies' => $agencies,
            'context' => $context ?: 'users'
        ]);
    }

    /**
     * @Route("/modifier-profil", name="profil_update")
     */
    public function profilUpdate(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $obj */
        $obj = $this->getUser();
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj->getAgency()]);

        $data = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/update.html.twig',  ['elem' => $obj, 'donnees' => $data, 'negotiators' => $negotiators]);
    }

    /**
     * @Route("/boite-mails", name="mails")
     */
    public function mails(MailerService $mailerService): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = $mailerService->getAllMailsData($user);

        return $this->render('user/pages/mails/index.html.twig', $data);
    }

    /**
     * @Route("/boite-mails/document/{filename}", options={"expose"=true}, name="mails_attachement")
     */
    public function mailsAttachement($filename): BinaryFileResponse
    {
        return new BinaryFileResponse($this->getParameter('private_directory') . Mail::FOLDER_FILES . "/" . $filename);
    }

    /**
     * @Route("/utilisateur/ajouter", options={"expose"=true}, name="user_create")
     *
     * @Security("is_granted('ROLE_MANAGER')")
     */
    public function userCreate(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $obj */
        $obj = $this->getUser();
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj->getAgency()]);

        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/user/create.html.twig', ['elem' => $obj, 'negotiators' => $negotiators]);
    }

    /**
     * @Route("/utilisateur/modifier/{username}", options={"expose"=true}, name="user_update")
     *
     * @Security("is_granted('ROLE_MANAGER')")
     */
    public function userUpdate(User $obj, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj->getAgency()]);

        $data = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/user/update.html.twig', ['elem' => $obj, 'donnees' => $data, 'negotiators' => $negotiators]);
    }

    /**
     * @Route("/negociateurs", name="negotiators")
     */
    public function negotiators(Request $request, ImNegotiatorRepository $repository, SerializerInterface $serializer): Response
    {
        $route = 'user/pages/negotiators/index.html.twig';

        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $agencies = $em->getRepository(ImAgency::class)->findBy(['society' => $user->getSociety()]);
        $objs = $repository->findBy(['agency' => $agencies]);
        $biens = $em->getRepository(ImBien::class)->findBy(['negotiator' => $objs, 'status' => ImBien::STATUS_ACTIF]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $biens = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);

        $params = [
            'data' => $objs,
            'user' => $user,
            'biens' => $biens,
        ];

        $search = $request->query->get('search');
        if($search){
            return $this->render($route, array_merge($params, ['search' => $search]));
        }

        return $this->render($route, $params);
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
        $contractants = $em->getRepository(ImContractant::class)->findBy(['owner' => $objs]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);

        $biens = [];
        foreach($contractants as $contractant) {
            $biens[] = [
                'ownerId' => $contractant->getOwner()->getId(),
                'bien' => $contractant->getContract()->getBien()
            ];
        }

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
     * @Route("/prospects-{type}", options={"expose"=true}, name="prospects")
     */
    public function prospects(Request $request, $type, ImProspectRepository $repository, SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        $getArchived = (bool)$request->query->get('ar');

        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findBy(['agency' => $user->getAgency(), 'isArchived' => $getArchived]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);

        $data = [];
        foreach($objs as $obj){
            switch ($type){
                case "locataires":
                    if($obj->getType() != ImProspect::TYPE_VENTE && $obj->getType() != ImProspect::TYPE_INVEST){
                        $data[] = $obj;
                    }
                    break;
                case "acquereurs":
                    if($obj->getType() != ImProspect::TYPE_LOCATION){
                        $data[] = $obj;
                    }
                    break;
                default:
                    break;
            }
        }

        $objs = $serializer->serialize($data, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        $route = "user/pages/prospects/" . ($getArchived ? "archived" : "index") . ".html.twig";
        $params = [
            'type' => $type,
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
        $em = $this->doctrine->getManager();

        $getArchived = (bool)$request->query->get('ar');

        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findBy(['agency' => $user->getAgency(), 'isArchived' => $getArchived]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgency()]);

        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        $route = "user/pages/tenants/" . ($getArchived ? "archived" : "index") . ".html.twig";
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
     * @Route("/agenda", options={"expose"=true}, name="agenda")
     */
    public function agenda(Request $request, AgEventRepository $repository, SerializerInterface $serializer, EventService $eventService): Response
    {
        $route = 'user/pages/agenda/index.html.twig';

        /** @var User $user */
        $user = $this->getUser();
        $objs = $repository->findAll();
        $data = $eventService->getEvents($objs, $user);
        $objs = $serializer->serialize($data, 'json', ['groups' => User::AGENDA_READ]);

        $params = ['donnees' => $objs];

        $ty = $request->query->get('ty');
        $search = $request->query->get('se');
        if($search && $ty){
            return $this->render($route, array_merge($params, ['type' => $ty, 'search' => $search]));
        }

        return $this->render($route, $params);
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

    /**
     * @Route("/parametres/generaux", name="settings_generaux")
     */
    public function parametresGeneraux(ImSettingsRepository $settingsRepository, ImNegotiatorRepository $negotiatorRepository,
                                       SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = $settingsRepository->findOneBy(['agency' => $user->getAgency()]);
        $negotiators = $negotiatorRepository->findBy(['agency' => $user->getAgency()]);

        $data = $serializer->serialize($data, 'json', ['groups' => User::USER_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/settings/index.html.twig', [
            'element' => $data,
            'negotiators' => $negotiators,
        ]);
    }

    /**
     * @Route("/parametres/infos-biens", name="settings_biens")
     */
    public function parametresBiens(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $quartiers = $this->getDonneeData($em, DoQuartier::class, $user, $serializer);
        $sols      = $this->getDonneeData($em, DoSol::class, $user, $serializer);
        $sousTypes = $this->getDonneeData($em, DoSousType::class, $user, $serializer);

        return $this->render('user/pages/settings/biens.html.twig', [
            'quartiers' => $quartiers,
            'sols' => $sols,
            'sousTypes' => $sousTypes,
        ]);
    }

    /**
     * @Route("/parametres/supports", name="settings_supports")
     */
    public function parametresSupports(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $data = $em->getRepository(ImSupport::class)->findBy(['agency' => $user->getAgency()]);

        $data = $serializer->serialize($data, 'json', ['groups' => ImSupport::SUPPORT_READ]);

        return $this->render('user/pages/settings/supports.html.twig', [
            'donnees' => $data,
        ]);
    }

    /**
     * @Route("/publication", name="publications")
     */
    public function publications(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $data = $em->getRepository(ImBien::class)->findBy([
            'agency' => $user->getAgency(), 'status' => ImBien::STATUS_ACTIF, 'isDraft' => false, 'isArchived' => false
        ]);
        $publishes = $em->getRepository(ImPublish::class)->findBy(['bien' => $data]);

        $data = $serializer->serialize($data, 'json', ['groups' => User::USER_READ]);
        $publishes = $serializer->serialize($publishes, 'json', ['groups' => ImPublish::PUBLISH_READ]);

        return $this->render('user/pages/publications/index.html.twig', [
            'donnees' => $data,
            'publishes' => $publishes,
        ]);
    }

    /**
     * @Route("/publication/historique", name="publications_histories")
     */
    public function publicationsHistories(SerializerInterface $serializer): Response
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        $stats = $em->getRepository(ImStat::class)->findBy(['agency' => $user->getAgency()], ['createdAt' => 'DESC']);

        $stats = $serializer->serialize($stats, 'json', ['groups' => ImStat::STAT_READ]);

        return $this->render('user/pages/publications/history.html.twig', [
            'donnees' => $stats,
        ]);
    }

    /**
     * @Route("/outils/fiancement", name="utilities_financial")
     */
    public function utilitiesFinancial(): Response
    {
        return $this->render('user/pages/utilities/financial.html.twig');
    }
}
