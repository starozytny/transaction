<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImAdvertRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImAdvertRepository::class)
 */
class ImAdvert
{
    const TYPE_NONE = 0;
    const TYPE_AFFAIRE = 1;
    const TYPE_HEART = 2;

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
    private $typeAdvert = self::TYPE_NONE;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user:read"})
     */
    private $contentSimple;

    /**
     * @ORM\Column(type="text")
     * @Groups({"user:read"})
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
