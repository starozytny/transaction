<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImNegotiator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImNegotiator|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImNegotiator|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImNegotiator[]    findAll()
 * @method ImNegotiator[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImNegotiatorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImNegotiator::class);
    }

    // /**
    //  * @return ImNegotiator[] Returns an array of ImNegotiator objects
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
    public function findOneBySomeField($value): ?ImNegotiator
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
