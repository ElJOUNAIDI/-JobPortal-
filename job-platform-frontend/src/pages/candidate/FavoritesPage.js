import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { favoritesAPI } from '../../services/api';
import JobList from '../../components/jobs/JobList';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getFavorites();
      // Extraire les jobs des favoris
      const jobs = response.data.data.map(fav => fav.job);
      setFavorites(jobs);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des favoris');
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (jobId) => {
    try {
      await favoritesAPI.toggleFavorite(jobId);
      // Recharger la liste après suppression
      loadFavorites();
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
      <Row className="mb-4">
        <Col>
          <h1 className="h2">Mes offres favorites</h1>
          <p className="text-muted">
            Retrouvez ici les offres que vous avez sauvegardées
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {favorites.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-heart display-1 text-muted"></i>
            <h3 className="text-muted mt-3">Aucune offre favorite</h3>
            <p className="text-muted mb-4">
              Ajoutez des offres à vos favoris pour les retrouver facilement
            </p>
            <Button as={Link} to="/jobs" variant="primary">
              Explorer les offres
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <JobList 
          jobs={favorites} 
          onFavoriteToggle={handleFavoriteToggle}
          showActions={true}
        />
      )}
    </Container>
  );
};

export default FavoritesPage;