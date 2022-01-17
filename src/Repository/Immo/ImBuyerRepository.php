<?php

namespace App\Repository\Immo;

use App\Entity\Immo\ImBuyer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImBuyer|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImBuyer|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImBuyer[]    findAll()
 * @method ImBuyer[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImBuyerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImBuyer::class);
    }

    // /**
    //  * @return ImBuyer[] Returns an array of ImBuyer objects
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
    public function findOneBySomeField($value): ?ImBuyer
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
