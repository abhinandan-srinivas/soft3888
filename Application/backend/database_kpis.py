from flask import Flask
from sqlalchemy import text
from datetime import datetime

import os

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:666666@127.0.0.1:5432/dummy_soft3888'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def sql_ed_triage(db, hospital, hospital_dict):
    # sql query as a sting: aims to assign a category which depends on the amount of time patients have been in the ED
    sql_query = text(
    "SELECT * , CAST(ArrivalDateTime AS DATE) AS ArrivalDate, Arrival_day AS ArrivalDay, "
    +"CASE WHEN StayInED <= 2*60  "
    +"AND  DischargeDisposition IS NULL "
    +"THEN 1 "
    +"WHEN StayInED > 2*60  AND StayInED <= 3*60    "
    +"AND  DischargeDisposition IS NULL "
    +"THEN 2 "
    +"WHEN StayInED > 3*60  AND StayInED <= 4*60   "
    +"AND  DischargeDisposition IS NULL  "
    +"THEN 3 "
    +"WHEN StayInED > 4*60  AND StayInED <= 1440   "
    +"AND  DischargeDisposition IS NULL  "
    +"THEN 4 "
    +"WHEN StayInED > 1440   "
    +"AND  DischargeDisposition IS NULL "
    +"THEN 5 "
    +"ELSE 0 "
    +"END AS Status, ArrivalMode AS ArMode "

    +"FROM ED_MasterData  "
    +"RIGHT JOIN EDHoursRef HOUR "
    +"ON HOUR.ID = ED_MasterData.Arrival_hr "
    +"AND DischargeDisposition != 'Registered in Error'  "
    +"AND DischargeDisposition != '99'  "
    +"AND MRN NOT LIKE 'TEMP%'  "
    +"AND CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    +"ORDER BY Arrival_hr DESC "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    wait_in_ed = [0, 0, 0, 0, 0]

    hospital_dict['waiting_in_ed_hours'] = []

    # extracting the results from the query
    for res in db_result:
        if res[48] == hospital:
        # zero_two
            if res[58] == 1:
                wait_in_ed[0] += 1
        #two_three
            elif res[58] == 2:
                wait_in_ed[1] += 1
        # three_four
            elif res[58] == 3:
                wait_in_ed[2] += 1
        # four_twentyfour
            elif res[58] == 4:
                wait_in_ed[3] += 1
        # > 24
            elif res[58] == 5:
                wait_in_ed[4] += 1

    # inserting the results into a python dict
    hospital_dict['waiting_in_ed_hours'].append({
        'zero_two': wait_in_ed[0],
        'two_three': wait_in_ed[1],
        'three_four': wait_in_ed[2],
        'four_twentyfour': wait_in_ed[3]
    })

    # sql query as a sting
    sql_query = text(
    "SELECT DateReported AS  TriageDate, Facility AS FacilityName, 'Cat-1: Resuscitation' AS EDDTriageCategory, 1 AS EDDTriageCategoryNum, "
    +"Triage1Presentation AS TriagePresentation,  "
    +"Triage1WithinBenchmark AS TriageWithinBenchmark, "
    +"'0.999' AS TriageTargetBenchmark "
    +"FROM EDDailyData   "
    +"WHERE  CAST(DateReported as date) =  '2019-09-07' "
    +"UNION "
    +"SELECT DateReported AS  TriageDate, Facility AS FacilityName, 'Cat-2: Emergency' AS EDDTriageCategory, 2 AS EDDTriageCategoryNum, "
    +"Triage2Presentation AS TriagePresentation,  "
    +"Triage2WithinBenchmark AS TriageWithinBenchmark, "
    +"'0.800' AS TriageTargetBenchmark "
    +"FROM public.EDDailyData   "
    +"WHERE CAST(DateReported AS DATE) =  '2019-09-07' "
    +"UNION "
    +"SELECT DateReported AS  TriageDate, Facility AS FacilityName, 'Cat-3: Urgent' AS EDDTriageCategory, 3 AS EDDTriageCategoryNum, "
    +"Triage3Presentation AS TriagePresentation,  "
    +"Triage3WithinBenchmark AS TriageWithinBenchmark,  "
    +"'0.750' AS TriageTargetBenchmark "
    +"FROM public.EDDailyData   "
    +"WHERE CAST(DateReported AS DATE) =  '2019-09-07' "
    +"UNION "
    +"SELECT DateReported AS  TriageDate,  Facility AS FacilityName, 'Cat-4: Semi urgent' AS EDDTriageCategory, 4 AS EDDTriageCategoryNum, "
    +"Triage4Presentation AS TriagePresentation,  "
    +"Triage4WithinBenchmark AS TriageWithinBenchmark, "
    +"'0.700' AS TriageTargetBenchmark "
    +"FROM public.EDDailyData "
    +"WHERE CAST(DateReported AS DATE) =  '2019-09-07' "
    +"UNION "
    +"SELECT DateReported AS  TriageDate,  Facility AS FacilityName, 'Cat-5: Non urgent' AS EDDTriageCategory, 5 AS EDDTriageCategoryNum, "
    +"Triage5Presentation AS TriagePresentation, "
    +"Triage5WithinBenchmark AS TriageWithinBenchmark, "
    +"'0.700' AS TriageTargetBenchmark "
    +"FROM public.EDDailyData  "
    +"WHERE CAST(DateReported AS DATE) =  '2019-09-07' "
    +"UNION "
    +"SELECT DateReported AS  TriageDate,  Facility, 'Unallocated' AS EDDTriageCategory, 6 AS EDDTriageCategoryNum,  "
    +"UnallocatedPresentation AS TriagePresentation,  "
    +"UnallocatedPresentation AS TriageWithinBenchmark, "
    +"'0.999' AS TriageTargetBenchmark "
    +"FROM public.EDDailyData "
    +"WHERE CAST(DateReported AS DATE) =  '2019-09-07' "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    triage = [0, 0, 0, 0, 0, 0]

    # extracting the results from the query
    for res in db_result:
        if res[1] == hospital:
        # zero_two
            if res[3] == 1:
                triage[0] += res[4]
        #two_three
            elif res[3] == 2:
                triage[1] += res[4]
        # three_four
            elif res[3] == 3:
                triage[2] += res[4]
        # four_twentyfour
            elif res[3] == 4:
                triage[3] += res[4]
        # > 24
            elif res[3] == 5:
                triage[4] += res[4]

            elif res[3] == 6:
                triage[5] += res[4]

    # inserting the results into a python dict
    hospital_dict['triage'] = []

    hospital_dict['triage'].append({
        'one': triage[0],
        'two': triage[1],
        'three': triage[2],
        'four': triage[3],
        'five': triage[4],
    })

    return hospital_dict

# returns the number of patients per hospital that arrived in the ED
# yesterday, and are still in the ED

# return order: Auburn, Blacktown, Mt. Druitt, Westmead
def sql_EDYesterday(db):
    # NOW = 5th september 8pm
    # YYYY-MM-DD
    # replace *date* with cast((now()) as date)

    # sql query as a sting
    sql_EDYesterday_query = text(
    "SELECT COUNT(*) AS YesterdayEncounter, FacilityName "
    +"FROM ED_MasterData "
    +"WHERE "
    +"DischargeDisposition != 'Registered in Error' "
    +"AND "
    +"DischargeDisposition != '99' "
    +"AND "
    +"DischargeDisposition IS NULL "
    +"AND "
    +"Facility IN ('D224', 'D218', 'D201','D203') "
    +"AND "
    +"CAST(ArrivalDateTime AS DATE) >= '2019-09-06' "
    +"AND CAST(ArrivalDateTime AS DATE) < '2019-09-07' "
    +"AND Mrn NOT like 'TEMP%' "
    +"GROUP BY FacilityName, Facility "
    )

    # execute above query
    result_EDYesterday = db.engine.execute(sql_EDYesterday_query)

    results = []

    # extracting the results from the query
    for res in result_EDYesterday:
        results.append(res[0])

    return results

# returns the number of patients per hospital that were discharged today that
# had been in the ED for longer than 24 hrs

# return order: Auburn, Blacktown, Mt. Druitt, Westmead
def sql_Above24hr(db):
    # sql query as a sting
    sql_Above24hr_query = text(
    "SELECT FacilityName, COUNT(*) AS Above24hrs  FROM ED_MasterData "
    +"WHERE CAST(DischargeDateTime as DATE) =  '2019-09-07' "
    +"AND CAST(ArrivalDateTime AS DATE) >= '2019-08-30' "
    +"AND CAST(ArrivalDateTime AS DATE) < '2019-09-07' "
    +"AND StayInED > 24*60 AND Facility IN ('D224', 'D218', 'D201','D203') "
    +"GROUP BY FacilityName "
    )

    # execute above query
    result_Above24hr = db.engine.execute(sql_Above24hr_query)

    results = []

    # extracting the results from the query
    for res in result_Above24hr:
        results.append(res[1])

    return results

# returns the most recent creating date and time
# return format: string with date and time
def sql_RefreshDate(db):
    # sql query as a sting
    sql_RefreshDate_query = text(
    "SELECT MAX(CreatingDateTime) AS RefreshDate FROM ED_MasterData"
    )

    # execute above query
    result_RefreshDate = db.engine.execute(sql_RefreshDate_query)

    result = ''

    # extracting the results from the query
    for res in result_RefreshDate:
        result = res[0].strftime("%d/%m/%Y, %H:%M:%S")

    return result

def sql_general(db, hospital, hospital_dict):
    # sql query as a sting
    sql_in_ed_query = text(
    "SELECT facility, presentation, over24hours FROM eddailydata "
    + "WHERE CAST(DateReported AS DATE) =  '2019-09-07' "
    + "GROUP BY facility, presentation, over24hours "
    )

    # execute above query
    result_in_ed = db.engine.execute(sql_in_ed_query)

    results = []

    # extracting the results from the query
    for res in result_in_ed:
        if(res[0] == hospital):
            results.append(res[1])

    # sql query as a sting
    sql_7_days_query = text(
    "SELECT facility, presentation, over24hours, datereported FROM eddailydata "
    + " WHERE CAST(DateReported AS DATE) > CAST('2019-09-07' AS DATE) - interval '7 days' "
    + "AND CAST(DateReported AS DATE) <= '2019-09-07' "
    + "GROUP BY facility, datereported, presentation, over24hours "
    )

    # execute above query
    result_7_days = db.engine.execute(sql_7_days_query)

    result_days = 0

    hospital_dict['presentation_chart_data'] = []

    # extracting the results from the query
    for res in result_7_days:
        if(res[0] == hospital):
            result_days += res[2]

            hospital_dict['presentation_chart_data'].append({
                'date': res[3].strftime("%d/%m/%Y"),
                'number':res[1]
                # res[3].strftime("%d/%m/%Y"): res[1]
            })

    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) AS waiting_total  FROM ED_MasterData "
    +"WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    +"AND DischargeDisposition IS NULL "
    +"GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    in_ed = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            in_ed = res[1]

    # inserting the results into a python dict
    hospital_dict['general'] = []

    hospital_dict['general'].append({
        'in_ed': in_ed,
        'since_midnight': results[0],
        'last_seven_days': result_days
    })

    return hospital_dict

def sql_waiting(db, hospital, hospital_dict):
    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) AS waiting_total  FROM ED_MasterData "
    +"WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    +"AND DischargeDisposition IS NULL "
    +"GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    waiting_total = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            waiting_total = res[1]

    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) AS not_triaged  FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND triagecategory = 'Unallocated' "
    + "GROUP BY FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    not_triaged = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            not_triaged = res[1]

    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) AS not_seen  FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND seenbydoctor IS NULL "
    + "AND seenbynurse IS NULL "
    + "GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    not_seen = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            not_seen = res[1]

    # sql query as a sting
    sql_query = text(
    "SELECT COUNT(*), FacilityName as departed FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND DischargeDisposition = 'Departed -Did Not Wait' "
    + "OR CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND DischargeDisposition = 'Did Not Wait' "
    + "GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    departed = 0

    # extracting the results from the query
    for res in db_result:
        if res[1] == hospital:
            departed = res[0]

    # inserting the results into a python dict
    hospital_dict['waiting_in_ed_count'] = []

    hospital_dict['waiting_in_ed_count'].append({
        'waiting_in_ed_count_total': waiting_total,
        'not_triaged': not_triaged,
        'not_seen': not_seen,
        'departed': departed
    })

    return hospital_dict

def sql_admits(db, hospital, hospital_dict):
    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) as admits_no_speciality FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND AdmitReason IS NOT NULL "
    + "AND Speciality IS NULL "
    + "GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    all_no_speciality = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            all_no_speciality = res[1]

    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) as admits_no_speciality FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND AdmitReason IS NOT NULL "
    + "AND Speciality IS NULL "
    + "AND DischargeDisposition = 'Adm To Ward/Inpt, not Critical Care' "
    + "OR DischargeDisposition = 'Adm via Operating Suite' "
    + "GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    transferred_no_speciality = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            transferred_no_speciality = res[1]

    # inserting the results into a python dict
    hospital_dict['ed_admits_no_specialty'] = []

    if all_no_speciality == 0:                                  #TO:DO remove this code// added by abhi
            all_no_speciality=1

    hospital_dict['ed_admits_no_specialty'].append({
        'all_admits': all_no_speciality,
        'transferred': transferred_no_speciality,
        'percentage': round((transferred_no_speciality/all_no_speciality)*100, 2)
    })

    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) as admits_no_speciality FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND AdmitReason IS NOT NULL "
    + "AND Speciality IS NOT NULL "
    + "GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    all_speciality = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            all_speciality = res[1]

    if all_speciality == 0:  #TO:DO REMOVE THIS ADDED BY ABHI ######################################
        all_speciality = 1

    # sql query as a sting
    sql_query = text(
    "SELECT FacilityName, COUNT(*) as admits_no_speciality FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND AdmitReason IS NOT NULL "
    + "AND Speciality IS NOT NULL "
    + "AND DischargeDisposition = 'Adm To Ward/Inpt, not Critical Care' "
    + "OR DischargeDisposition = 'Adm via Operating Suite' "
    + "GROUP BY FacilityName "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    transferred_speciality = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            transferred_speciality = res[1]

    # inserting the results into a python dict
    hospital_dict['ed_admits_specialty'] = []

    hospital_dict['ed_admits_specialty'].append({
        'all_admits': all_speciality,
        'transferred': transferred_speciality,
        'percentage': round((transferred_speciality/all_speciality)*100, 2)
    })

    # inserting the results into a python dict
    hospital_dict['ed_all_etp'] = []

    hospital_dict['ed_all_etp'].append({
        'all_admits': (all_speciality + all_no_speciality),
        'transferred': (transferred_speciality + transferred_no_speciality),
        'percentage': round(((transferred_speciality + transferred_no_speciality)/(all_speciality + all_no_speciality))*100, 2)
    })

    return hospital_dict

def sql_presentations(db, hospital, hospital_dict):
    # sql query as a sting
    sql_query = text(
    "SELECT Facility, presentation FROM EDDailyData "
    + "WHERE CAST(DateReported AS DATE) = '2019-09-07' "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    presentations = 0

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            presentations = res[1]

    # inserting the results into a python dict
    hospital_dict['presentations'] = presentations

    return hospital_dict

def sql_ready_to_depart_to_discharged(db, hospital, hospital_dict):
    # sql query as a sting
    sql_query = text(
    "SELECT facilityname, "
    + "EXTRACT(hour FROM CAST(dischargedatetime - readytodepartdatetime AS TIME) )*60*60 + EXTRACT(minutes FROM CAST(dischargedatetime - readytodepartdatetime AS TIME) )*60 + EXTRACT(seconds FROM CAST(dischargedatetime - readytodepartdatetime AS TIME) ) "
    + "FROM ED_masterdata "
    + "WHERE CAST(arrivaldatetime AS DATE) = '2019-09-07' "
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    # 0-2, 2-4, 4-6, 6-8, 8+ hrs
    time_categories = [0, 0, 0, 0, 0]

    # extracting the results from the query
    for res in db_result:
        if res[0] == hospital:
            if res[1] is None:
                continue
            # 0 - 2 hrs
            elif 0 < res[1] <= 2*60*60:
                time_categories[0] += 1
            # 2 - 4 hrs
            elif 2*60*60 < res[1] <= 4*60*60:
                time_categories[1] += 1
            # 4 - 6 hrs
            elif 4*60*60 < res[1] <= 6*60*60:
                time_categories[2] += 1
            # 6 - 8 hrs
            elif 6*60*60 < res[1] <= 8*60*60:
                time_categories[3] += 1
            # 8+ hrs
            elif res[1] > 8*60*60:
                time_categories[4] += 1

    # inserting the results into a python dict
    hospital_dict['ready_to_depart_to_discharged'] = []

    hospital_dict['ready_to_depart_to_discharged'].append({
        'zero_two': time_categories[0],
        'two_four': time_categories[1],
        'four_six': time_categories[2],
        'six_eight': time_categories[3],
        'eight_up': time_categories[4]
    })

    return hospital_dict

def sql_waiting_in_ed_expanded(db, hospital, hospital_dict):
    # sql query as a sting
    # expanded zero - two hours
    sql_query = text(
    "SELECT COUNT(*), Speciality, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED <= 2*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY Speciality, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    hospital_dict['expanded_zero_two_speciality'] = []

    for res in db_result:
        if res[2] == hospital:
            hospital_dict['expanded_zero_two_speciality'].append({
                res[1]: res[0]
            })

    # expanded 0 - 2 hrs triage category
    sql_query = text(
    "SELECT COUNT(*), triagecategory, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED <= 2*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY triagecategory, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    triage = [0, 0, 0, 0, 0, 0]

    for res in db_result:
        if res[2] == hospital:
            triage[res[1]-1] = res[0]

    # inserting the results into a python dict
    hospital_dict['expanded_zero_two_triage'] = []

    hospital_dict['expanded_zero_two_triage'].append({
        'cat1': triage[0],
        'cat2': triage[1],
        'cat3': triage[2],
        'cat4': triage[3],
        'cat5': triage[4],
        'unallocated': triage[5]
    })



    # sql query as a sting
    # expanded 2 - 3 hours
    sql_query = text(
    "SELECT COUNT(*), Speciality, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED > 2*60  AND StayInED <= 3*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY Speciality, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    hospital_dict['expanded_two_three_speciality'] = []

    for res in db_result:
        if res[2] == hospital:
            hospital_dict['expanded_two_three_speciality'].append({
                res[1]: res[0]
            })

    # expanded 2 - 3 hrs triage category
    sql_query = text(
    "SELECT COUNT(*), triagecategory, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED > 2*60  AND StayInED <= 3*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY triagecategory, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    triage = [0, 0, 0, 0, 0, 0]

    for res in db_result:
        if res[2] == hospital:
            triage[res[1]-1] = res[0]

    # inserting the results into a python dict
    hospital_dict['expanded_two_three_triage'] = []

    hospital_dict['expanded_two_three_triage'].append({
        'cat1': triage[0],
        'cat2': triage[1],
        'cat3': triage[2],
        'cat4': triage[3],
        'cat5': triage[4],
        'unallocated': triage[5]
    })

    # sql query as a sting
    # expanded 3 - 4 hours
    sql_query = text(
    "SELECT COUNT(*), Speciality, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED > 3*60  AND StayInED <= 4*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY Speciality, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    hospital_dict['expanded_three_four_speciality'] = []

    for res in db_result:
        if res[2] == hospital:
            hospital_dict['expanded_three_four_speciality'].append({
                res[1]: res[0]
            })

    # expanded 3 - 4 hrs triage category
    sql_query = text(
    "SELECT COUNT(*), triagecategory, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED > 3*60  AND StayInED <= 4*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY triagecategory, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    triage = [0, 0, 0, 0, 0, 0]

    for res in db_result:
        if res[2] == hospital:
            triage[res[1]-1] = res[0]

    # inserting the results into a python dict
    hospital_dict['expanded_three_four_triage'] = []

    hospital_dict['expanded_three_four_triage'].append({
        'cat1': triage[0],
        'cat2': triage[1],
        'cat3': triage[2],
        'cat4': triage[3],
        'cat5': triage[4],
        'unallocated': triage[5]
    })


    # sql query as a sting
    # expanded 4 - 24 hours
    sql_query = text(
    "SELECT COUNT(*), Speciality, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED > 4*60  AND StayInED <= 24*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY Speciality, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    hospital_dict['expanded_four_twentyfour_speciality'] = []

    for res in db_result:
        if res[2] == hospital:
            hospital_dict['expanded_four_twentyfour_speciality'].append({
                res[1]: res[0]
            })

    # expanded 4 - 24 hrs triage category
    sql_query = text(
    "SELECT COUNT(*), triagecategory, FacilityName FROM ED_MasterData "
    + "WHERE CAST(ArrivalDateTime AS DATE) = '2019-09-07' "
    + "AND StayInED > 4*60  AND StayInED <= 24*60 "
    + "AND DischargeDisposition IS NULL "
    + "AND DischargeDisposition != 'Registered in Error' "
    + "AND DischargeDisposition != '99' "
    + "AND MRN NOT LIKE 'TEMP%' "
    + "GROUP BY triagecategory, FacilityName"
    )

    # execute above query
    db_result = db.engine.execute(sql_query)

    triage = [0, 0, 0, 0, 0, 0]

    for res in db_result:
        if res[2] == hospital:
            triage[res[1]-1] = res[0]

    # inserting the results into a python dict
    hospital_dict['expanded_four_twentyfour_triage'] = []

    hospital_dict['expanded_four_twentyfour_triage'].append({
        'cat1': triage[0],
        'cat2': triage[1],
        'cat3': triage[2],
        'cat4': triage[3],
        'cat5': triage[4],
        'unallocated': triage[5]
    })

    return hospital_dict


# how to run code
auburn_dict = {}
blacktown_dict = {}
mt_druitt_dict = {}
westmead_dict = {}

hospitals = ['Auburn', 'Blacktown', 'Mt. Druitt', 'Westmead']

hospital_dicts = [auburn_dict, blacktown_dict, mt_druitt_dict, westmead_dict]

for i in range(0,4):
    hospital_dicts[i] = sql_ed_triage(db, hospitals[i], hospital_dicts[i])
    hospital_dicts[i] = sql_general(db, hospitals[i], hospital_dicts[i])
    hospital_dicts[i] = sql_waiting(db, hospitals[i], hospital_dicts[i])
    hospital_dicts[i] = sql_admits(db, hospitals[i], hospital_dicts[i])
    hospital_dicts[i] = sql_presentations(db, hospitals[i], hospital_dicts[i])
    hospital_dicts[i] = sql_ready_to_depart_to_discharged(db, hospitals[i], hospital_dicts[i])
    hospital_dicts[i] = sql_waiting_in_ed_expanded(db, hospitals[i], hospital_dicts[i])

    print(hospitals[i])
    print(hospital_dicts[i])

def ret_hospital_data():
    summary_dicts = {}
    summary_dicts["Auburn"] = hospital_dicts[0]
    summary_dicts["Blacktown"] = hospital_dicts[1]
    summary_dicts["Mt. Druitt"] = hospital_dicts[2]
    summary_dicts["Westmead"] = hospital_dicts[3]
    return summary_dicts
