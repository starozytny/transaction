<?php

namespace App\Controller\Api\Immo;

use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImSuivi;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use Doctrine\Common\Persistence\ManagerRegistry;
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
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
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
     * @param Request $request
     * @param ImBien $bien
     * @param ImProspect $prospect
     * @param ApiResponse $apiResponse
     * @param DataImmo $dataEntity
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function link(Request $request, ImBien $bien, ImProspect $prospect, ApiResponse $apiResponse,
                         DataImmo $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();
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
     * @param ImProspect $obj
     * @param ImBien $bien
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function delete(ImProspect $obj, ImBien $bien, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $suivi = $em->getRepository(ImSuivi::class)->findOneBy(['bien' => $bien, 'prospect' => $obj]);

        $em->remove($suivi);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }
}
