<?php

namespace App\Controller\Api\Immo;

use App\Service\Immo\ImmoService;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImContract;
use App\Transaction\Entity\Immo\ImContractant;
use App\Transaction\Entity\Immo\ImOwner;
use App\Transaction\Entity\Immo\ImProspect;
use App\Transaction\Entity\Immo\ImSuivi;
use App\Transaction\Entity\Immo\ImTenant;
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
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, ImContract $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $bien = $em->getRepository(ImBien::class)->find($data->bien->id);

        $obj = $dataEntity->setDataContract($obj, $data, $bien);

        if($type !== "update"){
            $others = $em->getRepository(ImContract::class)->findBy(['bien' => $data->bien->id, 'status' => ImContract::STATUS_PROCESSING]);
            foreach($others as $other){
                $other->setStatus(ImContract::STATUS_END);
            }
        }

        $contractant = (new ImContractant())
            ->setContract($obj)
        ;

        if($data->prospect){
            $prospect = $em->getRepository(ImProspect::class)->find($data->prospect->id);

            $dataPerson = [
                "agency" => $bien->getAgency()->getId(),
                "lastname" => $prospect->getLastname(),
                "firstname" => $prospect->getFirstname(),
                "civility" => $prospect->getCivility(),
                "email" => $prospect->getEmail(),
                "phone1" => $prospect->getPhone1(),
                "phone2" => $prospect->getPhone2(),
                "phone3" => $prospect->getPhone3(),
                "address" => $prospect->getAddress(),
                "complement" => $prospect->getComplement(),
                "zipcode" => $prospect->getZipcode(),
                "city" => $prospect->getCity(),
                "birthday" => $prospect->getBirthdayJavascript(),
                "country" => "France",
                "category" => null,
                "negotiator" => null
            ];

            $dataPerson = json_decode(json_encode($dataPerson));

            if($bien->getCodeTypeAd() == ImBien::AD_LOCATION || $bien->getCodeTypeAd() == ImBien::AD_LOCATION_VAC){
                $tenant = $dataEntity->setDataTenant(new ImTenant(), $dataPerson);
                $em->persist($tenant);

                $contractant->setTenant($tenant);
            }else{
                $owner = $dataEntity->setDataOwner(new ImOwner(), $dataPerson);
                $em->persist($owner);

                $contractant->setOwner($owner);
            }

            if($suivi = $this->getSuivi($bien, $prospect)){
                $suivi->setStatus(ImSuivi::STATUS_END);
            }
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors != true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $bien->setStatus(ImBien::STATUS_INACTIF);

        $em->persist($contractant);
        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, ImContract::CONTRACT_READ);
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
     * @OA\Tag(name="Contracts")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new ImContract(), $request, $apiResponse, $validator, $dataEntity);
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
     * @OA\Tag(name="Contracts")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param ImContract $obj
     * @param DataImmo $dataEntity
     * @return JsonResponse
     * @throws Exception
     */
    public function update(Request $request, ValidatorService $validator,  ApiResponse $apiResponse,
                           ImContract $obj, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    private function getSuivi($bien, $prospect)
    {
        $em = $this->doctrine->getManager();

        return  $em->getRepository(ImSuivi::class)->findOneBy([
            'bien' => $bien,
            'prospect' => $prospect
        ]);
    }

    /**
     * @Route("/{id}/status/{status}", name="switch_status", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     *
     * @OA\Tag(name="Changelogs")
     *
     * @param ImContract $obj
     * @param $status
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function switchStatus(ImContract $obj, $status, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $obj->setStatus($status);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, ImContract::CONTRACT_READ);
    }
}
