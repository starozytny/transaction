<?php

namespace App\Controller;

use App\Entity\Changelog;
use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImStat;
use App\Transaction\Entity\Immo\ImVisit;
use App\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
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
    private $immoService;

    public function __construct(ManagerRegistry $doctrine, ImmoService $immoService)
    {
        $this->doctrine = $doctrine;
        $this->immoService = $immoService;
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

        $users       = $em->getRepository(User::class)->findBy(['agency' => $obj->getAgencyId()]);
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
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj->getAgencyId()]);

        $data = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/update.html.twig',  ['elem' => $obj, 'donnees' => $data, 'negotiators' => $negotiators]);
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
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj->getAgencyId()]);

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

        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $obj->getAgencyId()]);

        $data = $serializer->serialize($obj, 'json', ['groups' => User::ADMIN_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/profil/user/update.html.twig', ['elem' => $obj, 'donnees' => $data, 'negotiators' => $negotiators]);
    }

    /**
     * @Route("/outils/fiancement", name="utilities_financial")
     */
    public function utilitiesFinancial(): Response
    {
        return $this->render('user/pages/utilities/financial.html.twig');
    }
}
