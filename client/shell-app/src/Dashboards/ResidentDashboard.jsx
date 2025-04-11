import React, { useState, lazy, Suspense } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ButtonGroup,
  Spinner,
} from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Label } from "../../shared/resources";
const NewsList = lazy(() => import("communityBusinessApp/NewsList"));

export const ResidentDashboardComponent = () => {
  const navigate = useNavigate();

  const [username] = useState(sessionStorage.getItem("username") || "");

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8} md={10} sm={12}>
          {/* Welcome section */}
          <h3 className="text-center mb-4">{Label.setTitle(username)}</h3>

          {/* Action buttons */}
          <div className="d-flex justify-content-center mb-4">
            <ButtonGroup>
              <Button
                variant="success"
                onClick={() => navigate("/news")}
                className="d-flex align-items-center"
              >
                <FaPlusCircle />
                <span>{Label.NEWS}</span>
              </Button>
              <Button
                variant="danger"
                onClick={() => navigate("/alerts")}
                className="d-flex align-items-center"
              >
                <FaPlusCircle />
                <span>{Label.ALERT}</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/requests")}
                className="d-flex align-items-center"
              >
                <FaPlusCircle />
                <span>{Label.REQUEST}</span>
              </Button>
            </ButtonGroup>
          </div>

          <Row>
            {/* Column for news list */}
            <Col md={6}>
              <div className="overflow-auto" style={{ maxHeight: "450px" }}>
                <Suspense
                  fallback={
                    <div className="text-center p-4">
                      <Spinner animation="border" variant="primary" />
                      <span className="ms-2">Loading news..</span>
                    </div>
                  }
                >
                  <NewsList />
                </Suspense>
              </div>
            </Col>

            {/* Column for insights, if we decide to keep this */}
            <Col md={6}>
              <div className="d-flex align-items-center mb-2">
                <h4 className="mb-0 me-2">Insights</h4>
                <Button
                  size="sm"
                  variant="link"
                  className="p-0"
                  style={{ color: "#158754", lineHeight: 1 }}
                >
                  <FaPlusCircle />
                </Button>
              </div>
              {/* Placeholder for insights content */}
              <div className="text-muted">Insights component will go here</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
