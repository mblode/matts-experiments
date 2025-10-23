import { Field, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "./password-input";
import { useState } from "react";

export const PasswordStrengthBlock = () => {
  const [password, setPassword] = useState("");

  return (
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <PasswordInput
        id="password"
        autoComplete="new-password"
        showStrength
        value={password}
        onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
      />
    </Field>
  );
};
