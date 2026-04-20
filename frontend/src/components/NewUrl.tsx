import { useLocation } from "react-router";

const NewUrl = () => {
  const { state } = useLocation();
  const { oldUrl, newUrl, adminUrl } = state;

  return (
    <div>
      <h1>Your Shortened URL</h1>
      <h2>
        Copy the short link and share it in messages, texts, posts, websites and
        other locations.
      </h2>
      <div>
        <h2>Your new URL is: </h2>
        <a href={newUrl}>{newUrl}</a>
      </div>
      <div>
        <h2>Long URL:</h2>
        <a href={oldUrl}>{oldUrl}</a>
      </div>
      <p>Your admin url is: {adminUrl}, use this to delete the shortened URL</p>
    </div>
  );
};

export default NewUrl;
