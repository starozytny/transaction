<?php

namespace App\Controller\Api\Immo;

use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImSuivi;
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
 * @Route("/api/prospects", name="api_prospects_")
 */
class ProspectController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * get prospects of user agency
     *
     * @Route("/user-agency", name="user_agency", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Prospects")
     *
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(ApiResponse $apiResponse): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $objs = $em->getRepository(ImProspect::class)->findBy(['agency' => $user->getAgencyId(), 'isArchived' => false]);

        return $apiResponse->apiJsonResponse($objs, User::ADMIN_READ);
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImProspect $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les donn??es sont vides.');
        }

        $obj = $dataEntity->setDataProspect($em, $obj, $data);

        if($data->bienId){
            $bien = $em->getRepository(ImBien::class)->find($data->bienId);
            if(!$bien){
                return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenu dans la liaison entre le bien et le prospect.');
            }
            $existe = $em->getRepository(ImSuivi::class)->findOneBy(['bien' => $bien, 'prospect' => $obj]);
            $suivi = !$existe ? new ImSuivi() : $existe;

            $suivi = $dataEntity->setDataSuivi($suivi, $bien, $obj);

            $em->persist($suivi);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $data->bienId ?$apiResponse->apiJsonResponse($suivi, ImSuivi::SUIVI_READ) : $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Create a prospect
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Prospects")
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
        return $this->submitForm("create", new ImProspect(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update a prospect
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Prospects")
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

        $obj = $em->getRepository(ImProspect::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    private function deleteProspect($em, $ids)
    {
        $suivis  = $em->getRepository(ImSuivi::class)->findBy(['prospect' => $ids]);

        foreach($suivis as $suivi){
            $em->remove($suivi);
        }
    }

    /**
     * Delete a prospect
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Prospects")
     *
     * @param $id
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete($id, DataService $dataService): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $obj = $em->getRepository(ImProspect::class)->find($id);

        if($obj->getSearch()){
            $em->remove($obj->getSearch());
        }

        $this->deleteProspect($em, $obj);

        return $dataService->deleteTransac($user, $obj);
    }

    /**
     * Admin - Delete a group of prospects
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
     * @OA\Tag(name="Prospects")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
        $ids = json_decode($request->getContent());

        $objs = $em->getRepository(ImProspect::class)->findBy(['id' => $ids]);
        $this->deleteProspect($em, $ids);

        foreach ($objs as $obj) {
            $em->remove($obj);
            if($obj->getSearch()){
                $em->remove($obj->getSearch());
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la s??lection r??ussie !");
    }

    /**
     * Switch isArchived
     *
     * @Route("/{id}/switch-archived", name="switch_archived", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns contact object",
     * )
     *
     * @OA\Tag(name="Prospects")
     *
     * @param ImProspect $obj
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function switchArchived(ImProspect $obj, ApiResponse $apiResponse): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);

        $status = !$obj->getIsArchived();

        $obj->setIsArchived($status);
        if($obj->getSearch()){
            $obj->getSearch()->setIsActive(!$status);
        }

        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
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
        return $this->immoService->exportData($format, $user, ImProspect::class, 'prospects');
    }
}
