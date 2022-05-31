<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImSeller;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImSeller|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImSeller|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImSeller[]    findAll()
 * @method ImSeller[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImSellerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImSeller::class);
    }

    // /**
    //  * @return ImSeller[] Returns an array of ImSeller objects
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
    public function findOneBySomeField($value): ?ImSeller
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
