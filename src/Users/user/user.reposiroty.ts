import { UserEntity } from "src/Entity/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{}