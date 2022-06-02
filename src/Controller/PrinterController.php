<?php

namespace App\Controller;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\History\HiBien;
use App\Transaction\Entity\History\HiPrice;
use App\Transaction\Entity\History\HiPublish;
use App\Transaction\Entity\History\HiVisite;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImContractant;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImOwner;
use App\Entity\User;
use App\Transaction\Entity\Immo\ImPhoto;
use App\Transaction\Repository\Immo\ImBienRepository;
use App\Transaction\Repository\Immo\ImPhotoRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre/impression", name="user_printer_")
 */
class PrinterController extends AbstractController
{
    private $doctrine;
    private $immoService;

    public function __construct(ManagerRegistry $doctrine, ImmoService $immoService)
    {
        $this->doctrine = $doctrine;
        $this->immoService = $immoService;
    }

    /**
     * @Route("/vitrine/bien/{slug}", options={"expose"=true}, name="bien_display")
     */
    public function vitrineBien(Request $request, $slug, SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj = $em->getRepository(ImBien::class)->findOneBy(['slug' => $slug]);

        $ori = $request->query->get('ori');
        $photos = $em->getRepository(ImPhoto::class)->findBy(['bien' => $obj], ['rank' => 'ASC'], 4);

        $obj    = $serializer->serialize([$obj], 'json', ['groups' => User::USER_READ]);
        $photos = $serializer->serialize($photos, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/bien.html.twig', [
            'donnees' => $obj,
            'photos' => $photos,
            'ori' => $ori ?: "landscape"
        ]);
    }

    /**
     * @Route("/vitrine/biens", options={"expose"=true}, name="biens_display")
     */
    public function vitrineBiens(Request $request, SerializerInterface $serializer): Response
    {
        $ori = $request->query->get('ori');

        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $biens = $em->getRepository(ImBien::class)->findBy(['agency' => $user->getAgencyId(), 'status' => ImBien::STATUS_ACTIF]);
        $photos = $em->getRepository(ImPhoto::class)->findBy(['bien' => $biens], ['rank' => 'ASC'], 4);

        $biens    = $serializer->serialize($biens, 'json', ['groups' => User::USER_READ]);
        $photos = $serializer->serialize($photos, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/bien.html.twig', [
            'donnees' => $biens,
            'photos' => $photos,
            'ori' => $ori ?: "landscape"
        ]);
    }

    /**
     * @Route("/rapport/bien/{slug}", options={"expose"=true}, name="bien_rapport")
     */
    public function rapportBien($slug, SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj = $em->getRepository(ImBien::class)->findOneBy(['slug' => $slug]);

        $data = $this->getDataHistoryBien($em, $serializer, $obj);

        $obj = $serializer->serialize($obj, 'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/rapport_bien.html.twig', array_merge([
            'donnees' => $obj,
        ], $data));
    }

    /**
     * @Route("/rapport/proprietaire/{id}", options={"expose"=true}, name="owner_rapport")
     */
    public function rapportOwner($id, SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj = $em->getRepository(ImOwner::class)->find($id);

        $contractants = $em->getRepository(ImContractant::class)->findBy(['owner' => $obj]);
        $biens = []; $noDuplication = [];
        foreach ($contractants as $contractant){
            $bien = $contractant->getContract()->getBien();
            if($bien && $bien->getStatus() == ImBien::STATUS_ACTIF){
                if(!in_array($bien->getId(), $noDuplication)){
                    $noDuplication[] = $bien;
                    $biens[] = $bien;
                }
            }
        }
        $data  = $this->getDataHistoryBien($em, $serializer, $biens);

        $obj        = $serializer->serialize($obj,       'json', ['groups' => User::ADMIN_READ]);
        $biens      = $serializer->serialize($biens,     'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/rapport_owner.html.twig', array_merge([
            'donnees' => $obj,
            'biens' => $biens,
        ], $data));
    }

    /**
     * @Route("/rapport/negociateur/{id}", options={"expose"=true}, name="negotiator_rapport")
     */
    public function rapportNegotiator($id, SerializerInterface $serializer): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj = $em->getRepository(ImNegotiator::class)->find($id);

        $biens = $em->getRepository(ImBien::class)->findBy(['negotiator' => $obj, 'status' => ImBien::STATUS_ACTIF]);
        $data  = $this->getDataHistoryBien($em, $serializer, $biens);

        $obj        = $serializer->serialize($obj,       'json', ['groups' => User::ADMIN_READ]);
        $biens      = $serializer->serialize($biens,     'json', ['groups' => User::USER_READ]);

        return $this->render('user/pages/impressions/rapport_negotiator.html.twig', array_merge([
            'donnees' => $obj,
            'biens' => $biens,
        ], $data));
    }

    private function getDataHistoryBien($em, $serializer, $biens): array
    {
        $elements  = $em->getRepository(HiBien::class)->findBy(['bienId' => $biens], ['createdAt' => 'DESC']);
        $publishes = $em->getRepository(HiPublish::class)->findBy(['bienId' => $biens], ['createdAt' => 'DESC']);
        $visites   = $em->getRepository(HiVisite::class)->findBy(['bienId' => $biens], ['createdAt' => 'DESC']);
        $prices    = $em->getRepository(HiPrice::class)->findBy(['bienId' => $biens], ['createdAt' => 'DESC']);

        $elements   = $serializer->serialize($elements,  'json', ['groups' => HiBien::HISTORY_BIEN]);
        $publishes  = $serializer->serialize($publishes, 'json', ['groups' => HiPublish::HISTORY_PUBLISH]);
        $visites    = $serializer->serialize($visites,   'json', ['groups' => HiVisite::HISTORY_VISITE]);
        $prices     = $serializer->serialize($prices,    'json', ['groups' => HiPrice::HISTORY_PRICE]);

        return [
            'elements' => $elements,
            'publishes' => $publishes,
            'visites' => $visites,
            'prices' => $prices
        ];
    }
}
