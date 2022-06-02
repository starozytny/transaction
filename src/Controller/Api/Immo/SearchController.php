<?php

namespace App\Controller\Api\Immo;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImSearch;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\Immo\SearchService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/searchs", name="api_searchs_")
 */
class SearchController extends AbstractController
{
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImSearch $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataSearch($obj, $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        $prospect = $obj->getProspect();

        return $apiResponse->apiJsonResponse($prospect, User::ADMIN_READ);
    }

    /**
     * Create a search
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Searchs")
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
        return $this->submitForm("create", new ImSearch(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update a search
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Searchs")
     *
     * @param ImSearch $obj
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param ValidatorService $validator
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update(ImSearch $obj, Request $request, ApiResponse $apiResponse, ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Delete a search
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message"
     * )
     *
     * @OA\Tag(name="Searchs")
     *
     * @param ImSearch $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(ImSearch $obj, DataService $dataService): JsonResponse
    {
        $prospect = $obj->getProspect();
        $prospect->setSearch(null);

        return $dataService->delete($obj);
    }

    /**
     * Get results search
     *
     * @Route("/results/{id}", name="results", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Searchs")
     *
     * @param Request $request
     * @param ImSearch $search
     * @param ApiResponse $apiResponse
     * @param SearchService $searchService
     * @return JsonResponse
     */
    public function results(Request $request, ImSearch $search, ApiResponse $apiResponse, SearchService $searchService): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $biens = $em->getRepository(ImBien::class)->findByCodeAdBienWithoutArchive(
            $search->getCodeTypeAd(), $search->getCodeTypeBien()
        );

        $data = json_decode($request->getContent());

        $biens = $searchService->rapprochement($search, $biens, $data);

        return $apiResponse->apiJsonResponse($biens, User::USER_READ);
    }
}
