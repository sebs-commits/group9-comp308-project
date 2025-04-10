import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_NEWS } from "../../shared/gql/news.gql";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const NewsList = () => {
  const { loading, error, data } = useQuery(GET_ALL_NEWS);

  const navigate = useNavigate();
  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  const formatCreationDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error("Issue formatting the date", error);
      return dateString;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading news: {error.message}</div>;
  if (!data?.allNews?.length) return <div>No news available</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 pb-2 text-start">Community News</h2>
      <div className="w-100 mx-auto">
        {data.allNews.map((newsItem) => (
          <div key={newsItem._id} className="col-md-6 mb-4 hover-card">
            <div
              className="h-100 bg-transparent  d-flex flex-row"
              onClick={() => handleNewsClick(newsItem._id)}
            >
              <div className="card-body text-start flex-grow-1 hover-card p-2">
                <div className="card-subtitle mb-2 text-muted d-flex justify-content-between small">
                  <span className="text-light">
                    {formatCreationDate(newsItem.creationDate)}
                  </span>
                  <span className="text-white">
                    Author: {newsItem.creatorId}
                  </span>
                </div>
                <h3 className="card-title h5 text-light">
                  {newsItem.headline}
                </h3>
                <p className="card-text text-light">
                  {newsItem.textBody.length > 150
                    ? `${newsItem.textBody.substring(0, 150)}...`
                    : newsItem.textBody}
                </p>
              </div>
              {newsItem.image && (
                <img
                  src={newsItem.image}
                  alt={newsItem.headline}
                  className="img-fluid mb-2"
                  style={{
                    maxWidth: "150px",
                    height: "auto",
                    objectFit: "cover",
                    marginLeft: "15px",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default NewsList;
