<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImPublishRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImPublishRepository::class)
 */
class ImPublish
{
    const PUBLISH_READ = ["publish:read"];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"publish:read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, fetch="EAGER", inversedBy="publishes")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"publish:read"})
     */
    private $bien;

    /**
     * @ORM\ManyToOne(targetEntity=ImSupport::class, fetch="EAGER", inversedBy="publishes")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"publish:read"})
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
