export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Genderfluid = 'genderfluid',
  Genderqueer = 'genderqueer',
  Cisgender = 'cisgender',
  Rather_not_say = 'rather_not_say',
}

export enum NotificationType {
  ORDINARY_USER_CREATED = 'ordinary_user_created',
  ORDINARY_USER_LOGGED_IN = 'ordinary_user_logged_in',
  ORDINARY_USER_DELETED = 'ordinary_user_deleted',
  ORDINARY_USER_PASSWORD_CHANGED = 'ordinary_user_password_changed',
  COMMENT_MADE = 'comment_made',
  COMMENT_DELETED = 'comment_deleted',
  COMMENT_EDITED = 'comment_edited',
  REPLIED_A_COMMENT = 'replied_a_comment',
  REPLY_DELETED = 'reply_deleted',
  REPLY_EDITED = 'reply_edited',
  EMAIL_VERIFICATION = 'email_verification',
  BLOGPOST_CREATED = 'blogpost_created',
  BLOGPOST_EDITED = 'blogpost_edited',
  BLOGPOST_DELETED = 'blogpost_deleted',
  ADMIN_CREATED = 'admin_created',
  ADMIN_PASSWORD_CHANGED = 'admin_password_changed',
  LIKED_A_POST = 'liked_a_post',
  LIKED_A_COMMENT = 'liked_a_comment',
  LIKED_A_REPLY = 'liked_a_reply',
  LOGGED_IN = 'logged_in',
}

export enum LikeAction {
  LIKE = 'like',
}

export enum IdeaTags {
  BUSINESS = 'Business',
  INVENTIONS = 'Inventions',
  TECHNOLOGY = 'Technology',
  EDUCATION = 'Education',
  ATIFCIAL_INTELLIGENCE = 'Artificial_Intelligence',
  SOFTWARE = 'Software',
}
