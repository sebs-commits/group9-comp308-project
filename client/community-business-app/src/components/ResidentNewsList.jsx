import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_NEWS, DELETE_NEWS } from "../../shared/gql/news.gql";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { format, parseISO } from "date-fns";

const ResidentNewsList = ({ onEdit }) => {
  const loggedInUserId = sessionStorage.getItem("uid");

  const { loading, error, data, refetch } = useQuery(GET_USER_NEWS, {
    variables: { creatorId: loggedInUserId },
  });

  const [deleteNews] = useMutation(DELETE_NEWS);

  const [news, setNews] = useState([]);

  useEffect(() => {
    if (data && data.userNews) {
      setNews(data.userNews);
    }
  }, [data]);

  // Helper function to format the creation date
  const formatCreationDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error("Issue formatting the date", error);
      return dateString || "N/A";
    }
  };

  const handleDelete = async (newsId) => {
    try {
      await deleteNews({
        variables: { _id: newsId },
      });
      refetch(); // Refetch the list of news after deletion
    } catch (error) {
      console.error("An error occurred while deleting the news:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center my-5">
        Oops, something went wrong trying to fetch your news posts
      </Alert>
    );
  }

  return (
    <div className="px-5 pb-4">
      <h4 className="pt-4 pb-2">My News Posts</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Date Posted</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((newsItem, index) => (
            <tr key={newsItem._id}>
              <td>{index + 1}</td>
              <td>{newsItem.headline}</td>
              <td>{formatCreationDate(newsItem.creationDate)}</td>
              <td>{newsItem.image ? "Yes" : "No"}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit(newsItem)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleDelete(newsItem._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResidentNewsList;
