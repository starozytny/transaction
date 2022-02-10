<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImNumberRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImNumberRepository::class)
 */
class ImNumber
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
     * @Groups({"user:read", "suivi:read"})
     */
    private $piece;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read", "suivi:read"})
     */
    private $room;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $bathroom;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $wc;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read", "suivi:read"})
     */
    private $balcony;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read", "suivi:read"})
     */
    private $parking;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read", "suivi:read"})
     */
    private $box;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPiece(): ?int
    {
        return $this->piece;
    }

    public function setPiece(int $piece): self
    {
        $this->piece = $piece;

        return $this;
    }

    public function getRoom(): ?int
    {
        return $this->room;
    }

    public function setRoom(?int $room): self
    {
        $this->room = $room;

        return $this;
    }

    public function getBathroom(): ?int
    {
        return $this->bathroom;
    }

    public function setBathroom(?int $bathroom): self
    {
        $this->bathroom = $bathroom;

        return $this;
    }

    public function getWc(): ?int
    {
        return $this->wc;
    }

    public function setWc(?int $wc): self
    {
        $this->wc = $wc;

        return $this;
    }

    public function getBalcony(): ?int
    {
        return $this->balcony;
    }

    public function setBalcony(?int $balcony): self
    {
        $this->balcony = $balcony;

        return $this;
    }

    public function getParking(): ?int
    {
        return $this->parking;
    }

    public function setParking(?int $parking): self
    {
        $this->parking = $parking;

        return $this;
    }

    public function getBox(): ?int
    {
        return $this->box;
    }

    public function setBox(?int $box): self
    {
        $this->box = $box;

        return $this;
    }
}
