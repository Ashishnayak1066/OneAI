import json
import os
import uuid

import requests
from flask import Blueprint, redirect, request, url_for, session
from flask_login import LoginManager, login_user, logout_user, login_required
from oauthlib.oauth2 import WebApplicationClient

from server.database import db
from server.models import User

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_OAUTH_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_OAUTH_CLIENT_SECRET", "")
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

client = None
if GOOGLE_CLIENT_ID:
    client = WebApplicationClient(GOOGLE_CLIENT_ID)

google_auth = Blueprint("google_auth", __name__)

def init_login_manager(app):
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "index"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    return login_manager


def get_redirect_uri():
    host = request.headers.get('X-Forwarded-Host') or request.headers.get('Host') or request.host
    scheme = request.headers.get('X-Forwarded-Proto', 'https')
    return f"{scheme}://{host}/google_login/callback"

@google_auth.route("/google_login")
def login():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return "Google OAuth not configured. Please add GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET.", 500
    
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    redirect_uri = get_redirect_uri()
    
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=redirect_uri,
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@google_auth.route("/google_login/callback")
def callback():
    import logging
    logger = logging.getLogger(__name__)
    
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        logger.error("Google OAuth not configured")
        return "Google OAuth not configured.", 500
    
    error = request.args.get("error")
    if error:
        logger.error(f"Google OAuth error: {error}")
        return f"Google OAuth error: {error}", 400
        
    code = request.args.get("code")
    if not code:
        logger.error("No authorization code received")
        return "No authorization code received.", 400
    
    try:
        google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
        token_endpoint = google_provider_cfg["token_endpoint"]

        redirect_uri = get_redirect_uri()
        
        host = request.headers.get('X-Forwarded-Host') or request.headers.get('Host') or request.host
        scheme = request.headers.get('X-Forwarded-Proto', 'https')
        authorization_response = f"{scheme}://{host}{request.full_path}"
        
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=authorization_response,
            redirect_url=redirect_uri,
            code=code,
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )
        
        token_data = token_response.json()
        if "error" in token_data:
            logger.error(f"Token error: {token_data}")
            return f"Token error: {token_data.get('error_description', token_data.get('error'))}", 400

        client.parse_request_body_response(json.dumps(token_data))

        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)

        userinfo = userinfo_response.json()
        logger.info(f"User info received: {userinfo.get('email', 'no email')}")
        
        if userinfo.get("email_verified"):
            users_email = userinfo["email"]
            users_name = userinfo.get("given_name", "")
            users_last_name = userinfo.get("family_name", "")
            users_picture = userinfo.get("picture", "")
        else:
            logger.error("User email not verified")
            return "User email not available or not verified by Google.", 400

        user = User.query.filter_by(email=users_email).first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email=users_email,
                first_name=users_name,
                last_name=users_last_name,
                profile_image_url=users_picture
            )
            db.session.add(user)
            db.session.commit()
            logger.info(f"New user created: {users_email}")
        else:
            user.first_name = users_name
            user.last_name = users_last_name
            user.profile_image_url = users_picture
            db.session.commit()
            logger.info(f"User updated: {users_email}")

        login_user(user)
        logger.info(f"User logged in: {users_email}")

        return redirect("/")
    except Exception as e:
        logger.error(f"Google OAuth callback error: {str(e)}")
        return f"Authentication error: {str(e)}", 500


@google_auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")
