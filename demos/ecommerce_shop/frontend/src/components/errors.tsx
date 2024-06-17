import { DemoAlert } from "src/components";
import { useAppContext } from "src/context";

export const ErrorAlerts = () => {
  const { errors, setErrors } = useAppContext();

  const clearError = (error: string) => {
    setErrors((prevState: string[]) => prevState.filter((e) => e !== error));
  };

  return (
    <>
      {errors.length > 0 &&
        errors.map((error, i) => (
          <DemoAlert
            key={`${error}-${i}`}
            severity="error"
            alertTitle={error}
            onClose={() => clearError(error)}
            sx={{ marginBottom: 2 }}
          />
        ))}
    </>
  );
};
