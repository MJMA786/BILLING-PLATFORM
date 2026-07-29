import { Link } from "react-router-dom";
function AuthFooter({ loginPage = true }) {

    return (

        <div className="auth-footer">

            {loginPage ? (

                <p>

                    Don't have an account?

                    <Link
                        to="/register"
                        className="auth-link ms-2"
                    >
                        Register
                    </Link>

                </p>

            ) : (

                <p>

                    Already have an account?

                    <Link
                        to="/login"
                        className="auth-link ms-2"
                    >
                        Login
                    </Link>

                </p>

            )}

            <small>

                © {new Date().getFullYear()} Billing Platform

            </small>

        </div>

    );

}
export default AuthFooter;