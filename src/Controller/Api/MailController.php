<?php

namespace App\Controller\Api;

use App\Entity\Contact;
use App\Entity\User;
use App\Repository\ContactRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use App\Service\MailerService;
use App\Service\NotificationService;
use App\Service\SanitizeData;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/mails", name="api_mails_")
 */
class MailController extends AbstractController
{
    /**
     * Admin - Preview mail
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="preview", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of contacts",
     * )
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param SettingsService $settingsService
     * @param ApiResponse $apiResponse
     * @return Response
     */
    public function preview(Request $request, SettingsService $settingsService, ApiResponse $apiResponse): Response
    {
        $data = json_decode($request->get('data'));

        if($data === null){
            return $apiResponse->apiJsonResponseBadRequest("Les données sont vides.");
        }

        $html = $this->renderView('app/email/template/random.html.twig', [
            'subject' => $data->subject,
            'title' => $data->title,
            'message' => $data->message->html,
            'settings' => $settingsService->getSettings()
        ]);

        return new Response($html);
    }
}
