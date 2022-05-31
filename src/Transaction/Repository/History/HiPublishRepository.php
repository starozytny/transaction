<?php

namespace App\Transaction\Repository\History;

use App\Transaction\Entity\History\HiPublish;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method HiPublish|null find($id, $lockMode = null, $lockVersion = null)
 * @method HiPublish|null findOneBy(array $criteria, array $orderBy = null)
 * @method HiPublish[]    findAll()
 * @method HiPublish[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HiPublishRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HiPublish::class);
    }

    // /**
    //  * @return HiPublish[] Returns an array of HiPublish objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('h.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?HiPublish
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
