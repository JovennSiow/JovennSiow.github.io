import * as yup from "yup";

export const populateValues = (values) => {
  return {
    username: values.username,
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    role: values.role,
    shiftsPerWeek: values.shiftsPerWeek,
    password: values.password,
  };
};

export const initialValues = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  shiftsPerWeek: "",
};

export const schema = yup.object().shape({
  username: yup.string().required("Username is required."),
  firstName: yup.string().required("First name is required."),
  lastName: yup.string().required("Last name is required."),
  email: yup.string().email("Invalid email.").required("Email is required."),
  password: yup.string().required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match.')
    .required('Confirm Password is required.'),
  role: yup.object(),
  shiftsPerWeek: yup.number(),
});
