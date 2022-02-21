<?php

namespace App\Repository\Immo;

use App\Entity\Immo\ImPublish;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImPublish|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImPublish|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImPublish[]    findAll()
 * @method ImPublish[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImPublishRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImPublish::class);
    }

    // /**
    //  * @return ImPublish[] Returns an array of ImPublish objects
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
    public function findOneBySomeField($value): ?ImPublish
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
