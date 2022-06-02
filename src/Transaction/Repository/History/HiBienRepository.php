<?php

namespace App\Transaction\Repository\History;

use App\Transaction\Entity\History\HiBien;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method HiBien|null find($id, $lockMode = null, $lockVersion = null)
 * @method HiBien|null findOneBy(array $criteria, array $orderBy = null)
 * @method HiBien[]    findAll()
 * @method HiBien[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HiBienRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, HiBien::class);
//    }

    // /**
    //  * @return HiBien[] Returns an array of HiBien objects
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
    public function findOneBySomeField($value): ?HiBien
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
