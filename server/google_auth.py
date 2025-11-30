import os
import uuid
import logging

from flask import Blueprint, request, jsonify
from flask_login import LoginManager, login_user

from server.database import db
from server.models import User

logger = logging.getLogger(__name__)

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_OAUTH_CLIENT_ID", "")

google_auth = Blueprint("google_auth", __name__)

def init_login_manager(app):
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "index"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    return login_manager


@google_auth.route("/api/auth/google", methods=["POST"])
def google_login():
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    
    if not GOOGLE_CLIENT_ID:
        logger.error("Google OAuth not configured - missing GOOGLE_OAUTH_CLIENT_ID")
        return jsonify({"message": "Google OAuth not configured"}), 500
    
    data = request.json
    credential = data.get("credential")
    
    if not credential:
        logger.error("No credential token received")
        return jsonify({"message": "No credential token provided"}), 400
    
    try:
        idinfo = id_token.verify_oauth2_token(
            credential, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            logger.error(f"Invalid token issuer: {idinfo['iss']}")
            return jsonify({"message": "Invalid token issuer"}), 401
        
        if not idinfo.get("email_verified", False):
            logger.error("Email not verified by Google")
            return jsonify({"message": "Email not verified by Google"}), 401
        
        email = idinfo["email"]
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")
        picture = idinfo.get("picture", "")
        
        logger.info(f"Google login successful for: {email}")
        
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email=email,
                first_name=first_name,
                last_name=last_name,
                profile_image_url=picture
            )
            db.session.add(user)
            db.session.commit()
            logger.info(f"New user created via Google: {email}")
        else:
            user.first_name = first_name or user.first_name
            user.last_name = last_name or user.last_name
            user.profile_image_url = picture or user.profile_image_url
            db.session.commit()
            logger.info(f"Existing user logged in via Google: {email}")
        
        login_user(user)
        
        return jsonify({
            "user": {
                "id": user.id,
                "email": user.email,
                "firstName": user.first_name,
                "lastName": user.last_name,
                "displayName": user.display_name,
                "profileImageUrl": user.profile_image_url
            }
        })
        
    except ValueError as e:
        logger.error(f"Invalid Google token: {str(e)}")
        return jsonify({"message": "Invalid Google token"}), 401
    except Exception as e:
        logger.error(f"Google authentication error: {str(e)}")
        return jsonify({"message": f"Authentication error: {str(e)}"}), 500
