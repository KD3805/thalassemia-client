import { useState } from "react";

const useFormValidation = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);  
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id] || !errors[id]) {
      if(!errors[id]) {
        setErrors({ ...errors, [id]: "" })
      }
      validateField(id, value);
    } // Re-validate on input change
  };

  // Set a specific field error
  const setFieldError = (field, message) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
  };

  // Calculate Age from DOB
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Validate the entire form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name) newErrors.Name = "Name is required.";
    if (!formData.DOB) {
      newErrors.DOB = "Date of Birth is required.";
    } else if (calculateAge(formData.DOB) < 18) {
      newErrors.DOB = "Donor must be at least 18 years old.";
    }
    if (!formData.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address.";
    }
    if (!formData.Phone || !/^\d{10}$/.test(formData.Phone)) {
      newErrors.Phone = "Phone number must be exactly 10 digits.";
    }
    if (!formData.Gender) newErrors.Gender = "Gender is required.";
    if (!formData.BloodGroupName) newErrors.BloodGroupName = "Blood Group is required.";
    if (!formData.Address || formData.Address.trim() === "") {
      newErrors.Address = "Address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Validate a single field
  const validateField = (id, value) => {
    switch (id) {
      case "Email":
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setFieldError(id, "Please enter a valid email address.");
        } else {
          setFieldError(id, "");
        }
        break;
      case "Phone":
        if (!value || !/^\d{10}$/.test(value)) {
          setFieldError(id, "Phone number must be exactly 10 digits.");
        } else {
          setFieldError(id, "");
        }
        break;
      case "Quantity":
        if(!value || isNaN(value) || value <= 0 || value.toString().indexOf('0') === 0) {
          setFieldError(id, "Quantity of blood must be a positive integer.")
        } else {
          setFieldError(id, "")
        }
        break;
      case "Weight":
        if(!value || isNaN(value) || value <= 0 || value.toString().indexOf('0') === 0) {
          setFieldError(id, "Weight of donor must be a positive integer.")
        } else {
          setFieldError(id, "")
        }
        break;
      default:
        if (!value) setFieldError(id, `${id} is required.`);
        else setFieldError(id, "");
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleInputChange,
    validateForm,
    setFieldError,
    calculateAge,
  };
};

export default useFormValidation;
