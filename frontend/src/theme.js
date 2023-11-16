import { createTheme } from '@mui/material/styles';
import { amber,green,orange } from '@mui/material/colors';


const themeBlueBook = createTheme({
  name:"Muted",

  palette: {
      
    primary: {main:"#d3986e",},
    // {
    //   light: amber[300],
    //   main: '#d3986e',
    //   dark: '#021826',
    //   contrastText: '#000',
    // },

    secondary:  {main: "#021826",},
  //   {
  //     light: orange['A100'],
  //     main: orange[500],
  //     dark:"#b22a00",
  //     contrastText:"#fff"    
  // },
  alert:{ main: "#b24c33",},
  // {
  //     main: "#6101b5",
  //     contrastText:"#fff"
  // },
  //   {
  //     light:"#d83219",
  //     main:"#9e0200",
  //     dark:"#05645e",
  //     contrastText:"#fff",
  //   },
    
    background:{
      paper: "#fffeea",
      default:"#551f15",
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
        main: '#ffd54f',
        light:"#e2cab5",
        dark: "#472e18",
        contrastText:"#fff"
      },
      secondary: {
        light:green[300],
        main:green[600],
        dark:green[900],
        contrastText:"#fff"
      },
      background:{
        paper: "#111",
        default:"#000",
      },
      text:{
        primary:"#fff",
        secondary:"#b22a00",
        alert:"#6101b5",
    },
    alert:{ main: "#b24c33",},

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