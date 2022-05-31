<?php

namespace App\Transaction\Entity\Immo;

use App\Transaction\Repository\Immo\ImSettingsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImSettingsRepository::class)
 */
class ImSettings
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $negotiatorDefault = 0;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $mandatMonthVente = 0;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $mandatMonthLocation = 0;

    /**
     * @ORM\OneToOne(targetEntity=ImAgency::class, cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $agency;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNegotiatorDefault(): ?int
    {
        return $this->negotiatorDefault;
    }

    public function setNegotiatorDefault(int $negotiatorDefault): self
    {
        $this->negotiatorDefault = $negotiatorDefault;

        return $this;
    }

    public function getMandatMonthVente(): ?int
    {
        return $this->mandatMonthVente;
    }

    public function setMandatMonthVente(?int $mandatMonthVente): self
    {
        $this->mandatMonthVente = $mandatMonthVente;

        return $this;
    }

    public function getMandatMonthLocation(): ?int
    {
        return $this->mandatMonthLocation;
    }

    public function setMandatMonthLocation(int $mandatMonthLocation): self
    {
        $this->mandatMonthLocation = $mandatMonthLocation;

        return $this;
    }

    public function getAgency(): ?ImAgency
    {
        return $this->agency;
    }

    public function setAgency(ImAgency $agency): self
    {
        $this->agency = $agency;

        return $this;
    }
}
