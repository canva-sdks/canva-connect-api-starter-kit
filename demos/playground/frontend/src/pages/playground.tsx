import { Box, Input } from "@mui/material";
import { DemoButton, DeveloperNote } from "src/components";
import { Endpoints, fetchData } from "../services";
import { useState } from "react";

export const PlaygroundPage = () => {
  const [response, setResponse] = useState("");

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <DeveloperNote info="Now that you're successfully authorized, use the generated Connect API SDK to make requests and build demo integrations!" />
      <DemoButton
        demoVariant="secondary"
        onClick={async () => {
          const res = await fetchData(Endpoints.DUMMY_GET);
          console.log({
            res,
          });
          setResponse(JSON.stringify(res));
        }}
      >
        Make Dummy API Call
      </DemoButton>
      {response && <Input multiline={true} value={response} readOnly={true} />}
    </Box>
  );
};
