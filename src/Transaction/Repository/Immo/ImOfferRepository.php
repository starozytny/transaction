<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImOffer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImOffer|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImOffer|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImOffer[]    findAll()
 * @method ImOffer[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImOfferRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImOffer::class);
//    }

    // /**
    //  * @return ImOffer[] Returns an array of ImOffer objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ImOffer
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
