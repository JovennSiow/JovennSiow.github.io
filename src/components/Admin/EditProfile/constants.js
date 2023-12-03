import * as yup from "yup";

export const populateRoleValues = (values) => {
  return {
    role: values.role,
    roleDescription: values.roleDescription,
  };
};

export const roleInitialValues = {
  role: "",
  roleDescription: "",
};

export const roleSchema = yup.object().shape({
  role: yup.string().required("Role is required."),
  roleDescription: yup.string().required("Role description is required."),
});
