function SocialLogin() {

    const handleSocialLogin = (provider) => {
        alert(
            `${provider} login will be coming soon.`
        );
    };

    return (
        <>

            <div className="social-divider">
                <span>OR</span>
            </div>

            <div className="social-login">

                <button
                    className="btn btn-light social-btn"
                    onClick={() => handleSocialLogin("Google")}
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                    />

                    Continue with Google
                </button>

                <button
                    className="btn btn-light social-btn"
                    onClick={() => handleSocialLogin("GitHub")}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                        alt="GitHub"
                    />

                    Continue with GitHub
                </button>

                <button
                    className="btn btn-light social-btn"
                    onClick={() => handleSocialLogin("Microsoft")}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                        alt="Microsoft"
                    />

                    Continue with Microsoft
                </button>

            </div>

        </>
    );
}

export default SocialLogin;