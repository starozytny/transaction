<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImNumber;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImNumber|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImNumber|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImNumber[]    findAll()
 * @method ImNumber[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImNumberRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImNumber::class);
//    }

    // /**
    //  * @return ImNumber[] Returns an array of ImNumber objects
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
    public function findOneBySomeField($value): ?ImNumber
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
