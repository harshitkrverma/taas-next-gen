import {Box, Typography} from "@mui/material";
import Header from "./components/Header.tsx";
import DynamicForm from "./utils/DynamicForm.tsx";
import {executorForm} from "./model/formStructure.ts";

function App() {

    const handleSubmit = (formData: Record<string, any>) => {
        console.log('Form Data Submitted:', formData);
    };

  return (
    <>
        <Header />
        <main>
            <Box padding={5}>
                <Typography>TAAS</Typography>
                <DynamicForm formStructure = {executorForm} onSubmit={handleSubmit} />
            </Box>
        </main>
    </>
  )
}

export default App
