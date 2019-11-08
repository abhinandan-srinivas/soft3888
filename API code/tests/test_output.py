from flask import Flask, url_for


def test_login(client):
    res = client.get(url_for('login'))
    assert b'credentials' in res.data

def test_presentation(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'presentations' in auburn.data
    assert b'presentations' in westmead.data
    assert b'presentations' in blacktown.data
    assert b'presentations' in mtdruitt.data

def test_waiting_in_ed(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'waiting_in_ed_count' in auburn.data
    assert b'waiting_in_ed_count' in westmead.data
    assert b'waiting_in_ed_count' in blacktown.data
    assert b'waiting_in_ed_count' in mtdruitt.data

def test_edhours(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'waiting_in_ed_hours' in auburn.data
    assert b'waiting_in_ed_hours' in westmead.data
    assert b'waiting_in_ed_hours' in blacktown.data
    assert b'waiting_in_ed_hours' in mtdruitt.data
    

def test_ed_admits_no_specialty(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'ed_admits_no_specialty' in auburn.data
    assert b'ed_admits_no_specialty' in westmead.data
    assert b'ed_admits_no_specialty' in blacktown.data
    assert b'ed_admits_no_specialty' in mtdruitt.data

# def test_ed_non_admits_etp(client):
#     auburn = client.get(url_for('auburn_values'))
#     westmead = client.get(url_for('westmead_values'))
#     blacktown = client.get(url_for('blacktown_values'))
#     mtdruitt = client.get(url_for('mtdruitt_values'))
#     assert b'ed_non_admits_etp' in auburn.data
#     assert b'ed_non_admits_etp' in westmead.data
#     assert b'ed_non_admits_etp' in blacktown.data
#     assert b'ed_non_admits_etp' in mtdruitt.data

def test_ed_admits_specialty(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'ed_admits_specialty' in auburn.data
    assert b'ed_admits_specialty' in westmead.data
    assert b'ed_admits_specialty' in blacktown.data
    assert b'ed_admits_specialty' in mtdruitt.data

def test_general(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'ed_admits_specialty' in auburn.data
    assert b'ed_admits_specialty' in westmead.data
    assert b'ed_admits_specialty' in blacktown.data
    assert b'ed_admits_specialty' in mtdruitt.data

def test_triage(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'ed_admits_specialty' in auburn.data
    assert b'ed_admits_specialty' in westmead.data
    assert b'ed_admits_specialty' in blacktown.data
    assert b'ed_admits_specialty' in mtdruitt.data

def test_presentation_chart_data(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'presentation_chart_data' in auburn.data
    assert b'presentation_chart_data' in westmead.data
    assert b'presentation_chart_data' in blacktown.data
    assert b'presentation_chart_data' in mtdruitt.data

def test_ready_to_depart_to_discharged(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'ready_to_depart_to_discharged' in auburn.data
    assert b'ready_to_depart_to_discharged' in blacktown.data
    assert b'ready_to_depart_to_discharged' in westmead.data
    assert b'ready_to_depart_to_discharged' in mtdruitt.data


def test_waiting_in_ed_count(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'waiting_in_ed_count' in auburn.data
    assert b'waiting_in_ed_count' in westmead.data
    assert b'waiting_in_ed_count' in blacktown.data
    assert b'waiting_in_ed_count' in mtdruitt.data

def test_waiting_in_ed_hours(client):
    auburn = client.get(url_for('auburn_values'))
    westmead = client.get(url_for('westmead_values'))
    blacktown = client.get(url_for('blacktown_values'))
    mtdruitt = client.get(url_for('mtdruitt_values'))
    assert b'waiting_in_ed_hours' in auburn.data
    assert b'waiting_in_ed_hours' in westmead.data
    assert b'waiting_in_ed_hours' in blacktown.data
    assert b'waiting_in_ed_hours' in mtdruitt.data

def test_index(client):
    res = client.get(url_for('index'))
    assert b'edstats' in res.data
    assert b'login' in res.data

def test_comments(client):
    res = client.get(url_for('comment_handler'))
    assert b'comment' in res.data
    assert b'hospital' in res.data
    assert b'userid' in res.data
    assert b'time' in res.data

def test_definitions(client):
    res = client.get(url_for('definitions'))