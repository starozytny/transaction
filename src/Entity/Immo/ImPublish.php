<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImPublishRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImPublishRepository::class)
 */
class ImPublish
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, inversedBy="publishes")
     * @ORM\JoinColumn(nullable=false)
     */
    private $bien;

    /**
     * @ORM\ManyToOne(targetEntity=ImSupport::class, inversedBy="publishes")
     * @ORM\JoinColumn(nullable=false)
     */
    private $support;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBien(): ?ImBien
    {
        return $this->bien;
    }

    public function setBien(?ImBien $bien): self
    {
        $this->bien = $bien;

        return $this;
    }

    public function getSupport(): ?ImSupport
    {
        return $this->support;
    }

    public function setSupport(?ImSupport $support): self
    {
        $this->support = $support;

        return $this;
    }
}
