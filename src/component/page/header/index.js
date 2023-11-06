import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header(props) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Notification</Nav.Link>
            <Nav.Link href="#link">Chat</Nav.Link>
            <NavDropdown title="Others.." id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Leave Request</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Cut 
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Off</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Contact Personal Dosen
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;