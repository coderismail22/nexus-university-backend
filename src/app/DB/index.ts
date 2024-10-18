import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const superAdminData = {
  id: "0001",
  email: "ismailmdhossain2@gmail.com",
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // check if there is any other super admin
  const superAdmin = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!superAdmin) {
    await User.create(superAdminData);
  }
};

export default seedSuperAdmin;
