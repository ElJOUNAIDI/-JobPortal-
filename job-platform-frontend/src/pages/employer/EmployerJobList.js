import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';

const EmployerJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    type: 'full_time',
    category: 'technology',
    application_deadline: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getEmployerJobs();
      setJobs(response.data.data);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des offres');
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await jobsAPI.create(formData);
      setShowCreateModal(false);
      resetForm();
      loadJobs();
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await jobsAPI.update(selectedJob.id, formData);
      setShowEditModal(false);
      resetForm();
      loadJobs();
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await jobsAPI.delete(selectedJob.id);
      setShowDeleteModal(false);
      loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      company: '',
      location: '',
      salary: '',
      type: 'full_time',
      category: 'technology',
      application_deadline: ''
    });
    setSelectedJob(null);
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      salary: job.salary || '',
      type: job.type,
      category: job.category,
      application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const getStatusBadge = (job) => {
    if (!job.is_active) return <Badge bg="secondary">Inactive</Badge>;
    const now = new Date();
    const deadline = new Date(job.application_deadline);
    if (job.application_deadline && deadline < now) return <Badge bg="warning">Expiré</Badge>;
    return <Badge bg="success">Active</Badge>;
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
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h2">Mes offres d'emploi</h1>
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nouvelle offre
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {jobs.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-briefcase display-1 text-muted"></i>
            <h3 className="text-muted mt-3">Aucune offre créée</h3>
            <p className="text-muted mb-4">
              Commencez par créer votre première offre d'emploi
            </p>
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
            >
              Créer ma première offre
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table responsive hover>
              <thead className="bg-light">
                <tr>
                  <th>Titre</th>
                  <th>Entreprise</th>
                  <th>Localisation</th>
                  <th>Salaire</th>
                  <th>Candidatures</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/jobs/${job.id}`} className="text-decoration-none">
                        {job.title}
                      </Link>
                    </td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      {job.salary ? formatSalary(job.salary) : 'Non spécifié'}
                    </td>
                    <td>
                      <Badge bg="primary">{job.applications_count || 0}</Badge>
                    </td>
                    <td>{getStatusBadge(job)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openEditModal(job)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => openDeleteModal(job)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal de création */}
      <JobModal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreate}
        title="Créer une nouvelle offre"
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      {/* Modal d'édition */}
      <JobModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSubmit={handleUpdate}
        title="Modifier l'offre"
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      {/* Modal de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer l'offre "{selectedJob?.title}" ?
          Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Composant modal réutilisable pour créer/modifier les offres
const JobModal = ({ show, onHide, onSubmit, title, formData, setFormData, submitting }) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Titre *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Entreprise *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Localisation *</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Salaire annuel</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Ex: 45000"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type d'emploi *</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="full_time">Temps plein</option>
                  <option value="part_time">Temps partiel</option>
                  <option value="contract">Contrat</option>
                  <option value="internship">Stage</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="technology">Technologie</option>
                  <option value="healthcare">Santé</option>
                  <option value="education">Éducation</option>
                  <option value="finance">Finance</option>
                  <option value="other">Autre</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Date limite de candidature</Form.Label>
            <Form.Control
              type="date"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EmployerJobList;