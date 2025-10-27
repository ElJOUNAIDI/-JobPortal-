import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Nav } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('statistics');
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Utilisation de useCallback pour mémoriser la fonction
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'statistics') {
        const statsResponse = await adminAPI.getStatistics();
        setStatistics(statsResponse.data);
      } else if (activeTab === 'users') {
        const usersResponse = await adminAPI.getUsers();
        setUsers(usersResponse.data.data);
      } else if (activeTab === 'jobs') {
        const jobsResponse = await adminAPI.getAllJobs();
        setJobs(jobsResponse.data.data);
      } else if (activeTab === 'applications') {
        const appsResponse = await adminAPI.getAllApplications();
        setApplications(appsResponse.data.data);
      }
      
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]); // activeTab comme dépendance

  useEffect(() => {
    loadData();
  }, [loadData]); // loadData comme dépendance (maintenant mémorisé)

  const StatisticsTab = () => {
    if (!statistics) return null;

    return (
      <Row className="g-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{statistics.total_users}</h3>
              <p className="text-muted mb-0">Utilisateurs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{statistics.total_employers}</h3>
              <p className="text-muted mb-0">Employeurs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{statistics.total_candidates}</h3>
              <p className="text-muted mb-0">Candidats</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{statistics.total_jobs}</h3>
              <p className="text-muted mb-0">Offres</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{statistics.active_jobs}</h3>
              <p className="text-muted mb-0">Offres actives</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{statistics.total_applications}</h3>
              <p className="text-muted mb-0">Candidatures</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  const UsersTab = () => (
    <Card>
      <Card.Body className="p-0">
        <Table responsive hover>
          <thead className="bg-light">
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Type</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={
                    user.type === 'admin' ? 'danger' :
                    user.type === 'employer' ? 'success' : 'primary'
                  }>
                    {user.type}
                  </Badge>
                </td>
                <td>
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <Button size="sm" variant="outline-primary">
                    Modifier
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const JobsTab = () => (
    <Card>
      <Card.Body className="p-0">
        <Table responsive hover>
          <thead className="bg-light">
            <tr>
              <th>Titre</th>
              <th>Entreprise</th>
              <th>Employeur</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.employer?.name}</td>
                <td>
                  <Badge bg={job.is_active ? 'success' : 'secondary'}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  {new Date(job.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <Button size="sm" variant="outline-danger">
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const ApplicationsTab = () => (
    <Card>
      <Card.Body className="p-0">
        <Table responsive hover>
          <thead className="bg-light">
            <tr>
              <th>Candidat</th>
              <th>Offre</th>
              <th>Entreprise</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(application => (
              <tr key={application.id}>
                <td>{application.candidate?.name}</td>
                <td>{application.job?.title}</td>
                <td>{application.job?.company}</td>
                <td>
                  <Badge bg={
                    application.status === 'accepted' ? 'success' :
                    application.status === 'rejected' ? 'danger' :
                    application.status === 'reviewed' ? 'info' : 'warning'
                  }>
                    {application.status}
                  </Badge>
                </td>
                <td>
                  {new Date(application.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      );
    }

    switch (activeTab) {
      case 'statistics':
        return <StatisticsTab />;
      case 'users':
        return <UsersTab />;
      case 'jobs':
        return <JobsTab />;
      case 'applications':
        return <ApplicationsTab />;
      default:
        return <StatisticsTab />;
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2">Administration</h1>
          <p className="text-muted">
            Tableau de bord de gestion de la plateforme
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="statistics">Statistiques</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="users">Utilisateurs</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="jobs">Offres</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="applications">Candidatures</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {renderTabContent()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;