import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { format, parseISO } from "date-fns";
import { GET_NEWS } from "../../shared/gql/news.gql.js";

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_NEWS, {
    variables: { _id: id },
  });

  const formatCreationDate = (dateValue) => {
    try {
      return format(parseISO(dateValue), "MMMM d, yyyy");
    } catch (error) {
      console.error("Issue formatting the date", error);
      return "Invalid date";
    }
  };

  if (loading) return <div className="container mt-5">loading</div>;
  if (error)
    return (
      <div className="container mt-5">
        Error loading news article: {error.message}
      </div>
    );

  const newsItem = data?.news;

  if (!newsItem)
    return <div className="container mt-5">Woops article not found :/</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center text-start">
        <div className="col-md-8">
          {/* Headline*/}
          <h1 className="display-5 mb-3 fw-bold">{newsItem.headline}</h1>

          <div className="mb-4 border-bottom pb-3">
            <p className="text-light small mb-1">
              By Author ID: {newsItem.creatorId}
            </p>
            <p className="text-light small">
              Published on: {formatCreationDate(newsItem.creationDate)}
            </p>
          </div>

          {/* Main image */}
          {newsItem.image && (
            <img src={newsItem.image} className="img-fluid mb-4" />
          )}

          {/* Body*/}

          <div className="">
            <p>{newsItem.textBody}</p>
          </div>

          {/* Back btn */}
          <button
            type="button"
            className="btn btn-outline-secondary mt-4"
            onClick={() => navigate(-1)}
          >
            <span>Back to News List</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
