import { Card, Form } from 'react-bootstrap';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { BiDislike, BiLike } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import CartContext from '../cart/CartContext';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Rating from '@mui/material/Rating';
import parse from 'html-react-parser';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


//стиль модального окна с уведомлением
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const ProductPage = () => {

  let {addItem} = useContext(CartContext);

  const [product, setProduct] = useState([])
  const [normalPrice, setNormalPrice] = useState('')
  const [normalDescription, setNormalDescription] = useState('')
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState([])
  const [comment, setComment] = useState([])
  const [formComment, setFormComment] = useState()
  const [pageNumber, setPageNumber] = useState(0);
  const { slug } = useParams()

  const navigate = useNavigate()
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);  
  

  const getProduct = () => {
    axios
       .get(`http://127.0.0.1:8000/api/categories/product/${slug}/`)
       .then(res => {
         setProduct(res.data)
         setComment(res.data.comments)
         setCategory(res.data.category)
         setRating(res.data.average_rating.stars__avg)
         //приведение к нормальной цене с пробелом
         const getPrice = res.data.price
         const sum = getPrice.split("")
         sum.splice(-6, 0, ' ')
         const result = sum.join("")
         setNormalPrice(result)
         //приведение характерстик к нормальному виду с переносами
         const getHTMLtags = res.data.description
         const description = parse(getHTMLtags)
         setNormalDescription(description)
         })
       .catch(err => {
         console.log(err);
       });
     
   }


  useEffect(() => {
    getProduct()
  }, [])


  let handleLike = async(id) => {
    fetch(`http://127.0.0.1:8000/api/categories/product/${id}/like/`, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'Authorization': `token ${window.localStorage.getItem('LoginToken')}`,
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          handleOpen()
        }
      })
      .then(() => {
      getProduct()
    })
}

function handleDisLike(id) {
  fetch(`http://127.0.0.1:8000/api/categories/product/${id}/dislike/`, {
    method:'POST',
    headers:{
      'Content-type':'application/json',
      'Authorization': `token ${window.localStorage.getItem('LoginToken')}`,
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        handleOpen()
      }
    })
    .then(() => {
    getProduct()
  })
}

const handleRating = (e, newValue) => {
  e.preventDefault();
  fetch(
      `http://127.0.0.1:8000/api/categories/product/${product.id}/add_rating/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${window.localStorage.getItem('LoginToken')}`,
          },
        body: JSON.stringify({
          stars: newValue ? newValue: Math.round(rating),
          product: `${product.id}`,
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else {
          handleOpen()
        }
      })
      .then(() => {
      getProduct()
    })
  }

const addComment = e => {
  e.preventDefault();
    fetch(
      `http://127.0.0.1:8000/api/categories/product/${product.id}/add_comment/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${window.localStorage.getItem('LoginToken')}`,
          },
        body: JSON.stringify({
          content: formComment,
          product: `${product.id}`,
          author: 'example',
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else {
          handleOpen()
        }
      })
      .then(() => {
      getProduct()
    })
    setFormComment('')
  }
  
  const commentsPerPage = 5;
  const pagesVisited = pageNumber * commentsPerPage;

  const displayComments = comment
    .map((item) => {
      return (
        <Card border="secondary" style={{marginLeft:15, marginRight:15, marginBottom:5 }} key={item.id}>
        <Card.Header style={{ fontFamily: 'sans-serif', fontWeight: 300, fontSize: 20  }}>{item.author}
        (<small>добавлен {format(new Date(item.created_at),'dd/MM/yyyy в hh:mm')}</small>)</Card.Header>
        <p style={{marginTop:15, marginLeft:15, fontFamily: 'sans-serif'}}>{item.content}</p>
        <p><Button variant="outlined" color="success" 
        style={{ width: '4rem', marginLeft: 15, marginRight:5}} 
        onClick={() => handleLike(item.id)}>
        <BiLike style={{ margin:2}} /> {item.total_likes} 
        </Button>
        <Button variant="outlined" color="error" 
        style={{ width: '4rem'}} 
        onClick={() => handleDisLike(item.id)}>
        <BiDislike style={{ margin:2}} /> {-item.total_dislikes} 
        </Button>
         </p>
        </Card>
      );
    })
    .reverse()
    .slice(pagesVisited, pagesVisited + commentsPerPage)

    const pageCount = Math.ceil(comment.length / commentsPerPage);

    const changePage = ({ selected }) => {
    setPageNumber(selected);
    };

              
return (

<React.Fragment>
<div>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Возможность ставить товарам рейтинг, писать комментарии и их лайкать/дизлайкать доступна только для авторизованных пользователей 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button variant="contained" style={{marginRight:10}} onClick={()=> navigate('/login')}>Войти</Button> 
            <Button variant="contained" style={{marginLeft:10}} onClick={()=> navigate('/register')}>Зарегистрироваться</Button>
          </Typography>
        </Box>
     </Modal>
</div>

<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{  marginLeft: 15, marginTop:5  }}>
    <Link underline="hover" color="inherit" href="#" onClick={() => navigate(`/`)} style={{color:'black'}}>Каталог</Link>
    <Link underline="hover" color="inherit" href="#" onClick={() => navigate(-1)} style={{color:'black'}}>{category.name}</Link>
    <Typography>{product.name}</Typography>
  </Breadcrumbs>

  <Card key="0" style={{  marginLeft: 15, marginRight: 15, marginTop: 5, marginBottom:5  }}>
    <Row>
        <Col md="4">
           <img src={product.image} width="100%" style={{ margin: 10, padding:10}} alt="Товар без фото" /> 
        </Col>
        <Col >
        <Typography 
        style={{margin:10, fontFamily: 'Lato', fontWeight: 600, fontSize: 25 }}> 
        {product.name} 
        <Rating
        size='large'
        style={{
          marginLeft: 30, marginTop: 5
        }}
        value={rating}
        onChange={(e, newValue) => { handleRating(e, newValue) }}
        />  
        </Typography>
        <hr />
        <div 
        style={{ fontFamily: 'sans-serif', fontSize: 20  }}>
        {normalDescription} 
        </div>
        <hr />  
        <Typography 
        style={{margin:10, fontFamily: 'Lato', fontWeight: 600, fontSize: 30 }}> 
        Стоимость: {normalPrice}p.
        </Typography>
        <hr />
        <Button size="large" variant="contained" type="submit" style={{ marginTop:10, marginBottom:25, fontFamily: 'sans-serif'  }}
        onClick={() => addItem(product.name, product.price, product.id, product.image)}>
        Добавить в корзину
        </Button>
        </Col>
    </Row>    
  </Card>

      
    <Form style={{  marginLeft:15, marginRight:15  }} onSubmit={addComment}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
      <div className="row justify-content-center" id='comments'>
      <Form.Label style={{ fontFamily: 'sans-serif', fontWeight: 600, fontSize: 25 }}>Написать комментарий</Form.Label>
      </div>
      <Form.Control 
      style={{ fontFamily: 'sans-serif'}} as="textarea" rows={2} 
      value={formComment} 
      onChange={e => setFormComment(e.target.value)} placeholder="Напишите ваш комментарий к товару"/>
     </Form.Group>
     <Button 
     variant="contained" 
     type="submit" 
     endIcon={<SendIcon />} 
     style={{ fontFamily: 'sans-serif'  }}
     disabled={!formComment}
     >
      Отправить
     </Button>
    </Form>

    
    <div className="row justify-content-center" id='comments'><Typography 
    style={{ fontFamily: 'sans-serif', fontWeight: 600, fontSize: 25 }}>
    Комментарии   
    </Typography>
    </div>  
    <hr style={{margin: 15}} />
    
    {displayComments}
    
    {displayComments.length == 0 ? <Typography style={{ fontFamily: 'Lato', fontWeight: 600, fontSize: 25, textAlign: 'center' }}>
    У данного товара пока нет комментариев</Typography>  
    :
    <div className="row justify-content-left"><ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div> 
    } 
    </React.Fragment>

)

}

export default ProductPage;
