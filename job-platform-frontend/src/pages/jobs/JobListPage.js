import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { jobsAPI, favoritesAPI } from '../../services/api';
import JobList from '../../components/jobs/JobList';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    location: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll(searchFilters);
      setJobs(response.data.data);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des offres');
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs(filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      location: ''
    });
    loadJobs();
  };

  const handleFavoriteToggle = async (jobId) => {
    try {
      await favoritesAPI.toggleFavorite(jobId);
      // Recharger la liste pour mettre à jour l'état des favoris
      loadJobs(filters);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
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
      <Row>
        <Col>
          <h1 className="h2 mb-4">Offres d'emploi</h1>
        </Col>
      </Row>

      {/* Filtres de recherche */}
      <Row className="mb-4">
        <Col>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Recherche</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Titre, entreprise..."
                  />
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous</option>
                    <option value="full_time">Temps plein</option>
                    <option value="part_time">Temps partiel</option>
                    <option value="contract">Contrat</option>
                    <option value="internship">Stage</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">Toutes</option>
                    <option value="technology">Technologie</option>
                    <option value="healthcare">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="finance">Finance</option>
                    <option value="other">Autre</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Localisation</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Ville, pays..."
                  />
                </Form.Group>
              </Col>

              <Col md={2} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button type="submit" variant="primary" className="flex-grow-1">
                    Rechercher
                  </Button>
                  <Button type="button" variant="outline-secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Liste des jobs */}
      {jobs.length === 0 ? (
        <Row>
          <Col>
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h3 className="text-muted mt-3">Aucune offre trouvée</h3>
              <p className="text-muted">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          </Col>
        </Row>
      ) : (
        <JobList 
          jobs={jobs} 
          onFavoriteToggle={handleFavoriteToggle}
          showActions={true}
        />
      )}
    </Container>
  );
};

export default JobListPage;