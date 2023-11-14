import {useState} from 'react';
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

const MultipleSelectChip =(props) => {
    const fullList = props.list 
    const label = props.label
    const theme = useTheme();
    //const [options, setOptions] = useState([]);
    const options = props.state[props.name];
  
    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      // On autofill we get a stringified value.
      let tempValue = typeof value === 'string' ? value.split(',') : value;

      props.setState(() => {
        return {
            ...props.state,
            [props.name]:tempValue,
        }
      });
      //setOptions(tempValue);
    };

    const getTitle = (id) => {
      for (const page of fullList){
        if (page.id === id) return page.title
      }
      return id;
    }

    return (
        <FormControl >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
           {options.map((id) => {
                let title = getTitle(id);
                return  <Chip key={id} label={title} color='primary'/>
                })}
              </Box>
              <br/>
          {/* <InputLabel id="demo-multiple-chip-label">{label}</InputLabel> */}              
          <Select sx={{ width: 300 }}
            labelId="multiple-select-chip-label"
            id="multiple-chip"
            multiple
            displayEmpty
            value={options}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" />}
            renderValue={(selected)=> {
              if (selected.length === 0) {
              return <InputLabel id="multiple-chip-label">Select {label}</InputLabel>;
            } 
            return <InputLabel id="multiple-chip-label">{selected.length} {label} selected</InputLabel> 
          }}

            MenuProps={MenuProps}
          >
            {fullList.map((page) => (
              <MenuItem
                key={page.id}
                value={page.id}
                name={page.title}
                style={getStyles(page, options, theme)}
              >
                 <Checkbox checked={options.indexOf(page.id) > -1} />
                <ListItemText primary={page.title} />
                
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    );
  }

  export default MultipleSelectChip;