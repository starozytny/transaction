<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImContractant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImContractant|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImContractant|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImContractant[]    findAll()
 * @method ImContractant[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImContractantRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImContractant::class);
//    }

    // /**
    //  * @return ImContractant[] Returns an array of ImContractant objects
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
    public function findOneBySomeField($value): ?ImContractant
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
