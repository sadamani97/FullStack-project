import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
        }),
        onSubmit: async (values) => {
            try {
                setServerError("");
                setSuccessMsg("");
                const res = await API.post("/api/auth/signup", values);
                console.log("user Registered", res.data);
                setSuccessMsg("Signup successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/"); // Redirect to login page after successful signup
                }, 1500);
            } catch (error) {
                console.log(error);
                const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
                setServerError(errorMsg);
            }
        }
    });

    return (
        <div className="container">
            <form className="form-box" onSubmit={formik.handleSubmit}>
                <h2>Signup Page</h2>
                
                {serverError && <div className="form-error">{serverError}</div>}
                {successMsg && <div className="form-success">{successMsg}</div>}
                
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        placeholder="Enter your Name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="form-error">{formik.errors.name}</div>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        placeholder="Enter your Email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="form-error">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        placeholder="Enter your Password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="form-error">{formik.errors.password}</div>
                    ) : null}
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};
export default Signup;