<?php

namespace App\Controller\User;

use App\Entity\Changelog;
use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Immo\ImContractant;
use App\Transaction\Entity\Immo\ImProspect;
use App\Entity\Mail;
use App\Transaction\Entity\Donnee\DoQuartier;
use App\Transaction\Entity\Donnee\DoSol;
use App\Transaction\Entity\Donnee\DoSousType;
use App\Transaction\Entity\History\HiVisite;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImContract;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImOffer;
use App\Transaction\Entity\Immo\ImOwner;
use App\Transaction\Entity\Immo\ImPhoto;
use App\Transaction\Entity\Immo\ImPublish;
use App\Transaction\Entity\Immo\ImRoom;
use App\Transaction\Entity\Immo\ImSettings;
use App\Transaction\Entity\Immo\ImStat;
use App\Transaction\Entity\Immo\ImSuivi;
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
use App\Service\Immo\SearchService;
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
 * @Route("/espace-membre/biens", name="user_biens_")
 */
class BienController extends AbstractController
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
     * @Route("/", options={"expose"=true}, name="index")
     */
    public function biens(Request $request, SerializerInterface $serializer, SearchService $searchService): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $status = $request->query->get('st');
        $filterNego = $request->query->get('fn');
        $filterUser = $request->query->get('fu');

        $agency = $this->immoService->getUserAgency($user);
        $agencies = $em->getRepository(ImAgency::class)->findBy(['society' => $user->getSociety()]);

        if($status == null){
            $objs = $em->getRepository(ImBien::class)->findBy(['agency' => $agencies]);
        }else{
            $objs = $em->getRepository(ImBien::class)->findBy(['agency' => $agencies, 'status' => (int) $status]);
        }

        $rapprochements = $searchService->getRapprochementBySearchs($objs, $agency);
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
     * @Route("/carte", name="map")
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
     * @Route("/bien/ajouter", options={"expose"=true}, name="create")
     */
    public function createBien(SerializerInterface $serializer): Response
    {
        return $this->formBien($serializer, 'user/pages/biens/create.html.twig');
    }

    /**
     * @Route("/bien/modifier/{slug}",options={"expose"=true}, name="update")
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
     * @Route("/bien/suivi/{slug}",options={"expose"=true}, name="suivi")
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
}
