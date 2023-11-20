import {useState} from 'react';
import {useSelector} from 'react-redux';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(page, options, theme) {
    return {
      fontWeight:
        options.indexOf(page) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  //? THIS COMPONENT IS FOR SELECTING CONNECTIONS TO ADD TO LORE PAGE.
  //? THE CONNECTIONS ARE MEANT TO BE ONE-WAY

const ConnectionSelect =(props) => {
    //const fullList = props.list 
    const theme = useTheme();
    const options = props.state.connections;
    // const dropdownOptions = props.state.connections.map((conn)=>conn.target_id);
    const fullList = useSelector(state => state.lore.list);


    //*CONSTRUCT A DROPDOWN LIST STATE THAT WILL BE UPDATED WITH TYPE NAMES
    const [dropDownList, setDropDownList] = useState(() => {
      //get a list of ids for already established connections (RUNS ONCE AT START)
      let initIds = options.map((option) => option.target_id);
      
      let initData = fullList.map((page)=>{
        //finds the index of current iter of page in list of establised connections
        let index = initIds.indexOf(page.id);
        
        //The default data to start the dropdownlist State off with:
        
        //index is -1 if no match was found, //array[-1] is "undefined" not last entry
        if (index!==-1){
          return options[index]
        } else return {
          type: "",
          target_id:page.id}
        })
      console.log("Initdata: ",initData)
      return(initData)
    });
    const handleChange = (event) => {

        //Below is the same code functionality as
        const connections = event.target.value
        // // const {
        //   //   target: { value },
        //   // } = event;
        //*value = array of ids [id,id,id...]

        
        props.setState(() => {
          return {
              ...props.state,
              connections:connections,
          }
        });
      };

    const handleTypeChange = (event,index) => {
      //Separate onChange function for handling connection.type

      const value = event.target.value

      let templist = [...dropDownList]
      templist[index].type=value

      //UPDATE THE STATE THAT LISTS ALL CONNECTION TARGETS AND THEIR TYPES IN CURRENT EDITOR
      setDropDownList(templist)

     };


    const getTitle = (id) => {
      for (const page of fullList){
        if (page.id === id) return page.title
      }
      return id;
    }


    const getIndex = (id) => {
      for (let i=0; i<dropDownList.length; i++) {
        if (id === dropDownList[i].target_id) {
          return i
        }
      }
    }

    return (
        <FormControl >        
          <Select sx={{ width: 300 }}
            labelId="connections-select"
            id="connections-select"
            multiple
            displayEmpty
            value={options}
            onChange={handleChange}
            input={<OutlinedInput id="connections-select" />}
                        
            renderValue={(selected)=> {
                if (selected.length === 0) {
                    return <InputLabel id="connections-select-label">Add Connections</InputLabel>;
                } 
                return <InputLabel id="connections-select-label">{selected.length} Connections</InputLabel> 
            }}

            MenuProps={MenuProps}
          >
            {   fullList.map((page,index) => (
        
        <MenuItem
        key={page.id}
        value={dropDownList[index]}
        name={page.title}
        style={getStyles(dropDownList[index], options, theme)}
        >
           <Checkbox checked={options.indexOf(dropDownList[index]) > -1} />
          <ListItemText primary={page.title} />
          
        </MenuItem>
        
      ))}
    </Select>
          <br/>
          <Box alignItems="center" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
           {options.map((connection) => {
                let title = getTitle(connection.target_id);
                let index = getIndex(connection.target_id)
                return  (
                    < >
                    <TextField key={"type"+connection.target_id} name="type" label="Connection type"
                        value={dropDownList[index].type} onChange={(e)=>handleTypeChange(e,index)}/>
                    <Chip key={"target"+connection.target_id} label={title} color='primary'/>
                    <br/>
                        </>
                )
                    
                })}
              </Box>
              <br/>
        </FormControl>
    );
  }

  export default ConnectionSelect;