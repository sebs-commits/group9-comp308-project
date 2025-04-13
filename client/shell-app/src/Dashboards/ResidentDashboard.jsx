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
          <Row className="justify-content-center mb-4">
            <Col xs="auto"> {/* Automatically center the btns*/}
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
            </Col>
          </Row>

          {/* Newslist */}
          <Row>
            <h2 className="mb-4 pb-2 text-center">Community News</h2>
            <Col>
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
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
