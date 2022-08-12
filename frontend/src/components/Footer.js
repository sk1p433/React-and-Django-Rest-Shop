import Container from "react-bootstrap/Container";
import Typography from '@mui/material/Typography';
import Navbar from "react-bootstrap/Navbar";


function Footer() {
    return (
        <div>
            <footer style={{ position:'sticky' }}> 
                <Navbar collapseOnSelect expand="lg" bg="dark">
                <Container style={{justifyContent: 'center'}}>
                <Navbar.Brand><Typography style={{color:'white', fontFamily: 'sans-serif', fontWeight: 500, fontSize: 17 }}>
                  PC Shop© 2022 Все права защищены
                </Typography></Navbar.Brand>
                </Container>
                </Navbar>
            </footer> 
        </div>
    )
}

export default Footer
