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


@google_auth.route("/google_login")
def login():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return "Google OAuth not configured. Please add GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET.", 500
    
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url.replace("http://", "https://") + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@google_auth.route("/google_login/callback")
def callback():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return "Google OAuth not configured.", 500
        
    code = request.args.get("code")
    if not code:
        return "No authorization code received.", 400
        
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    token_endpoint = google_provider_cfg["token_endpoint"]

    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url.replace("http://", "https://"),
        redirect_url=request.base_url.replace("http://", "https://"),
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    client.parse_request_body_response(json.dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    userinfo = userinfo_response.json()
    if userinfo.get("email_verified"):
        users_email = userinfo["email"]
        users_name = userinfo.get("given_name", "")
        users_last_name = userinfo.get("family_name", "")
        users_picture = userinfo.get("picture", "")
    else:
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
    else:
        user.first_name = users_name
        user.last_name = users_last_name
        user.profile_image_url = users_picture
        db.session.commit()

    login_user(user)

    return redirect("/")


@google_auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")
