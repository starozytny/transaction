<?php

namespace App\Controller\Api\Immo;

use App\Transaction\Entity\Immo\ImOwner;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\Immo\ImmoService;
use App\Service\ValidatorService;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/owners", name="api_owners_")
 */
class OwnerController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * get owner of user agency
     *
     * @Route("/user-agency", name="user_agency", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Owners")
     *
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(ApiResponse $apiResponse): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $objs = $em->getRepository(ImOwner::class)->findBy(['agency' => $user->getAgencyId()]);

        return $apiResponse->apiJsonResponse($objs, ImOwner::OWNER_READ);
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImOwner $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataOwner($obj, $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, ImOwner::OWNER_READ);
    }

    /**
     * Create an owner
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Owners")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new ImOwner(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update an owner
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Owners")
     *
     * @param $id
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update($id, Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        $em = $this->immoService->getEntityUserManager($this->getUser());

        $obj = $em->getRepository(ImOwner::class)->find($id);
        if($obj->getIsGerance()){
            return $apiResponse->apiJsonResponseBadRequest("Vous ne pouvez pas modifier ce propriétaire venant de la gérance.");
        }

        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Delete an owner
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Owners")
     *
     * @param $id
     * @param ApiResponse $apiResponse
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete($id, ApiResponse $apiResponse, DataService $dataService): JsonResponse
    {
        $em = $this->immoService->getEntityUserManager($this->getUser());

        $obj = $em->getRepository(ImOwner::class)->find($id);
        if($obj->getIsGerance()){
            return $apiResponse->apiJsonResponseBadRequest("Vous ne pouvez pas supprimer ce propriétaire venant de la gérance.");
        }

        return $dataService->deleteTransac($this->getUser(), $obj);
    }

    /**
     * Admin - Delete a group of owners
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Owners")
     *
     * @param Request $request
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, DataService $dataService): JsonResponse
    {
        return $dataService->deleteSelectedTransac($this->getUser(), ImOwner::class, json_decode($request->getContent()));
    }

    /**
     * @Route("/export/{format}", name="export", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return file",
     * )
     *
     * @OA\Tag(name="Owners")
     *
     * @param $format
     * @return BinaryFileResponse
     */
    public function export($format): BinaryFileResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        return $this->immoService->exportData($format, $user, ImOwner::class, 'proprietaires');
    }
}
