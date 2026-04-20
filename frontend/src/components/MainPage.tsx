import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";

const MainPage = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleInput = (e) => {
    e.preventDefault();
    setUrl(e.target.value);
  };

  const sendURL = async (newLink: object) => {
    const response = await fetch("http://localhost:8000/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLink),
    });
    const returnUrl = await response.json();
    navigate("/created", {
      state: {
        oldUrl: url,
        newUrl: returnUrl.url,
        adminUrl: returnUrl.admin_url,
      },
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(url);
    // send post request to backend server
    const newlink = {
      target_url: url,
    };
    sendURL(newlink);
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-name">
              Paste the URL to be shortened
            </FieldLabel>
            <Input
              id="form-name"
              type="url"
              value={url}
              onChange={handleInput}
              required
            />
          </Field>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
      <footer>footer</footer>
    </div>
  );
};

export default MainPage;
