import LoreSummaryCard from './../common/LoreSummaryCard';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import { Grid } from '@mui/material';

const ListPages = (props) => {
		
	// Get token and list from "store" state with useSelector
    const lorelist = useSelector(state => state.lore.list);

	let {worldurl}  = useParams();

	return(
		<Grid container spacing={2}>
			{lorelist.map((page,index) => 
			<Grid key={index+page.id} item xs minWidth="240">
			<LoreSummaryCard page={page} index={index} worldurl={worldurl}/>
			</Grid>	
			)}
		</Grid>
	)
}

export default ListPages;