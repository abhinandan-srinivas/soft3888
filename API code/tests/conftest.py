import sys
sys.path.append("..")
import server_initialization 
import server
import database_comments
import database_definitions
import database_kpis
import pytest
from flask import url_for

@pytest.fixture
def app():
    app = server_initialization.create_app()
    return app
