import {useSelector} from 'react-redux';

import {Link as RouterLink} from 'react-router-dom'
import ImageCard from './common/ImageCard';

//MUI
import { Grid, Typography, Paper} from '@mui/material';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
            
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const World = (props) => {
 
    const appState = useSelector((state) => {
        return {
            isLogged:state.login.isLogged,
            user:state.login.user,
            categorylist:state.category.list,
            world: state.world.page

        }
    })

    const categorylist = appState.categorylist
    const worldurl = appState.world.custom_url
    const world = appState.world


    const catLinks = categorylist? categorylist.map((cat) => {
		return(
            <TableRow key={cat.id}>
            <TableCell>
                <Link  variant="h6" color="inherit" underline="hover" component={RouterLink} 
                to={"/"+worldurl+"/category/"+cat.custom_url}>{cat.title}</Link>
            </TableCell>
            <TableCell>
                <Typography align='right'>
                <Link variant="body1" align='right' color="inherit" underline="hover" component={RouterLink} 
                    to={"/"+worldurl+"/category/"+cat.custom_url}>{cat.lore_pages.length} Pages</Link>
                    </Typography>
            </TableCell>
            </TableRow>
        
        )
		}): "" ;

return(
    <Paper elevation={3} sx={{ p:2}}>
    <Grid container spacing={2}>
    

    <Grid item xs={8}>
    <Container sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography variant="lore">{world.title}</Typography>
    
    <Typography variant="h6">Description:</Typography>
    <Typography variant="body1">{world.description}</Typography>
    <Typography variant="h6">Notes:</Typography>
    <Typography variant="body1">{world.notes}</Typography>
    
    </Container>
    </Grid>
    
    <Grid item xs={4}>
    <ImageCard page={world}/>
    </Grid>
    
    </Grid>
    <br/>
    <br/>
    <Table sx={{ minWidth: 650 }} size='small' aria-label="table of categories">
    <TableHead>
        <TableRow>
            <TableCell ><Typography variant='loreSmall'>Categories in this world:</Typography></TableCell>
            <TableCell align='right'><Typography variant='h6'>Lore in the Category:</Typography> </TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {catLinks}
    </TableBody>
    </Table>
    
    <br/>

    <Link sx={{p:2}} variant="subtitle" color="link" underline="hover" component={RouterLink} to={"/"+worldurl}>View All Pages</Link>
        

</Paper>

)
}

export default World;