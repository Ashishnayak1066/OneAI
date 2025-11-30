import logging

from flask import Blueprint
from flask_login import LoginManager

from server.models import User

logger = logging.getLogger(__name__)

google_auth = Blueprint("google_auth", __name__)

def init_login_manager(app):
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "index"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    return login_manager
