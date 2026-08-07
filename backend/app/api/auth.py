from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.core.dependencies import (
    get_current_active_user,
    get_db,
)

from app.models.user import User

from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    GoogleLoginRequest,
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UserResponse,
    VerifyResetCodeRequest,
)

from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ==========================================================
# Register
# ==========================================================

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register User",
)
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db),
):

    try:

        return AuthService.register_user(
            db,
            user,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ==========================================================
# Email Login
# ==========================================================

@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login",
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):

    try:

        return AuthService.login_user(
            db,
            login_data,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


# ==========================================================
# Google Login
# ==========================================================

@router.post(
    "/google",
    response_model=AuthResponse,
    summary="Google Login",
)
def google_login(
    google_data: GoogleLoginRequest,
    db: Session = Depends(get_db),
):

    try:

        return AuthService.authenticate_google_user(
            db,
            google_data.id_token,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ==========================================================
# Refresh Token
# ==========================================================

@router.post(
    "/refresh",
    response_model=AuthResponse,
    summary="Refresh Tokens",
)
def refresh_token(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db),
):

    try:

        return AuthService.refresh_tokens(
            db=db,
            refresh_token=data.refresh_token,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


# ==========================================================
# Current User
# ==========================================================

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Current User",
)
def get_me(
    current_user: User = Depends(
        get_current_active_user,
    ),
):

    return UserResponse.model_validate(
        current_user,
    )


# ==========================================================
# Change Password
# ==========================================================

@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Change Password",
)
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_active_user,
    ),
):

    try:

        return AuthService.change_password(
            db=db,
            user=current_user,
            current_password=password_data.current_password,
            new_password=password_data.new_password,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ==========================================================
# Logout
# ==========================================================

@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout",
)
def logout():

    return AuthService.logout_user()


# ==========================================================
# Forgot Password
# ==========================================================

@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Forgot Password - Request Verification Code",
)
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):

    try:

        return AuthService.forgot_password(
            db=db,
            email=data.email,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ==========================================================
# Verify Reset Code
# ==========================================================

@router.post(
    "/verify-reset-code",
    response_model=MessageResponse,
    summary="Verify Password Reset Code",
)
def verify_reset_code(
    data: VerifyResetCodeRequest,
    db: Session = Depends(get_db),
):

    try:

        return AuthService.verify_reset_code(
            db=db,
            email=data.email,
            code=data.code,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ==========================================================
# Reset Password
# ==========================================================

@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset Password",
)
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):

    try:

        return AuthService.reset_password(
            db=db,
            email=data.email,
            code=data.code,
            new_password=data.new_password,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )