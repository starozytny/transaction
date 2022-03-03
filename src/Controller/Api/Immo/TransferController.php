<?php

namespace App\Controller\Api\Immo;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImNegotiator;
use App\Entity\User;
use App\Service\ApiResponse;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/immo/transfer", name="api_immo_transfer_")
 * @Security("is_granted('ROLE_ADMIN')")
 */
class TransferController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     *
     * @Route("/", name="start", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns object"
     * )
     * @OA\Tag(name="Transfer")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function start(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if(!isset($data->from) && !isset($data->to)){
            return $apiResponse->apiJsonResponseBadRequest("Veuillez renseigner les agences concernées.");
        }

        $from = $em->getRepository(ImAgency::class)->find($data->from);
        $to   = $em->getRepository(ImAgency::class)->find($data->to);
        $negotiator   = $em->getRepository(ImNegotiator::class)->find($data->negotiator);
        $user         = $em->getRepository(User::class)->find($data->user);

        if(!$from || !$to || !$negotiator || !$user){
            return $apiResponse->apiJsonResponseBadRequest("Les champs renseignées sont incorrectes.");
        }

        foreach($from->getBiens() as $bien){

        }

        dump(count($from->getBiens()));
        dump(count($to->getBiens()));


        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
