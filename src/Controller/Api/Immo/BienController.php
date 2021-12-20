<?php

namespace App\Controller\Api\Immo;

use App\Entity\Immo\ImArea;
use App\Entity\Immo\ImBien;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/biens", name="api_biens_")
 */
class BienController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function setProperty($em, $obj, $data, ApiResponse $apiResponse, ValidatorService $validator, DataImmo $dataEntity)
    {
        $obj = $dataEntity->setDataArea($obj, $data);
        if(!is_object($obj)){
            return $apiResponse->apiJsonResponseValidationFailed($obj);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);

        return $obj;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImBien $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $area = $this->setProperty($em, $type == "create" ? new ImArea() : $obj->getArea(), $data, $apiResponse, $validator, $dataEntity);
        if(!$area instanceof ImArea){
            return $area;
        }

        $obj = $dataEntity->setDataBien($obj, $data, $area);
        if(!$obj instanceof ImBien){
            return $apiResponse->apiJsonResponseValidationFailed($obj);
        }

        /** @var User $user */
        $user = $this->getUser();
        if($type == "create"){
            $obj = ($obj)
                ->setUser($user)
                ->setCreatedBy($user->getShortFullName())
                ->setIdentifiant(uniqid().bin2hex(random_bytes(8)))
                ->setAgency($user->getAgency())
            ;
        }else{
            $obj = ($obj)
                ->setUpdatedAt(new \DateTime())
                ->setUpdatedBy($user->getShortFullName())
            ;
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Success");
    }

    /**
     * Create a bien
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Bien")
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
        return $this->submitForm("create", new ImBien(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update a bien
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Bien")
     *
     * @param ImBien $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataImmo $dataEntity
     * @param FileUploader $fileUploader
     * @return JsonResponse
     * @throws Exception
     */
    public function update(ImBien $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Delete a bien
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Bien")
     *
     * @param ImBien $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(ImBien $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }
}
