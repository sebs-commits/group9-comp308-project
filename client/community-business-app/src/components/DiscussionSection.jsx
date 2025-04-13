import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { format, parseISO } from "date-fns";
import { Button } from 'react-bootstrap';
import {
  GET_DISCUSSIONS_BY_NEWS_ID,
  CREATE_DISCUSSION,
  ADD_REPLY_TO_DISCUSSION,
} from "../../shared/gql/discussions.gql.js";
import { Label, Message } from '../../shared/resources';

const formatCreationDate = (dateValue) => {
  try {
    return format(parseISO(dateValue), "MMMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Issue formatting the date", error);
    return "Invalid date";
  }
};

// AI Query
const GET_ASSISTANCE = gql`
    query RequestAssistance($prompt: String!) {
        requestAssistance(prompt: $prompt)
    }
`;

const DiscussionSection = ({ newsId }) => {
  const currentUserId = sessionStorage.getItem("uid") || "tempUser";
  const [newDiscussionText, setNewDiscussionText] = useState("");
  const [replyTexts, setReplyTexts] = useState({});

  const {
    loading: discussionsLoading,
    error: discussionsError,
    data: discussionsData,
  } = useQuery(GET_DISCUSSIONS_BY_NEWS_ID, {
    variables: { newsId: newsId },
    skip: !newsId,
  });

  const [createDiscussion, { error: createError }] = useMutation(
    CREATE_DISCUSSION,
    {
      refetchQueries: [
        { query: GET_DISCUSSIONS_BY_NEWS_ID, variables: { newsId: newsId } },
      ],
    }
  );

  const [addReply, { error: replyError }] = useMutation(
    ADD_REPLY_TO_DISCUSSION,
    {
      refetchQueries: [
        { query: GET_DISCUSSIONS_BY_NEWS_ID, variables: { newsId: newsId } },
      ],
    }
  );

  const handleDiscussionSubmit = async (e) => {
    e.preventDefault();
    if (!newDiscussionText.trim() || !currentUserId) return;
    const title = `Re: News Article ${newsId}`.substring(0, 50);
    try {
      await createDiscussion({
        variables: {
          title,
          description: newDiscussionText,
          creatorId: currentUserId,
          newsId: newsId,
        },
      });
      setNewDiscussionText("");
    } catch (err) {
      console.error("Error creating discussion:", err);
    }
  };

  const handleReplyChange = (discussionId, text) =>
    setReplyTexts((prev) => ({ ...prev, [discussionId]: text }));

  const handleReplySubmit = async (e, discussionId) => {
    e.preventDefault();
    const text = replyTexts[discussionId];
    if (!text || !text.trim() || !currentUserId) return;
    try {
      await addReply({
        variables: { discussionId, creatorId: currentUserId, text },
      });
      setReplyTexts((prev) => ({ ...prev, [discussionId]: "" }));
    } catch (err) {
      console.error(`Error adding reply to discussion ${discussionId}:`, err);
    }
  };

  const discussions = discussionsData?.discussionsByNewsId || [];

  //#region States
  const [message, setMessage] = useState("");
  const [header, setHeader] = useState("");
  const [bg, setBg] = useState("");        
  const [showA, setShowA] = useState(false);
  //#endregion

  //#region CustomToast Related
  const toggleShowA = () => setShowA(!showA);
  const displayToastMsg = (header, message, bg) => {
      toggleShowA();
      setHeader(header);
      setMessage(message);
      setBg(bg);
  }
  //#endregion

  // --- REQUEST SERVER'S AI QUERY
  const { refetch: fetchAssistance } = useQuery(GET_ASSISTANCE, {
      variables: { prompt: "" },
      skip: true, // won't run automatically (useful don't remove)
  });

  const [summaryText, setSummaryText] = useState("");

  // --- THIS IS THE FUNCTION I WANT TO FOCUS ON
  const handleDiscussionSummary = async (e, discussion) => {
      e.preventDefault();

      const prompt = `
          Given the discussion post
              title: "${discussion?.title}", 
              description: "${discussion?.description}", 
          and it's replies:
          ${discussion?.replies?.map((reply) => `   - ${reply.text}`).join('\n')}

          provide a summary of the entire discussion, and point out the major points made.
          Keep in mind rude or simple feedback should not be focused on, and the summary should be strictly professional.
          The summary should be less than 100 words.
      `;

      displayToastMsg(Label.INFO, "Summarized Feedback can take a moment to load...", "info");

      try{
          const { data } = await fetchAssistance({ prompt });

          if (!data || !data.requestAssistance) {
              throw new Error("No data returned from AI");
          }

          const summaryText = data.requestAssistance;
          console.log("AI Result:", summaryText);

          if (!summaryText) { displayToastMsg(Label.ERROR, "AI response gave incorrect output", "danger"); return; }

          setSummaryText(summaryText);

          displayToastMsg(Label.SUCCESS, "AI response received", "success");
      } catch (err) {
          console.error("Error fetching assistance:", err);
          displayToastMsg(Label.ERROR, "Failed to get suggested dates", "danger");
      }
  };


  return (
    <div>
      <hr className="my-4 border-secondary" />
      <h3 className="mb-4 text-light">Discussions ({discussions.length})</h3>

      {/*  Form for discussions start here */}
      <div className="card bg-dark border-secondary mb-4 shadow-sm">
        <div className="card-body p-3">
          <h5 className="card-title text-light mb-3">Start a new discussion</h5>
          <form onSubmit={handleDiscussionSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control bg-secondary text-light border-dark placeholder-light"
                rows="3"
                placeholder="Comment here..."
                value={newDiscussionText}
                onChange={(e) => setNewDiscussionText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success btn-sm">
              Start Discussion
            </button>
            {createError && (
              <p className="text-danger mt-2 small">
                Error posting discussion {createError.message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Display Existing Discussions */}
      {discussionsLoading && (
        <p className="text-secondary">Loading discussions...</p>
      )}
      {discussionsError && (
        <p className="text-danger">
          Error loading discussions: {discussionsError.message}
        </p>
      )}

      {discussions.map((discussion) => (
        <div
          key={discussion._id}
          className="card bg-dark border-secondary mb-3 shadow-sm"
        >
          <div className="card-body p-3">
            <p className="text-light mb-1">{discussion.description}</p>
            <p className="small text-secondary mb-2">
              By {discussion.creatorId} · {formatCreationDate(discussion.createdAt)}
            </p>
            <div className="d-flex align-items-start flex-wrap">
                <Button variant="primary" className="ms-2 mb-2" style={{ whiteSpace: 'nowrap', height: 'fit-content' }} onClick={(e) => handleDiscussionSummary(e, discussion)}>Summarize Discussion</Button>
                <textarea className="form-control mb-2 bg-secondary text-light border-dark placeholder-light" style={{ flex: 1, minHeight: '10px' }} value={summaryText} readOnly />
            </div>

            {/* Replies  */}
            {discussion.replies && discussion.replies.length > 0 && (
              <div className="mt-3 ms-3 border-start border-secondary ps-3">
                {discussion.replies.map((reply) => (
                  <div key={reply._id} className="mb-2">
                    <p className="text-light mb-0 small">{reply.text}</p>
                    <p className="small text-secondary">
                      By {reply.creatorId} · {formatCreationDate(reply.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply form starts here */}
            <div className="mt-2 ms-3">
              <form
                onSubmit={(e) => handleReplySubmit(e, discussion._id)}
                className="d-flex"
              >
                <input
                  type="text"
                  className="form-control form-control-sm bg-secondary text-light border-dark placeholder-light"
                  placeholder="Reply here..."
                  value={replyTexts[discussion._id] || ""}
                  onChange={(e) =>
                    handleReplyChange(discussion._id, e.target.value)
                  }
                  required
                />
                <button
                  className="btn btn-success btn-sm flex-shrink-0"
                  type="submit"
                >
                  Reply
                </button>
              </form>
              {replyError && replyTexts[discussion._id] && (
                <p className="text-danger mt-1 small ps-1">
                  Ooopss, error replying discussion
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionSection;
