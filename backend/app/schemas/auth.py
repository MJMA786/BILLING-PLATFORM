from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ==========================================================
# Authentication Requests
# ==========================================================

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    id_token: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyResetCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


# ==========================================================
# User Response
# ==========================================================

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    role: str
    is_active: bool
    is_verified: bool

    auth_provider: str | None = "email"
    google_id: str | None = None
    profile_picture: str | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# Authentication Response
# ==========================================================

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

    user: UserResponse


# ==========================================================
# JWT Payload
# ==========================================================

class TokenData(BaseModel):
    email: str | None = None
    role: str | None = None


# ==========================================================
# Generic API Message
# ==========================================================

class MessageResponse(BaseModel):
    message: str