import { createTheme } from '@mui/material/styles';
import { amber,orange,pink, } from '@mui/material/colors';


const themeLight = createTheme(  {

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

    palette: {
        mode: "dark",
      primary: {
        main: '#ffd54f',
        light:"#e2cab5",
        dark: "#472e18",
      },
      secondary: orange,
    },
  })  
  export {themeLight, themeDark};