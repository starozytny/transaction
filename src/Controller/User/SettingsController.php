<?php

namespace App\Controller\User;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Donnee\DoQuartier;
use App\Transaction\Entity\Donnee\DoSol;
use App\Transaction\Entity\Donnee\DoSousType;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImSettings;
use App\Transaction\Entity\Immo\ImSupport;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre/parametres", name="user_settings_")
 */
class SettingsController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @Route("/generaux", name="generaux")
     */
    public function general(SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $data        = $em->getRepository(ImSettings::class)->findOneBy(['agency' => $user->getAgencyId()]);
        $negotiators = $em->getRepository(ImNegotiator::class)->findBy(['agency' => $user->getAgencyId()]);

        $data = $serializer->serialize($data, 'json', ['groups' => User::USER_READ]);
        $negotiators = $serializer->serialize($negotiators, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('user/pages/settings/index.html.twig', [
            'element' => $data,
            'negotiators' => $negotiators,
        ]);
    }

    /**
     * @Route("/infos-biens", name="biens")
     */
    public function biens(SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $quartiers = $this->immoService->getDonneeData($em, DoQuartier::class, $user, $serializer);
        $sols      = $this->immoService->getDonneeData($em, DoSol::class, $user, $serializer);
        $sousTypes = $this->immoService->getDonneeData($em, DoSousType::class, $user, $serializer);

        return $this->render('user/pages/settings/biens.html.twig', [
            'quartiers' => $quartiers,
            'sols' => $sols,
            'sousTypes' => $sousTypes,
        ]);
    }

    /**
     * @Route("/supports", name="supports")
     */
    public function supports(SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $data = $em->getRepository(ImSupport::class)->findBy(['agency' => $user->getAgencyId()]);

        $data = $serializer->serialize($data, 'json', ['groups' => ImSupport::SUPPORT_READ]);

        return $this->render('user/pages/settings/supports.html.twig', [
            'donnees' => $data,
        ]);
    }
}
