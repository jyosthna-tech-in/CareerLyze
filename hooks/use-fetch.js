import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/ai-errors";

const useFetch = (cb, options = {}) => {
  const { showErrorToast = true } = options;
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      const resolvedError = new Error(getErrorMessage(error));
      setError(resolvedError);

      if (showErrorToast) {
        toast.error(resolvedError.message);
      }

      throw resolvedError;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
