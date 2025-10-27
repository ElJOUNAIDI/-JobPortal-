import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const JobList = ({ jobs, onFavoriteToggle, showActions = true }) => {
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const getTypeBadgeVariant = (type) => {
    const variants = {
      full_time: 'success',
      part_time: 'warning',
      contract: 'info',
      internship: 'secondary'
    };
    return variants[type] || 'primary';
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

  return (
    <Row className="g-4">
      {jobs.map(job => (
        <Col key={job.id} md={6} lg={4}>
          <Card className="h-100 job-card shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <Badge 
                  bg={getTypeBadgeVariant(job.type)} 
                  className="mb-2"
                >
                  {getTypeLabel(job.type)}
                </Badge>
                <Card.Title className="h5">{job.title}</Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  {job.company} • {job.location}
                </Card.Subtitle>
              </div>

              <Card.Text className="text-muted flex-grow-1">
                {job.description.length > 120 
                  ? `${job.description.substring(0, 120)}...` 
                  : job.description
                }
              </Card.Text>

              {job.salary && (
                <div className="mb-3">
                  <strong className="text-primary h5">
                    {formatSalary(job.salary)}
                  </strong>
                  <span className="text-muted">/an</span>
                </div>
              )}

              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    as={Link}
                    to={`/jobs/${job.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Voir détails
                  </Button>
                  
                  {showActions && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onFavoriteToggle(job.id)}
                    >
                      <i className="bi bi-heart"></i>
                    </Button>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default JobList;