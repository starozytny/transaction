<?php

namespace App\Repository\Agenda;

use App\Transaction\Entity\Agenda\AgEvent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method AgEvent|null find($id, $lockMode = null, $lockVersion = null)
 * @method AgEvent|null findOneBy(array $criteria, array $orderBy = null)
 * @method AgEvent[]    findAll()
 * @method AgEvent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AgEventRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, AgEvent::class);
//    }

    // /**
    //  * @return Agenda[] Returns an array of Agenda objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Agenda
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
