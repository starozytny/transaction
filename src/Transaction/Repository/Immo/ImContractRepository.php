<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImContract;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImContract|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImContract|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImContract[]    findAll()
 * @method ImContract[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImContractRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImContract::class);
//    }

    // /**
    //  * @return ImContract[] Returns an array of ImContract objects
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
    public function findOneBySomeField($value): ?ImContract
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
