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
     * link array of prospect to bien
     *
     * @Route("/link/{id}", name="link_bien", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Suivis")
     *
     * @param Request $request
     * @param ImBien $obj
     * @param ApiResponse $apiResponse
     * @param DataImmo $dataEntity
     * @return JsonResponse
     */
    public function link(Request $request, ImBien $obj, ApiResponse $apiResponse, DataImmo $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());
        $suivis = $em->getRepository(ImSuivi::class)->findBy(['bien' => $obj]);

        //get id prospects
        $idProspects = [];
        foreach($data as $prospect){
            if(!in_array($prospect->id, $idProspects)){
                $idProspects[] = $prospect->id;
            }
        }

        $alreadyCreated = [];
        foreach($suivis as $suivi){
            $find = false;
            foreach($data as $prospect){
                if($prospect->id == $suivi->getProspect()->getId()){
                    $find = true;
                    $alreadyCreated[] = $prospect;
                }
            }
            if(!$find){
                $em->remove($suivi);
            }
        }

        $prospects = $em->getRepository(ImProspect::class)->findBy(['id' => $idProspects]);
        foreach ($prospects as $prospect){
            $find = false;
            foreach($alreadyCreated as $existe){
                if($prospect->getId() === $existe->id){
                    $find = true;
                }
            }

            if(!$find) {
                $new = $dataEntity->setDataSuivi(new ImSuivi(), $obj, $prospect);

                $em->persist($new);
            }
        }

        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
