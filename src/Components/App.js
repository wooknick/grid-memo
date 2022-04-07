import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import Router from "./Router";
import Theme from "../Styles/Theme";
import GlobalStyles from "../Styles/GlobalStyles";
import AppContext from "../Context/AppContext";

const App = () => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(v => !v);
  };

  const memoContext = useMemo(
    () => ({
      editMode,
      toggleEditMode,
    }),
    [editMode],
  );

  useEffect(() => {
    function handleKeydown(e) {
      if (e.key === "e") {
        toggleEditMode();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <ThemeProvider theme={Theme}>
      <AppContext.Provider value={memoContext}>
        <GlobalStyles />
        <Router />
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default App;
