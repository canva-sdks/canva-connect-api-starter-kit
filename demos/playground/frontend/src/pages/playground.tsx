import { Box, Input } from "@mui/material";
import { DemoButton, DeveloperNote } from "src/components";
import { useState } from "react";
import { useAppContext } from "src/context";
import { DesignService } from "@canva/connect-api-ts";

export const PlaygroundPage = () => {
  const {
    services: { client },
  } = useAppContext();
  const [response, setResponse] = useState("");

  const onClick = async () => {
    const result = await DesignService.listDesigns({ client });
    console.log(result);
    if (result.error) {
      console.error(`Error making dummy API call: ${result.error}`);
      throw new Error(result.error.message);
    }
    setResponse(JSON.stringify(result.data, null, 2));
  };

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <DeveloperNote info="Now that you're successfully authorized, use the generated Connect API SDK to make requests and build demo integrations!" />
      <DemoButton demoVariant="secondary" onClick={onClick}>
        Make Dummy API Call
      </DemoButton>
      {response && <Input multiline={true} value={response} readOnly={true} />}
    </Box>
  );
};
