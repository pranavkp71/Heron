import pytest
from unittest.mock import MagicMock, patch
from app.services.silence_detector import detect_silence

@patch('app.services.silence_detector.time.time')
@patch('app.services.silence_detector.send_slack_alert')
@patch('app.services.silence_detector.create_incident')
def test_detect_silence_creates_incident(mock_create_incident, mock_send_slack, mock_time, mock_db_connection):
    mock_cursor = MagicMock()
    mock_db_connection.cursor.return_value = mock_cursor

    now = 1620001000
    mock_time.return_value = now

    mock_cursor.fetchall.return_value = [
        ("test_api_key", "heartbeat", "worker", "production", 1620000000, 10, 20, False, "https://slack.com")
    ]

    detect_silence()

    mock_create_incident.assert_called_once_with("test_api_key", "heartbeat", "worker", "production")
    mock_send_slack.assert_called_once()
    
    assert mock_cursor.execute.call_count == 2
    update_call_args = mock_cursor.execute.call_args_list[1][0]
    assert "UPDATE event_stats" in update_call_args[0]
    assert "SET incident_active=TRUE" in update_call_args[0]
    assert mock_db_connection.commit.called

@patch('app.services.silence_detector.time.time')
@patch('app.services.silence_detector.send_slack_alert')
@patch('app.services.silence_detector.resolve_incident')
def test_detect_silence_resolves_incident(mock_resolve_incident, mock_send_slack, mock_time, mock_db_connection):
    mock_cursor = MagicMock()
    mock_db_connection.cursor.return_value = mock_cursor

    mock_resolve_incident.return_value = 1000

    now = 1620000010
    mock_time.return_value = now

    mock_cursor.fetchall.return_value = [
        ("test_api_key", "heartbeat", "worker", "production", 1620000000, 100, 20, True, "https://slack.com")
    ]

    detect_silence()

    mock_resolve_incident.assert_called_once_with("test_api_key", "heartbeat", "worker", "production")
    mock_send_slack.assert_called_once()
    
    assert mock_cursor.execute.call_count == 2
    update_call_args = mock_cursor.execute.call_args_list[1][0]
    assert "SET incident_active=FALSE" in update_call_args[0]
    assert mock_db_connection.commit.called
