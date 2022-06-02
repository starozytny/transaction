<?php

namespace App\Controller\Api\Donnee;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Donnee\DoQuartier;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use App\Service\Data\Donnee\DataDonnee;
use App\Service\ValidatorService;
use DateTime;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/donnees/quartiers", name="api_donnees_quartiers_")
 */
class QuartierController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, DoQuartier $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataDonnee $dataEntity): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataQuartier($obj, $data);

        $obj->setAgency($this->immoService->getUserAgency($user));

        if($type === "update"){
            $obj->setUpdatedAt(new DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::DONNEE_READ);
    }

    /**
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Donnees")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataDonnee $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataDonnee $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new DoQuartier(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Donnees")
     *
     * @param $id
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataDonnee $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update($id, Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataDonnee $dataEntity): JsonResponse
    {
        $em = $this->immoService->getEntityUserManager($this->getUser());

        $obj = $em->getRepository(DoQuartier::class)->find($id);
        if($obj->getIsNative()){
            return $apiResponse->apiJsonResponseBadRequest("Vous ne pouvez pas modifier cette donnée.");
        }

        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Donnees")
     *
     * @param $id
     * @param ApiResponse $apiResponse
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete($id, ApiResponse $apiResponse, DataService $dataService): JsonResponse
    {
        $em = $this->immoService->getEntityUserManager($this->getUser());

        $obj = $em->getRepository(DoQuartier::class)->find($id);
        if($obj->getIsNative()){
            return $apiResponse->apiJsonResponseBadRequest("Vous ne pouvez pas modifier cette donnée.");
        }

        return $dataService->deleteTransac($this->getUser(), $obj);
    }
}
