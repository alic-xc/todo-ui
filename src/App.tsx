import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import Fab from "@mui/material/Fab";

interface TodoType {
  id: string;
  title: string;
  is_completed: boolean;
}

function App() {
  const [title, setTitle] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [isFetchTodo, setIsFetchTodo] = useState(true);
  const [todos, setTodos] = useState<TodoType[]>([]);

  const fetchAllTodos = async () => {
    const response = await fetch("http://127.0.0.1:8000/todos/active");
    const todoResponse = await response.json();
    setTodos(todoResponse);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (title.length > 3) {
      const formData = new FormData();
      formData.append("title", title);
      await fetch("http://127.0.0.1:8000/todo/create", {
        method: "POST",
        body: formData,
      });

      setIsFetchTodo(true);
    }
  };

  useEffect(() => {
    if (isFetchTodo) {
      fetchAllTodos();
    }
    setIsFetchTodo(false);
  }, [isFetchTodo]);

  const removeHandler = async (id) => {
    await fetch("http://127.0.0.1:8000/todo/" + id, {
      method: "PATCH",
    });
    setIsFetchTodo(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Stack width={500} border="1px solid #f1f1f1" borderRadius={1}>
          <List disablePadding>
            {todos.map((item) => (
              <>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600}> {item.title}</Typography>
                    }
                  />
                  <IconButton
                    aria-label="delete"
                    onClick={() => removeHandler(item.id)}
                    color="success"
                  >
                    <CheckIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Stack>
      </Box>
      <Stack direction="row" justifyContent="flex-end">
        <Fab color="primary" aria-label="add" onClick={() => setOpen(true)}>
          <AddIcon />
        </Fab>
      </Stack>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Stack bgcolor="white" p={3}>
          <Typography fontWeight={600} mb={2} textAlign="center">
            Create New Todo
          </Typography>
          <form onSubmit={onSubmit}>
            <Stack direction="row" gap={2}>
              <TextField
                name="title"
                size="small"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: 300 }}
              />

              <Button
                type="submit"
                size="small"
                variant="outlined"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Stack>
          </form>
        </Stack>
      </Dialog>
    </>
  );
}

export default App;
