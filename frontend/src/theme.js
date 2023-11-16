import { createTheme } from '@mui/material/styles';
import { amber,green,orange, cyan,blue } from '@mui/material/colors';


const themeBlueBook = createTheme({
  name:"Muted",

  palette: {
      
    primary:  {main: "#021826",},

    secondary: {main:cyan[600],},

    alert:{ main: orange[500],},

    
    background:{
      paper: "#fffeea",
      default:"#1b383d",
  },
  text:{
      primary:"#021826",
      secondary:orange[500],
      alert:"#6101b5",
  }
  },

  typography:{
    lore: {
      fontSize: '5rem',
      color: '#84185b',
      fontFamily: "'Lovers Quarrel', 'Lucida Handwriting', cursive",
    },
    loreSmall: {
      fontSize: '1.5rem',
      color: '#84185b',
      fontFamily: "'Lucida Handwriting', cursive",
    },
  }
})

const themeOrangeBook = createTheme(  {
  name:"Orange",

    palette: {
      
      primary: {
        light: amber[300],
        main: amber[500],
        dark: amber[800],
        contrastText: '#000',
      },

      secondary:  {
        light: orange['A100'],
        main: orange[500],
        dark:"#b22a00",
        contrastText:"#fff"    
    },
    alert:{
        main: "#6101b5",
        contrastText:"#fff"
    },
    //   {
    //     light:"#d83219",
    //     main:"#9e0200",
    //     dark:"#05645e",
    //     contrastText:"#fff",
    //   },
      
      background:{
        paper: "#fffeea",
        default:"#601201",
    },
    text:{
        primary:"#000",
        secondary:"#b22a00",
        alert:"#6101b5",
    }
    },

    typography:{
      lore: {
        fontSize: '5rem',
        color: '#d50000',
        fontFamily: "'Lovers Quarrel', 'Lucida Handwriting', cursive",
      },
      loreSmall: {
        fontSize: '1.5rem',
        color: '#d50000',
        fontFamily: "'Lucida Handwriting', cursive",
      },
    }
    
  })

  const themeDark = createTheme(  {
    name:"Dark",

    palette: {
        mode: "dark",
      primary: {
        main: cyan[600],
        light: cyan[400],
        dark: cyan[900],
        contrastText:"#fff"
      },
      secondary: {
        light:blue[300],
        main:blue[700],
        dark:blue[900],
        contrastText:"#fff"
      },
      background:{
        paper: "#111",
        default:"#000",
      },
      text:{
        primary:"#fff",
        secondary:cyan[400],
        alert:"d50000",
    },
    alert:{ main: "#d50000",},

    },
    typography:{
      lore: {
        fontSize: '5rem',
        color: '#d50000',
        fontFamily: "'Lovers Quarrel', 'Lucida Handwriting', cursive",
      },
      loreSmall: {
        fontSize: '1.5rem',
        color: '#d50000',
        fontFamily: "'Lucida Handwriting', cursive",
      },
    }
  })  
  export {themeBlueBook, themeOrangeBook, themeDark};