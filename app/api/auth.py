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
    ChangePassword,
    Token,
    UserLogin,
    UserRegister,
    UserResponse,
)

from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register User",
    description="Create a new user account.",
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
) -> UserResponse:
    try:
        return AuthService.register_user(db, user)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=Token,
    summary="Login",
    description="Authenticate user and return a JWT access token.",
)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db),
) -> Token:
    try:
        return AuthService.login_user(db, login_data)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Current User",
    description="Return the authenticated user's profile.",
)
def get_me(
    current_user: User = Depends(get_current_active_user),
) -> UserResponse:
    return current_user


@router.post(
    "/change-password",
    summary="Change Password",
    description="Change the password of the currently authenticated user.",
)
def change_password(
    password_data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> dict:
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