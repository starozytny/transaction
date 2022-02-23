<?php

namespace App\Controller\Api\Immo;

use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImContract;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImSuivi;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/contracts", name="api_contracts_")
 */
class ContractController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImContract $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $bien = $em->getRepository(ImBien::class)->find($data->bien->id);

        $obj = $dataEntity->setDataContract($obj, $data, $bien);

        $others = $em->getRepository(ImContract::class)->findBy(['bien' => $data->bien->id, 'status' => ImContract::STATUS_PROCESSING]);
        foreach($others as $other){
            $other->setStatus(ImContract::STATUS_END);
        }

        $prospect = $em->getRepository(ImProspect::class)->find($data->prospect->id);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        if($suivi = $this->getSuivi($bien, $prospect)){
            $suivi->setStatus(ImSuivi::STATUS_END);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    /**
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new object"
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\Tag(name="Offers")
     *
     * @param Request $request
     * @param SerializerInterface $serializer
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, SerializerInterface $serializer, ValidatorService $validator, ApiResponse $apiResponse, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new ImContract(), $request, $apiResponse, $validator, $dataEntity, $serializer);
    }

    /**
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an object"
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Offers")
     *
     * @param Request $request
     * @param SerializerInterface $serializer
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param ImContract $obj
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update(Request $request, SerializerInterface $serializer, ValidatorService $validator,  ApiResponse $apiResponse,
                           ImContract $obj, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity, $serializer);
    }

    private function getSuivi($bien, $prospect)
    {
        $em = $this->doctrine->getManager();

        return  $em->getRepository(ImSuivi::class)->findOneBy([
            'bien' => $bien,
            'prospect' => $prospect
        ]);
    }
}
