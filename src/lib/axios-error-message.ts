import axios from "axios";

export const getAxiosErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;
    console.log("axios error response: ", JSON.stringify(response));

    if (response?.errors) {
      const errs = response.errors;

      if (typeof errs === "object" && !Array.isArray(errs)) {
        const firstKey = Object.keys(errs)[0];
        if (firstKey && typeof errs[firstKey] === "string") {
          return errs[firstKey];
        }
      }

      // { message: "..." }
      if (typeof errs.message === "string") {
        return errs.message;
      }

      // [{ message: "..." }]
      if (Array.isArray(errs) && errs.length > 0) {
        return errs[0].message;
      }
    }

    if (response?.message) {
      return response.message;
    }

    if (error.request) {
      return "Network error. Please check your connection.";
    }
  }

  return "Something went wrong. Please try again.";
};
