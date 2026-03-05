import { createContext, useState, useEffect,useContext } from "react";

const ThemeContext = createContext()

export const ThemeContextProvider = ({children}) => {
    
  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light"
})

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem("theme", theme)
      if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }
    return (
        <ThemeContext.Provider value={{
      theme,
      toggleTheme
    }}>   {children}
    </ThemeContext.Provider>
    )
}
function useTheme() {
  return useContext(ThemeContext)
}

export { useTheme }
