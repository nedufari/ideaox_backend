import { AdminEntity } from "src/Entity/admin.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(AdminEntity)
export class AdminRepository extends Repository<AdminEntity>{}