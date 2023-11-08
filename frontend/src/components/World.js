import {Route,Routes,Navigate,useParams} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import Category from './Category/Category';
import LorePage from './LorePage/LorePage';
import ListPages from './Category/ListPages';

import {Link as RouterLink} from 'react-router-dom'


//MUI
import { Grid, Typography, Paper, Divider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { Card, CardMedia, CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button } from '@mui/base';
import Link from '@mui/material/Link';
import { Breadcrumbs } from '@mui/material';

const World = (props) => {
 
    const state = useSelector((state) => {
        return {
            isLogged:state.login.isLogged,
            user:state.login.user,
            categorylist:state.category.list,
            worldid: state.world.page.id,			
            worldurl: state.world.page.custom_url

        }
    })
    const worldid = state.worldid
    const isLogged = state.isLogged
    const title = state.title
    const categorylist = state.categorylist
    const worldurl = state.worldurl


    const catLinks = categorylist? categorylist.map((cat,index) => {
		return(<Link key={cat.id} variant="h6" color="inherit" underline="hover" component={RouterLink} 
		to={"/"+worldurl+"/category/"+cat.id}>{cat.title}</Link>)
		}): "" ;

return(
    <Paper elevation={3} sx={{ p:2}}>
    <Grid container spacing={2}>
    

    <Grid item xs={8}>
    <Container sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography variant="lore">{worldurl}</Typography>
    
    <Typography variant="h6">Description:</Typography>
    <Typography variant="body1">hi</Typography>
    <Typography variant="h6">Notes:</Typography>
    <Typography variant="body1">notes</Typography>
    
    </Container>
    </Grid>
    
    {/* {image} */}
    
    </Grid>
    <Container>
    <br/>
    <br/>
    <Divider/>
    <Typography variant='loreSmall' >Lore in this World:</Typography>
    <br/>
    <br/>
    </Container>
    
    
    <Grid container spacing={5}>
    <Link variant="h6" color="inherit" underline="hover" component={RouterLink} to={"/"+worldurl}>All Pages</Link>
			  <br/>
              {catLinks}
    </Grid>
        

</Paper>

)
}

export default World;