<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImOwner;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImOwner|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImOwner|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImOwner[]    findAll()
 * @method ImOwner[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImOwnerRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImOwner::class);
//    }

    // /**
    //  * @return ImOwner[] Returns an array of ImOwner objects
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
    public function findOneBySomeField($value): ?ImOwner
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
