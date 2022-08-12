import React, { Component } from 'react';
import './CategoryList.css';
import axios from 'axios';
import {withRouter} from '../utils/withRouter';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


class CategoryList extends Component {
   constructor() {
     super()
     this.state = {
       categories: []
     }
     this.handleCustomerClick = this.handleCustomerClick.bind(this);
   }


  componentDidMount() {
      this.getCategories();
  }

  getCategories() {
    axios
       .get('http://127.0.0.1:8000/api/categories/')
       .then(res => {
         this.setState({ categories: res.data });
        })
       .catch(err => {
         console.log(err);
       });
   }

   handleCustomerClick(slug) {
     this.props.navigate(`/category/${slug}/`)
  }

  

render() {

   return (
     
      <div  id="categories-list">
        
        {this.state.categories.map(category => (
          
         <Card key={category.id} onClick={() => this.handleCustomerClick(category.slug)} sx={{ maxWidth: 345, maxHeight:345, width:250, height:250, margin:1 }}>
         <CardActionArea style={{width:250, height:250}}>
         
         <CardContent>
         <Typography align='center'>
         <img src={category.image} width="60%"   />
         </Typography>
         <Typography gutterBottom variant="h6" align='center' component="div" 
         style={{ position: 'absolute', bottom: 20, right: 0, left: 0, fontFamily: 'sans-serif' }}>
         {category.name}
         </Typography>
         </CardContent>
        </CardActionArea>
        </Card>
        
        ))}
        
      </div>
    );
  }
}
export default withRouter(CategoryList);
