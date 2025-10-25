from fastapi import APIRouter,HTTPException,status,Depends
from models.user_model import User, LoginUser
from utils.db import usersdb
from Schema.user_schema import list_serial
from bson import ObjectId
import bcrypt
from fastapi.security import OAuth2PasswordRequestForm
from utils.jwt_handler import create_access_token
from utils.jwt_handler import get_current_user


router = APIRouter()


@router.get('/users')
async def get_all_users():
    users = list_serial(usersdb.find())
    return users

@router.post('/user/create')
async def create_user(user:User):
    
    user_dict = dict(user)
    
    existing_email = usersdb.find_one({"email": user_dict["email"]})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered!"
        )
    
    existing_username = usersdb.find_one({"username": user_dict["username"]})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken!"
        )
    
    password_bytes = user_dict["password"].encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    
    user_dict["password"] = hashed_password.decode('utf-8')
    
    usersdb.insert_one(user_dict)
    return {
        "message":"User created successfully!",
        "user_data":{
            "username":user_dict["username"],
            "email":user_dict["email"]
            
        }
    }
    

# @router.post('/user/login')
# async def login_user(login_data: LoginUser):
#     user = usersdb.find_one({"email": login_data.email})
    
#     if not user:
#         return {"error": "Invalid email or password"}
    
#     if bcrypt.checkpw(login_data.password.encode('utf-8'), user["password"].encode('utf-8')):
#         return {"message": "Login successful!",
#                 "user_data":{
#                     "username":user["username"],
#                     "email":user["email"]
#                 }}
#     else:
#         return {"error": "Invalid email or password"}

@router.post('/user/login')
async def login_user(login_data: LoginUser):
    user = usersdb.find_one({"email": login_data.email})

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not bcrypt.checkpw(login_data.password.encode('utf-8'), user["password"].encode('utf-8')):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"sub": user["email"]})
    return {
        "message":"login successfull",
        "user_data":{
            "username":user["username"],
            "email":user["email"]
            },
        "access_token": token, 
        "token_type": "bearer",
        }

@router.get('/user/profile')
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    email = current_user["sub"]
    user = usersdb.find_one({"email": email})
    return {"message": f"Welcome, {current_user['sub']}!",
            "user_data":{
                "username":user["username"]
            }}