<?php

namespace App\Controller\Api\Immo;

use App\Entity\History\HiPublish;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImPhoto;
use App\Entity\Immo\ImPublish;
use App\Entity\Immo\ImStat;
use App\Entity\Immo\ImSupport;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Immo\PublishService;
use App\Service\SanitizeData;
use Doctrine\Common\Persistence\ManagerRegistry;
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
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
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
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        /** @var User $user */
        $user = $this->getUser();

        $photos = $em->getRepository(ImPhoto::class)->findBy(['bien' => $data], ['rank' => 'ASC']);
        $publishes = $em->getRepository(ImPublish::class)->findBy(['bien' => $data]);

        $biens = $em->getRepository(ImBien::class)->findBy(['isPublished' => true]);
        foreach($biens as $bien){
            $bien->setIsPublished(false);
        }

        $publishService->createFile($publishes, $photos);

        $stat = (new ImStat())
            ->setAgency($user->getAgency())
            ->setNbBiens(count($data))
            ->setPublishedAt($sanitizeData->todayDate())
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
                ->setBien($bien)
                ->setSupports($supports)
            ;

            $em->persist($historyPublish);
        }

        $em->persist($stat);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("L'envoie s'est bien passé. La page va se rafraîchir automatiquement dans 5 secondes.");
    }
}
