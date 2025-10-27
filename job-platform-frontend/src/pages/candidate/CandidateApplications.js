import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getCandidateApplications();
      setApplications(response.data.data);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des candidatures');
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      reviewed: 'info',
      accepted: 'success',
      rejected: 'danger'
    };
    return variants[status] || 'secondary';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      reviewed: 'En cours d\'analyse',
      accepted: 'Acceptée',
      rejected: 'Refusée'
    };
    return labels[status] || status;
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

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2">Mes candidatures</h1>
          <p className="text-muted">
            Suivez l'état de vos candidatures
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {applications.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-send display-1 text-muted"></i>
            <h3 className="text-muted mt-3">Aucune candidature</h3>
            <p className="text-muted mb-4">
              Vous n'avez pas encore postulé à des offres d'emploi
            </p>
            <Button as={Link} to="/jobs" variant="primary">
              Voir les offres
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table responsive hover>
              <thead className="bg-light">
                <tr>
                  <th>Offre</th>
                  <th>Entreprise</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(application => (
                  <tr key={application.id}>
                    <td>
                      <Link 
                        to={`/jobs/${application.job_id}`} 
                        className="text-decoration-none fw-bold"
                      >
                        {application.job?.title}
                      </Link>
                    </td>
                    <td>{application.job?.company}</td>
                    <td>
                      {new Date(application.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(application.status)}>
                        {getStatusLabel(application.status)}
                      </Badge>
                    </td>
                    <td>
                      {application.feedback ? (
                        <small className="text-muted">{application.feedback}</small>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CandidateApplications;