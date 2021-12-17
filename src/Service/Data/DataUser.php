<?php


namespace App\Service\Data;


use App\Entity\Immo\ImAgency;
use App\Entity\Society;
use App\Entity\User;
use App\Service\SanitizeData;
use Doctrine\ORM\EntityManagerInterface;
use mysql_xdevapi\Exception;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class DataUser
{
    private $sanitizeData;
    private $passwordHasher;
    private $em;

    public function __construct(EntityManagerInterface $entityManager, SanitizeData $sanitizeData, UserPasswordHasherInterface $passwordHasher)
    {
        $this->sanitizeData = $sanitizeData;
        $this->passwordHasher = $passwordHasher;
        $this->em = $entityManager;
    }
    public function setData(User $obj, $data): User
    {
        $pass = (isset($data->password) && $data->password != "") ? $data->password : uniqid();

        if (isset($data->roles)) {
            $obj->setRoles($data->roles);
        }

        $society = $this->em->getRepository(Society::class)->find($data->society);
        $agency = $this->em->getRepository(ImAgency::class)->find($data->agency);

        if(!$society || !$agency || $agency->getSociety()->getId() !== $society->getId()){
            throw new Exception("Erreur lien entre société et agence.");
        }

        $username = isset($data->username) ? $this->sanitizeData->fullSanitize($data->username) : $data->email;

        return ($obj)
            ->setUsername($username)
            ->setFirstname(ucfirst($this->sanitizeData->sanitizeString($data->firstname)))
            ->setLastname(mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname)))
            ->setEmail($data->email)
            ->setPassword($this->passwordHasher->hashPassword($obj, $pass))
            ->setSociety($society)
            ->setAgency($agency)
        ;
    }
}