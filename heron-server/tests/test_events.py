import pytest
from unittest.mock import MagicMock, patch
from app.services.event_service import store_events
from app.services.event_stats_service import update_event_stats

@patch('app.services.event_service.update_event_stats')
def test_store_events(mock_update_stats, mock_db_connection):
    mock_cursor = MagicMock()
    mock_db_connection.cursor.return_value = mock_cursor

    api_key = "test_api_key"
    events = [
        {
            "event_name": "user_signup",
            "service": "api",
            "environment": "production",
            "metadata": {"user_id": 123},
            "timestamp": 1620000000
        }
    ]

    store_events(api_key, events)

    assert mock_cursor.execute.call_count == 1
    assert mock_db_connection.commit.called
    mock_update_stats.assert_called_once_with(api_key, events[0])

def test_update_event_stats_new_event(mock_db_connection):
    mock_cursor = MagicMock()
    mock_db_connection.cursor.return_value = mock_cursor

    api_key = "test_api_key"
    event = {
        "event_name": "user_signup",
        "service": "api",
        "environment": "production",
        "timestamp": 1620000000
    }

    mock_cursor.fetchone.return_value = None

    update_event_stats(api_key, event)

    assert mock_cursor.execute.call_count == 2
    
    insert_call_args = mock_cursor.execute.call_args_list[1][0]
    assert "INSERT INTO event_stats" in insert_call_args[0]
    assert insert_call_args[1] == (api_key, "user_signup", "api", "production", 1620000000, 0, 1)
    assert mock_db_connection.commit.called

def test_update_event_stats_existing_event(mock_db_connection):
    mock_cursor = MagicMock()
    mock_db_connection.cursor.return_value = mock_cursor

    api_key = "test_api_key"
    event = {
        "event_name": "user_signup",
        "service": "api",
        "environment": "production",
        "timestamp": 1620000060
    }

    mock_cursor.fetchone.return_value = (1620000000, 10, 5)

    update_event_stats(api_key, event)

    assert mock_cursor.execute.call_count == 2
    
    update_call_args = mock_cursor.execute.call_args_list[1][0]
    assert "UPDATE event_stats" in update_call_args[0]
    passed_params = update_call_args[1]
    
    assert passed_params[0] == 1620000060  # new last_seen
    assert abs(passed_params[1] - 18.333333) < 0.001  # new avg
    assert passed_params[2] == 6  # new count
    assert mock_db_connection.commit.called
