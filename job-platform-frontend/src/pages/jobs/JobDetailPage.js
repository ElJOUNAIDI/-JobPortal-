import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { jobsAPI, applicationsAPI, favoritesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCandidate } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume: ''
  });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadJob();
    checkFavorite();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getById(id);
      setJob(response.data);
      setError('');
    } catch (error) {
      setError('Offre non trouvée');
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!user) return;
    
    try {
      const response = await favoritesAPI.checkFavorite(id);
      setIsFavorite(response.data.is_favorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await favoritesAPI.toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await applicationsAPI.apply(id, applicationData);
      setShowApplicationModal(false);
      alert('Candidature envoyée avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la candidature');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const getTypeLabel = (type) => {
    const labels = {
      full_time: 'Temps plein',
      part_time: 'Temps partiel',
      contract: 'Contrat',
      internship: 'Stage'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
        <Button onClick={() => navigate('/jobs')}>
          Retour aux offres
        </Button>
      </Container>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Badge bg="primary" className="mb-2">
                    {getTypeLabel(job.type)}
                  </Badge>
                  <h1 className="h3 mb-2">{job.title}</h1>
                  <h2 className="h5 text-muted mb-3">
                    {job.company} • {job.location}
                  </h2>
                </div>
                <Button
                  variant={isFavorite ? "danger" : "outline-secondary"}
                  onClick={handleFavoriteToggle}
                >
                  <i className={`bi bi-heart${isFavorite ? '-fill' : ''}`}></i>
                </Button>
              </div>

              {job.salary && (
                <div className="mb-4">
                  <strong className="h4 text-primary">
                    {formatSalary(job.salary)}
                  </strong>
                  <span className="text-muted">/an</span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="h5">Description du poste</h3>
                <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {job.description}
                </p>
              </div>

              {job.application_deadline && (
                <div className="mb-3">
                  <strong>Date limite de candidature : </strong>
                  {new Date(job.application_deadline).toLocaleDateString('fr-FR')}
                </div>
              )}

              <div className="mb-3">
                <strong>Catégorie : </strong>
                <Badge bg="secondary" className="ms-2">
                  {job.category}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5 className="card-title">Postuler à cette offre</h5>
              
              {!user ? (
                <div className="text-center">
                  <p className="text-muted mb-3">
                    Connectez-vous pour postuler à cette offre
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/login')}
                    className="w-100"
                  >
                    Se connecter
                  </Button>
                </div>
              ) : !isCandidate ? (
                <div className="text-center">
                  <p className="text-muted">
                    Seuls les candidats peuvent postuler aux offres
                  </p>
                </div>
              ) : (
                <Button 
                  variant="success" 
                  className="w-100"
                  onClick={() => setShowApplicationModal(true)}
                >
                  Postuler maintenant
                </Button>
              )}
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h5 className="card-title">À propos de l'entreprise</h5>
              <p className="text-muted">
                {job.employer?.bio || 'Informations sur l\'entreprise non disponibles'}
              </p>
              <div className="text-muted">
                <i className="bi bi-envelope me-2"></i>
                {job.employer?.email}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de candidature */}
      <Modal show={showApplicationModal} onHide={() => setShowApplicationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Postuler à {job.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApply}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Lettre de motivation</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="cover_letter"
                value={applicationData.cover_letter}
                onChange={(e) => setApplicationData({
                  ...applicationData,
                  cover_letter: e.target.value
                })}
                required
                placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CV (lien)</Form.Label>
              <Form.Control
                type="text"
                name="resume"
                value={applicationData.resume}
                onChange={(e) => setApplicationData({
                  ...applicationData,
                  resume: e.target.value
                })}
                placeholder="Lien vers votre CV (optionnel)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowApplicationModal(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="success"
              disabled={applying}
            >
              {applying ? 'Envoi...' : 'Envoyer ma candidature'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default JobDetailPage;