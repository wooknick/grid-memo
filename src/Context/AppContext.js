import { createContext } from "react";

const AppContext = createContext({
  editMode: false,
  toggleEditMode: () => {},
});

export default AppContext;
