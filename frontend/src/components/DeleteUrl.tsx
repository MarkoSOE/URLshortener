import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const DeleteUrl = () => {
  const [adminUrl, setAdminUrl] = useState("");

  const handleInput = (e) => {
    e.preventDefault();
    setAdminUrl(e.target.value);
  };

  const deleteURL = async () => {
    const response = await fetch(`http://localhost:8000/admin/${adminUrl}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const returnUrl = await response.json();
    console.log(returnUrl);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    deleteURL();
  };

  return (
    <div className="container">
      <h1>Please Enter the Admin URL to delete your shortened URL</h1>
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-name">
              Paste the Admin URL here
            </FieldLabel>
            <Input
              id="form-name"
              type="text"
              value={adminUrl}
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

export default DeleteUrl;
