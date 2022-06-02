<?php

namespace App\Transaction\Repository\Immo;

use App\Transaction\Entity\Immo\ImPhoto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ImPhoto|null find($id, $lockMode = null, $lockVersion = null)
 * @method ImPhoto|null findOneBy(array $criteria, array $orderBy = null)
 * @method ImPhoto[]    findAll()
 * @method ImPhoto[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImPhotoRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, ImPhoto::class);
//    }

    // /**
    //  * @return ImPhoto[] Returns an array of ImPhoto objects
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
    public function findOneBySomeField($value): ?ImPhoto
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
