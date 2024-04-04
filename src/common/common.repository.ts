import { Notifications } from "src/Entity/notification.entity";
import { UserOtp } from "src/Entity/otp.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Notifications)
export class NotificationRepository extends Repository<Notifications>{}



@EntityRepository(UserOtp)
export class OtpRepository extends Repository<UserOtp>{}