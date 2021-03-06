<?php

namespace App\Controller\Api\Immo;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\History\HiVisite;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImContract;
use App\Transaction\Entity\Immo\ImOffer;
use App\Transaction\Entity\Immo\ImPhoto;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImRoom;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Transaction\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Immo\SearchService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/suivis", name="api_suivis_")
 */
class SuiviController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * Get data for bien page suivi-read
     *
     * @Route("/bien/{slug}", name="bien", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Suivis")
     *
     * @param $slug
     * @param ApiResponse $apiResponse
     * @param SerializerInterface $serializer
     * @param SearchService $searchService
     * @return JsonResponse
     */
    public function bien($slug, ApiResponse $apiResponse, SerializerInterface $serializer, SearchService $searchService): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj = $em->getRepository(ImBien::class)->findOneBy(["slug" => $slug]);

        $photos    = $em->getRepository(ImPhoto::class)->findBy(["bien" => $obj]);
        $rooms     = $em->getRepository(ImRoom::class)->findBy(["bien" => $obj]);
        $visits    = $em->getRepository(ImVisit::class)->findBy(['bien' => $obj]);
        $suivis    = $em->getRepository(ImSuivi::class)->findBy(['bien' => $obj]);
        $offers    = $em->getRepository(ImOffer::class)->findBy(['bien' => $obj]);
        $contracts = $em->getRepository(ImContract::class)->findBy(['bien' => $obj]);

        $element   = $serializer->serialize($obj,       'json', ['groups' => User::USER_READ]);
        $photos    = $serializer->serialize($photos,    'json', ['groups' => User::USER_READ]);
        $rooms     = $serializer->serialize($rooms,     'json', ['groups' => User::USER_READ]);
        $suivis    = $serializer->serialize($suivis,    'json', ['groups' => ImSuivi::SUIVI_READ]);
        $visits    = $serializer->serialize($visits,    'json', ['groups' => ImVisit::VISIT_READ]);
        $offers    = $serializer->serialize($offers,    'json', ['groups' => ImOffer::OFFER_READ]);
        $contracts = $serializer->serialize($contracts, 'json', ['groups' => ImContract::CONTRACT_READ]);

        $historiesVisits = $em->getRepository(HiVisite::class)->findBy(['bienId' => $obj->getId()], ['createdAt' => 'DESC']);
        $historiesVisits = $serializer->serialize($historiesVisits, 'json', ['groups' => HiVisite::HISTORY_VISITE]);
        $rapprochements  = $searchService->getRapprochementBySearchs([$obj], $obj->getAgency());
        $rapprochements  = json_encode($rapprochements);

        return $apiResponse->apiJsonResponseCustom([
            'elem' => $element,
            'rooms' => $rooms,
            'photos' => $photos,
            'suivis' => $suivis,
            'visits' => $visits,
            'offers' => $offers,
            'contracts' => $contracts,
            'rapprochements' => $rapprochements,
            'historiesVisits' => $historiesVisits,
        ]);
    }

    /**
     * Link or de-link prospect to bien
     *
     * @Route("/link/{bien}/{prospect}", name="link_bien_prospect", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Suivis")
     *
     * @param $bien
     * @param $prospect
     * @param ApiResponse $apiResponse
     * @param DataImmo $dataEntity
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function link($bien, $prospect, ApiResponse $apiResponse,
                         DataImmo $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $bien     = $em->getRepository(ImBien::class)->find($bien);
        $prospect = $em->getRepository(ImProspect::class)->find($prospect);

        $obj = $em->getRepository(ImSuivi::class)->findOneBy(['bien' => $bien, 'prospect' => $prospect]);

        if(!$obj){ // create
            $obj = $dataEntity->setDataSuivi(new ImSuivi(), $bien, $prospect);
            $em->persist($obj);
            $context = "create";
        }else{
            $id = $obj->getId();
            $em->remove($obj);
            $context = "delete";

            $obj = ['id' => $id];
        }

        $em->flush();

        $obj = $serializer->serialize($obj, 'json', ['groups' => ImSuivi::SUIVI_READ]);

        return $apiResponse->apiJsonResponseCustom([
            'context' => $context,
            'obj' => $obj
        ]);
    }

    /**
     * Delete suivi
     *
     * @Route("/suivi/{id}/{bien}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Suivis")
     *
     * @param $id
     * @param $bien
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function delete($id, $bien, ApiResponse $apiResponse): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj  = $em->getRepository(ImProspect::class)->find($id);
        $bien = $em->getRepository(ImBien::class)->find($bien);

        $suivi = $em->getRepository(ImSuivi::class)->findOneBy(['bien' => $bien, 'prospect' => $obj]);

        $em->remove($suivi);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression r??ussie !");
    }
}
