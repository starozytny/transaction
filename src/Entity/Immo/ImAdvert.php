<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImAdvertRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImAdvertRepository::class)
 */
class ImAdvert
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $typeAdvert;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $contentSimple;

    /**
     * @ORM\Column(type="text")
     */
    private $contentFull;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeAdvert(): ?int
    {
        return $this->typeAdvert;
    }

    public function setTypeAdvert(int $typeAdvert): self
    {
        $this->typeAdvert = $typeAdvert;

        return $this;
    }

    public function getContentSimple(): ?string
    {
        return $this->contentSimple;
    }

    public function setContentSimple(?string $contentSimple): self
    {
        $this->contentSimple = $contentSimple;

        return $this;
    }

    public function getContentFull(): ?string
    {
        return $this->contentFull;
    }

    public function setContentFull(string $contentFull): self
    {
        $this->contentFull = $contentFull;

        return $this;
    }
}
