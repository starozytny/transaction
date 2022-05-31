<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImAdvert;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImAdvert|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImAdvert|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImAdvert[]    findAll()
 * @method ImAdvert[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImAdvertRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImAdvert::class);
    }

    // /**
    //  * @return ImAdvert[] Returns an array of ImAdvert objects
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
    public function findOneBySomeField($value): ?ImAdvert
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
