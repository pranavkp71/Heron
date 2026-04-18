import pytest
from unittest.mock import MagicMock, patch

import app.database

@pytest.fixture(autouse=True)
def mock_db_connection():
    mock_conn = MagicMock()
    mock_pool = MagicMock()
    mock_pool.getconn.return_value = mock_conn
    
    with patch('app.database._get_pool', return_value=mock_pool):
        yield mock_conn

