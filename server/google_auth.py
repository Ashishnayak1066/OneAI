# Google OAuth authentication blueprint for Flask

import json
import os
import uuid
import secrets

import requests
from flask import Blueprint, redirect, request, url_for, session
from flask_login import login_user, logout_user, login_required
from oauthlib.oauth2 import WebApplicationClient

from server.database import db
from server.models import User

GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

google_auth = Blueprint("google_auth", __name__)

def get_google_client():
    client_id = os.environ.get("GOOGLE_OAUTH_CLIENT_ID")
    if not client_id:
        return None
    return WebApplicationClient(client_id)

def get_redirect_url():
    dev_domain = os.environ.get("REPLIT_DEV_DOMAIN")
    if dev_domain:
        return f'https://{dev_domain}/google_login/callback'
    return None

@google_auth.route("/google_login")
def login():
    client_id = os.environ.get("GOOGLE_OAUTH_CLIENT_ID")
    if not client_id:
        return "Google OAuth not configured. Please set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET.", 500
    
    client = get_google_client()
    
    try:
        google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    except Exception as e:
        return f"Error connecting to Google: {str(e)}", 500

    state = secrets.token_urlsafe(32)
    session['oauth_state'] = state

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url.replace("http://", "https://") + "/callback",
        scope=["openid", "email", "profile"],
        state=state,
    )
    return redirect(request_uri)


@google_auth.route("/google_login/callback")
def callback():
    client_id = os.environ.get("GOOGLE_OAUTH_CLIENT_ID")
    client_secret = os.environ.get("GOOGLE_OAUTH_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        return "Google OAuth not configured", 500
    
    state = request.args.get("state")
    stored_state = session.pop('oauth_state', None)
    
    if not state or state != stored_state:
        return "Invalid state parameter - possible CSRF attack", 400
    
    client = get_google_client()
    code = request.args.get("code")
    
    if not code:
        return "No authorization code received", 400
    
    try:
        google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
        token_endpoint = google_provider_cfg["token_endpoint"]
    except Exception as e:
        return f"Error connecting to Google: {str(e)}", 500

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
        auth=(client_id, client_secret),
    )

    client.parse_request_body_response(json.dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    userinfo = userinfo_response.json()
    if not userinfo.get("email_verified"):
        return "User email not available or not verified by Google.", 400

    users_email = userinfo["email"]
    users_name = userinfo.get("given_name", userinfo.get("name", "User"))
    profile_image = userinfo.get("picture")

    user = User.query.filter_by(email=users_email).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            email=users_email,
            first_name=users_name,
            last_name=userinfo.get("family_name", ""),
            profile_image_url=profile_image
        )
        db.session.add(user)
        db.session.commit()
    else:
        if profile_image and user.profile_image_url != profile_image:
            user.profile_image_url = profile_image
            db.session.commit()

    login_user(user)

    return redirect("/")


@google_auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")
