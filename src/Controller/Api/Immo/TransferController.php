<?php

namespace App\Controller\Api\Immo;

use App\Transaction\Entity\Immo\ImAgency;
use App\Transaction\Entity\Immo\ImBien;
use App\Transaction\Entity\Immo\ImNegotiator;
use App\Transaction\Entity\Immo\ImPhoto;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\FileUploader;
use App\Service\Immo\ImmoService;
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
    private $immoService;

    public function __construct(ImmoService $immoService)
    {
        $this->immoService = $immoService;
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
     * @param ImmoService $immoService
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function start(Request $request, ApiResponse $apiResponse, ImmoService $immoService, FileUploader $fileUploader): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->immoService->getEntityUserManager($user);
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

        $biens  = $em->getRepository(ImBien::class)->findBy(['agency' => $from]);
        $photos = $em->getRepository(ImPhoto::class)->findBy(['bien' => $biens]);

        foreach($biens as $bien){

            $oriOwner = $bien->getOwner() ?: null;
            $owner = null;
            if($oriOwner){
                $owner = clone $oriOwner;
                $owner = ($owner)
                    ->setSociety($to->getSociety())
                    ->setAgency($to)
                    ->setNegotiator($owner->getNegotiator() ? $negotiator : null)
                ;

                $em->persist($owner);
            }

            foreach($photos as $photo){
                $fileUploader->moveFile($photo->getPhotoFile(), $photo->getFile(), $to->getDirname());

                $photo->setAgency($to);
            }

            $to->setCounter($to->getCounter() + 1);

            $bien = ($bien)
                ->setAgency($to)
                ->setReference($immoService->getReference($to, $bien->getCodeTypeAd()))
                ->setNegotiator($negotiator)
                ->setUserId($user->getId())
            ;

            $em->persist($bien);
        }

        $counterMandat = $to->getCounterMandat() > $from->getCounterMandat() ? $to->getCounterMandat() : $from->getCounterMandat();

        $to->setCounterMandat($counterMandat + 1);

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
