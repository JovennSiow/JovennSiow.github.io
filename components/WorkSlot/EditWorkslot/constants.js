import * as yup from "yup";

export const populateWorkSlotValues = (values) => {
  return {
    date: values.date,
  };
};

export const workSlotInitialValues = {
  date: "",
};

export const workSlotSchema = yup.object().shape({
  date: yup.string().required("Date is required."),
});
