<?php

namespace App\Controller\Api\Immo;

use App\Entity\User;
use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Immo\ImSupport;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/immo/supports", name="api_immo_supports_")
 */
class SupportController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    public function submitForm($type, ImSupport $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataSupport($obj, $data);

        if($type == "update"){
            $obj->setUpdatedBy($this->getUser()->getUserIdentifier());
            $obj->setUpdatedAt(new \DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, ImSupport::SUPPORT_READ);
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
     * @OA\Tag(name="ImmoSettings")
     *
     * @param Request $request
     * @param $id
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataImmo $dataEntity
     * @return JsonResponse
     */
    public function update(Request $request, $id, ValidatorService $validator,
                           ApiResponse $apiResponse, DataImmo $dataEntity): JsonResponse
    {
        $em = $this->immoService->getEntityUserManager($this->getUser());

        $obj = $em->getRepository(ImSupport::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }
}
