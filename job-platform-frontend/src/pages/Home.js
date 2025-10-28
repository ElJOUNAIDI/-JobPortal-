import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth(); 

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section position-relative text-white">
        {/* === SLIDER EN FOND === */}
        <div
          id="carouselHero"
          className="carousel slide position-absolute top-0 start-0 w-100 h-100"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner h-100">
            <div className="carousel-item active h-100">
              <img
                src="/images/jobs1.webp"
                className="d-block w-100 h-100 object-fit-cover"
                alt="Job 1"
              />
            </div>
            <div className="carousel-item h-100">
              <img
                src="/images/job3.jpg"
                className="d-block w-100 h-100 object-fit-cover"
                alt="Job 2"
              />
            </div>
            <div className="carousel-item h-100">
              <img
                src="/images/jobs2.jpeg"
                className="d-block w-100 h-100 object-fit-cover"
                alt="Job 3"
              />
            </div>
          </div>
        </div>

        {/* === OVERLAY POUR FONCÉR L’IMAGE === */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

        {/* === CONTENU AU PREMIER PLAN === */}
        <Container className="position-relative z-3 py-5">
          <Row className="min-vh-70 align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Trouvez le job de vos rêves
              </h1>
              <p className="lead mb-4">
                Des milliers d'offres d'emploi dans tous les secteurs. 
                Postulez facilement et suivez vos candidatures en temps réel.
              </p>
              <div className="d-flex gap-3">
                {!isAuthenticated ? (
                  <>
                    <Button 
                      as={Link} 
                      to="/register?type=candidate" 
                      variant="light" 
                      size="lg"
                    >
                      Je cherche un emploi
                    </Button>
                    <Button 
                      as={Link} 
                      to="/register?type=employer" 
                      variant="outline-light" 
                      size="lg"
                    >
                      Je recrute
                    </Button>
                  </>
                ) : (
                  <Button 
                    as={Link} 
                    to="/jobs" 
                    variant="light" 
                    size="lg"
                  >
                    Voir les offres
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="h1 mb-3">Pourquoi choisir JobPlatform ?</h2>
              <p className="lead text-muted">
                Une plateforme moderne et intuitive pour vos recherches d'emploi
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="bi bi-lightning-charge display-4"></i>
                  </div>
                  <Card.Title>Recherche rapide</Card.Title>
                  <Card.Text className="text-muted">
                    Trouvez des offres pertinentes avec notre moteur de recherche avancé
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="bi bi-bell display-4"></i>
                  </div>
                  <Card.Title>Notifications</Card.Title>
                  <Card.Text className="text-muted">
                    Soyez alerté des nouvelles offres correspondant à votre profil
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="bi bi-graph-up display-4"></i>
                  </div>
                  <Card.Title>Suivi en temps réel</Card.Title>
                  <Card.Text className="text-muted">
                    Suivez l'évolution de vos candidatures étape par étape
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;