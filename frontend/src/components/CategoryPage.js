import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Rating from '@mui/material/Rating';


const CategoryPage = () => {
  const [categoryName, setCategoryName] = useState([])
  const [category, setCategory] = useState([])
  const [rating, setRating] = useState(0)
  const { slug } = useParams()

  const getCategory = () => {
    axios
       .get(`http://127.0.0.1:8000/api/categories/${slug}/`)
       .then(res => {
         setCategory(res.data.products)
         setCategoryName(res.data)
         //получение рейтинга из JSON
         let getJSONRating = res.data.products
         let getRating = getJSONRating.map(item=>item.average_rating.stars__avg)
         let realRating = getRating.join("")
         setRating(Number(realRating))
         })
       .catch(err => {
         console.log(err);
       });
   }


  useEffect(() => {
    getCategory()
  }, [])

  const navigate = useNavigate()

  const handleClick = (slug) => {
    navigate(`/category/product/${slug}/`)
  }

  
return (
<> 

  <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" 
    style={{marginLeft:10, marginTop:15, position:'absolute', fontFamily: 'Arial'}}>
    <Link underline="hover" color="inherit" href="#" onClick={()=>navigate(`/`)} style={{color:'black'}}>Каталог</Link>
    <Typography style={{fontFamily: 'Arial'}}>{categoryName.name}</Typography>
  </Breadcrumbs>
    
  <Typography gutterBottom variant="h6" align='center' component="div" 
    style={{fontFamily: 'sans-serif', fontWeight: 700, fontSize: 25, margin:5 }}>{categoryName.name} 
  </Typography>
   
   <div className="product-card">
    {category.map(item => (
     <Card key={item.id} onClick={() => handleClick(item.slug)} sx={{ maxWidth: 345, maxHeight:345, width:250, height:250, margin:1 }}>
     <CardActionArea style={{width:250, height:250}}>
     <CardContent>
     <Typography align='center'>
     <img src={item.image} width="60%"   />
     </Typography>
     <Typography gutterBottom variant="h6" align='center' component="div" style={{marginTop:25, fontFamily: 'sans-serif'}}>
     {item.name}
     </Typography>
     <Rating
      size="large"
      name="read-only"
      style={{
      marginLeft: 30
      }}
      value={rating}
      readOnly
      />  
     </CardContent>
    </CardActionArea>
    </Card>
    ))}
  </div>
  </>  
 );
}

export default CategoryPage;
