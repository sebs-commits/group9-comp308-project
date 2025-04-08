import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_NEWS } from "../../shared/gql/news.gql";
import { format, parseISO } from "date-fns";

const NewsList = () => {
  const { loading, error, data } = useQuery(GET_ALL_NEWS);

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
      <h2 className="mb-4 border-bottom pb-2 text-start">Community News</h2>
      <div className="w-75 p-10">
        {data.allNews.map((newsItem) => (
          <div key={newsItem._id} className="col-md-6 mb-4">
            <div
              className="card h-100 bg-transparent  hover-card"
              onClick={() => alert(newsItem.textBody)} // This is temp, dont need it just yet
            >
              <div className="card-body text-start">
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
            </div>
          </div>
        ))}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default NewsList;
