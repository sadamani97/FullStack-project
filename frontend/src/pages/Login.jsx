import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";  
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";  
import API from "../services/api";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [serverError, setServerError] = useState("");

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
        }),

        onSubmit: async (values) => {
            setServerError("");
            try {
                const res = await API.post("/api/auth/login", values);
                
                localStorage.setItem("token", res.data.token);
                dispatch(loginSuccess(res.data));
                navigate("/dashboard");

            } catch (error) {
                console.log(error);
                const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
                setServerError(errorMsg);
            }
        }
    });

    return (
        <div className="container" >
            
            <form className="form-box" onSubmit={formik.handleSubmit}>
                <h2>Login Page</h2>
                
                {serverError && <div style={{ color: "red", marginBottom: "10px" }}>{serverError}</div>}
                
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
                        <div style={{ color: "red" }}>{formik.errors.email}</div>
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
                        <div style={{ color: "red" }}>{formik.errors.password}</div>
                    ) : null}
                </div>
                <button type="submit">Login</button>

                <p>
                    Don't have an account? 
                    <Link to="/signup">Signup
                    </Link>
                </p>
            </form>
        </div>
    );
};
export default Login;