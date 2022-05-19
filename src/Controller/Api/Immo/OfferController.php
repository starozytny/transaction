<?php

namespace App\Controller\Api\Immo;

use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImOffer;
use App\Entity\Immo\ImProspect;
use App\Entity\Immo\ImSuivi;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Data\DataService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/offers", name="api_offers_")
 */
class OfferController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function submitForm($type, ImOffer $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataImmo $dataEntity, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataOffer($obj, $data);

        $prospect = $em->getRepository(ImProspect::class)->find($data->prospect->id);
        $bien = $em->getRepository(ImBien::class)->find($data->bien->id);

        $obj->setProspect($prospect);
        $obj->setBien($bien);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        if($suivi = $this->getSuivi($bien, $prospect)){
            $suivi->setStatus(ImSuivi::STATUS_PROCESSING);
        }

        $em->persist($obj);
        $em->flush();

        return $this->returnData($apiResponse, $serializer, $obj, $suivi);
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
     */
    public function create(Request $request, SerializerInterface $serializer, ValidatorService $validator, ApiResponse $apiResponse, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new ImOffer(), $request, $apiResponse, $validator, $dataEntity, $serializer);
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
     * @param ImOffer $obj
     * @param DataImmo $dataEntity
     * @return JsonResponse
     */
    public function update(Request $request, SerializerInterface $serializer, ValidatorService $validator,  ApiResponse $apiResponse,
                           ImOffer $obj, DataImmo $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity, $serializer);
    }

    /**
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
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
     * @param ImOffer $obj
     * @param ApiResponse $apiResponse
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function delete(ImOffer $obj, ApiResponse $apiResponse, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $em->remove($obj);

        $suivi = $this->getSuivi($obj->getBien(), $obj->getProspect());
        if($suivi){
            $suivi->setStatus(ImSuivi::STATUS_PROCESSED);
        }

        $em->flush();

        return $this->returnData($apiResponse, $serializer, $obj, $suivi);
    }

    /**
     * @Route("/{id}/status/{status}", name="switch_status", options={"expose"=true}, methods={"PUT"})
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
     * @param ImOffer $obj
     * @param $status
     * @param ApiResponse $apiResponse
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function switchStatus(ImOffer $obj, $status, ApiResponse $apiResponse, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $obj->setStatus($status);

        $suivi = $this->getSuivi($obj->getBien(), $obj->getProspect());
        if($suivi){
            if($status != ImOffer::STATUS_PROPAL){
                $suivi->setStatus(ImSuivi::STATUS_PROCESSED);
            }else{
                $suivi->setStatus(ImSuivi::STATUS_PROCESSING);
            }
        }

        $em->flush();

        return $this->returnData($apiResponse, $serializer, $obj, $suivi);
    }

    /**
     * @Route("/{id}/final", name="final", options={"expose"=true}, methods={"PUT"})
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
     * @OA\Tag(name="Offers")
     *
     * @param Request $request
     * @param SerializerInterface $serializer
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param ImOffer $obj
     * @param DataImmo $dataEntity
     * @return JsonResponse
     */
    public function final(Request $request, SerializerInterface $serializer, ValidatorService $validator,  ApiResponse $apiResponse,
                          ImOffer $obj, DataImmo $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataOfferFinal($obj, $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        if($suivi = $this->getSuivi($obj->getBien(), $obj->getProspect())){
            $suivi->setStatus(ImSuivi::STATUS_PROCESSING);
        }

        $em->persist($obj);
        $em->flush();

        return $this->returnData($apiResponse, $serializer, $obj, $suivi);
    }

    private function getSuivi($bien, $prospect)
    {
        $em = $this->doctrine->getManager();

        return  $em->getRepository(ImSuivi::class)->findOneBy([
            'bien' => $bien,
            'prospect' => $prospect
        ]);
    }

    private function returnData(ApiResponse $apiResponse, SerializerInterface $serializer, ImOffer $offer, ImSuivi $suivi): JsonResponse
    {
        $offer = $serializer->serialize($offer, 'json', ['groups' => ImOffer::OFFER_READ]);
        $suivi = $serializer->serialize($suivi, 'json', ['groups' => ImSuivi::SUIVI_READ]);

        return $apiResponse->apiJsonResponseCustom([
            'offer' => $offer,
            'suivi' => $suivi,
        ]);
    }
}
