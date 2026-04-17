import pytest
from unittest.mock import MagicMock, patch
import psycopg2

# We must mock this globally before any app imports, because app.database
# runs psycopg2.connect(...) natively at import time.
psycopg2.connect = MagicMock()

import app.database

@pytest.fixture(autouse=True)
def mock_db_connection():
    mock_conn = MagicMock()
    app.database.conn = mock_conn
    yield mock_conn
