<?php

namespace App\Controller\Api\Immo;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\History\HiPublish;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImPhoto;
use App\Transaction\Entity\Immo\ImPublish;
use App\Transaction\Entity\Immo\ImStat;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Immo\PublishService;
use App\Service\SanitizeData;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/immo/publish", name="api_immo_publish_")
 */
class PublishController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @Route("/send", name="send", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an object"
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     *
     * @OA\Tag(name="ImmoSettings")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param PublishService $publishService
     * @param SanitizeData $sanitizeData
     * @return JsonResponse
     */
    public function update(Request $request, ApiResponse $apiResponse, PublishService $publishService, SanitizeData $sanitizeData): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->getContent());

        /** @var User $user */
        $user = $this->getUser();

        $photos = $em->getRepository(ImPhoto::class)->findBy(['bien' => $data], ['rank' => 'ASC']);
        $publishes = $em->getRepository(ImPublish::class)->findBy(['bien' => $data]);

        $biens = $em->getRepository(ImBien::class)->findBy(['isPublished' => true]);
        $detailsAd = [
            "Vente" => 0,
            "Location" => 0,
            "Viager" => 0,
            "Produit d'investissement" => 0,
            "Cession bail" => 0,
            "Location vacances" => 0,
            "Vente prestige" => 0,
            "Fond de commerce" => 0
        ];

        $detailsBien = [
            "Appartement" => 0,
            "Maison" => 0,
            "Parking/Box" => 0,
            "Terrain" => 0,
            "Boutique" => 0,
            "Bureau" => 0,
            "Château" => 0,
            "Immeuble" => 0,
            "Terrain + Maison" => 0,
            "Bâtiment" => 0,
            "Local" => 0,
            "Loft/Atelier/Surface" => 0,
            "Hôtel particulier" => 0,
            "Autres" => 0,
        ];

        foreach($biens as $bien){
            $bien->setIsPublished(false);
        }

        $publishService->createFile($publishes, $photos);

        $stat = (new ImStat())
            ->setAgency($this->immoService->getUserAgency($user))
            ->setNbBiens(count($data))
            ->setPublishedAt($sanitizeData->todayDate())
            ->setUserFullname($user->getFullname())
        ;

        $biens = $em->getRepository(ImBien::class)->findBy(['id' => $data]);
        foreach($biens as $bien){
            $supports = [];
            foreach($publishes as $publish){
                if($publish->getBien()->getId() == $bien->getId()){
                    $supports[] = $publish->getSupport()->getName();
                }
            }

            $historyPublish = (new HiPublish())
                ->setBienId($bien->getId())
                ->setSupports($supports)
            ;

            $detailsAd[$bien->getTypeAdString()] = $detailsAd[$bien->getTypeAdString()] + 1;
            $detailsBien[$bien->getTypeBienString()] = $detailsBien[$bien->getTypeBienString()] + 1;

            $em->persist($historyPublish);
        }


        $stat = ($stat)
            ->setDetailsAd($detailsAd)
            ->setDetailsBien($detailsBien)
        ;

        $em->persist($stat);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("L'envoie s'est bien passé. La page va se rafraîchir automatiquement dans 5 secondes.");
    }
}
