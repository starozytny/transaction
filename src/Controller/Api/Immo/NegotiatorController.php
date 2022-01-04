<?php

namespace App\Controller\Api\Immo;

use App\Entity\Immo\ImNegotiator;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/negotiators", name="api_negotiators_")
 */
class NegotiatorController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImNegotiator $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataNegotiator($obj, $data);

        $file = $request->files->get('avatar');
        if ($file) {
            if($type === "create"){
                $fileName = $fileUploader->upload($file, ImNegotiator::FOLDER_AVATARS);
            }else{
                $fileName = $fileUploader->replaceFile($file, $obj->getAvatar(),ImNegotiator::FOLDER_AVATARS);
            }
            $obj->setAvatar($fileName);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Create a negotiator
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Nagociateurs")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataImmo $dataEntity
     * @param FileUploader $fileUploader
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        return $this->submitForm("create", new ImNegotiator(), $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Update a negotiator
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Negociateurs")
     *
     * @param ImNegotiator $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataImmo $dataEntity
     * @param FileUploader $fileUploader
     * @return JsonResponse
     * @throws Exception
     */
    public function update(ImNegotiator $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Delete a negotiator
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Negociateurs")
     *
     * @param ImNegotiator $obj
     * @param DataService $dataService
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function delete(ImNegotiator $obj, DataService $dataService, FileUploader $fileUploader): JsonResponse
    {
        return $dataService->deleteWithImg($obj, $obj->getAvatar(), $fileUploader, ImNegotiator::FOLDER_AVATARS);
    }

    /**
     * Admin - Delete a group of negotiators
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
     * @OA\Tag(name="Negociateurs")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        $objs = $em->getRepository(ImNegotiator::class)->findBy(['id' => $data]);

        $avatars = [];
        if ($objs) {
            foreach ($objs as $obj) {
                $avatars[] = $obj->getAvatar();
                $em->remove($obj);
            }
        }

        $em->flush();

        foreach($avatars as $avatar){
            $fileUploader->deleteFile($avatar, ImNegotiator::FOLDER_AVATARS);
        }

        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
