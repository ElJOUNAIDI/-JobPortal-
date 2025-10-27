import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const AppNavbar = () => {
  const { user, logout, isEmployer, isCandidate, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <i className="bi bi-briefcase me-2"></i>
          JobPlatform
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/jobs">
              Offres d'emploi
            </Nav.Link>

            {user && isCandidate && (
              <>
                <Nav.Link as={Link} to="/my-applications">
                  Mes candidatures
                </Nav.Link>
                <Nav.Link as={Link} to="/favorites">
                  Favoris
                </Nav.Link>
              </>
            )}

            {user && isEmployer && (
              <>
                <Nav.Link as={Link} to="/employer/jobs">
                  Mes offres
                </Nav.Link>
                <Nav.Link as={Link} to="/employer/applications">
                  Candidatures
                </Nav.Link>
              </>
            )}

            {user && isAdmin && (
              <Nav.Link as={Link} to="/admin">
                Administration
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <NavDropdown 
                title={`Bonjour, ${user.name}`} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Mon profil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary"
                >
                  Connexion
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                >
                  S'inscrire
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;