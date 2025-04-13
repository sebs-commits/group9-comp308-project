import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { format, parseISO } from "date-fns";
import { GET_NEWS } from "../../shared/gql/news.gql.js";
import DiscussionSection from "./DiscussionSection";

const NewsPage = () => {
  const { id: newsId } = useParams();
  const navigate = useNavigate();

  const {
    loading: newsLoading,
    error: newsError,
    data: newsData,
  } = useQuery(GET_NEWS, { variables: { _id: newsId } });

  const formatCreationDate = (dateValue) => {
    try {
      return format(parseISO(dateValue), "MMMM d, yyyy");
    } catch (error) {
      console.error("Issue formatting the date", error);
      return "Invalid date";
    }
  };

  if (newsLoading)
    return <div className="container mt-5 text-light">Loading news...</div>;
  if (newsError)
    return (
      <div className="container mt-5 text-danger">
        Error loading news: {newsError.message}
      </div>
    );

  const newsItem = newsData?.news;
  if (!newsItem)
    return (
      <div className="container mt-5 text-secondary">
        News article not found.
      </div>
    );

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center text-start">
        <div className="col-md-8">
          <h1 className="display-5 mb-3 fw-bold text-light">
            {newsItem.headline}
          </h1>
          <div className="mb-4 border-bottom pb-3 border-secondary">
            <p className="text-secondary small mb-1">
              By Author ID: {newsItem.creatorId}
            </p>
            <p className="text-secondary small">
              Published on: {formatCreationDate(newsItem.creationDate)}
            </p>
          </div>
          {/* Main image */}
          {newsItem.image && (
            <img
              src={newsItem.image}
              className="img-fluid mb-4 rounded"
              alt={newsItem.headline}
            />
          )}
          {/* Body*/}
          <div className="text-light">
            <p>{newsItem.textBody}</p>
          </div>
          <button
            type="button"
            className="btn bg-success mt-4 mb-5 text-light"
            onClick={() => navigate(-1)}
          >
            Back to News List
          </button>
          <DiscussionSection newsId={newsId} />
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
