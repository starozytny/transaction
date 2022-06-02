<?php

namespace App\Controller;

use App\Entity\Changelog;
use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Immo\ImContractant;
use App\Transaction\Entity\Immo\ImProspect;
use App\Entity\Mail;
use App\Transaction\Entity\Donnee\DoQuartier;
use App\Transaction\Entity\Donnee\DoSol;
use App\Transaction\Entity\Donnee\DoSousType;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImStat;
use App\Transaction\Entity\Immo\ImSupport;
use App\Transaction\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Transaction\Repository\Immo\ImNegotiatorRepository;
use App\Transaction\Repository\Immo\ImSettingsRepository;
use App\Service\MailerService;
use Doctrine\Common\Persistence\ManagerRegistry;
use App\Transaction\Repository\Immo\ImOwnerRepository;
use App\Transaction\Repository\Immo\ImProspectRepository;
use App\Transaction\Repository\Immo\ImTenantRepository;
use App\Repository\UserRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use App\Transaction\Repository\Agenda\AgEventRepository;
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
    private $immoService;

    public function __construct(ManagerRegistry $doctrine, ImmoService $immoService)
    {
        $this->doctrine = $doctrine;
        $this->immoService = $immoService;
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
        /** @var User $user */
        $user = $this->getUser();
        $em  = $this->doctrine->getManager();
        $emT = $this->immoService->getEntityUserManager($user);

        $changelogs     = $em->getRepository(Changelog::class)->findBy(['isPublished' => true], ['createdAt' => 'DESC'], 5);
        $biensAgency    = $emT->getRepository(ImBien::class)->findBy(['agency' => $user->getAgencyId(), 'status' => ImBien::STATUS_ACTIF, 'isArchived' => false, 'isDraft' => false]);
        $biensVisits    = $emT->getRepository(ImBien::class)->findBy(['agency' => $user->getAgencyId()]);
        $biensUser      = $emT->getRepository(ImBien::class)->findBy(['userId' => $user->getId(), 'isArchived' => false, 'isDraft' => false]);
        $biensDraft     = $emT->getRepository(ImBien::class)->findBy(['userId' => $user->getId(), 'isArchived' => false, 'isDraft' => true]);
        $stats          = $emT->getRepository(ImStat::class)->findBy(['agency' => $user->getAgencyId()], ['createdAt' => 'DESC']);
        $visits         = $emT->getRepository(ImVisit::class)->findBy(['bien' => $biensVisits]);
        $statsAds       = $emT->getRepository(ImStat::class)->findBy(['agency' => $user->getAgencyId()], ['publishedAt' => 'ASC'], 7);
        $biens          = $biensAgency;

        $lastPublish = null;
        foreach($stats as $stat){
            if($lastPublish == null && $stat->getPublishedAt()){
                $lastPublish = $stat->getPublishedAtString();
                break;
            }
        }

        $biens    = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);
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
            'statsAds' => $statsAds,
            'biens' => $biens
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
     * @Route("/outils/fiancement", name="utilities_financial")
     */
    public function utilitiesFinancial(): Response
    {
        return $this->render('user/pages/utilities/financial.html.twig');
    }
}
