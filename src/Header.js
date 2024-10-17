import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header({ title, description }) {
  return (
    <>
      
      <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home"> {title ? title :"Welcome"}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
           {description}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

export default Header;