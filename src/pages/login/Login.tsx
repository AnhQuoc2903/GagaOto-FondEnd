/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Input, message } from "antd";
import { useState } from "react";
import { loginAPI } from "../../api/auth.api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginAPI({ email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      message.success("Login success");

      window.location.href = "/";
    } catch (err: any) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Garage System" style={{ width: 350 }}>
        <Input
          placeholder="Email"
          className="mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input.Password
          placeholder="Password"
          className="mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="primary" block onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </div>
  );
}
