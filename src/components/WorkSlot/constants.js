import * as yup from "yup";

export const initialValues = {
  date: "",
};

export const schema = yup.object().shape({
  date: yup.date().required("Date is required"),
});
