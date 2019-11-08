from flask import Flask
from sqlalchemy import text

connection = db.session.connection()

# ED Yesterday | SQL
# connection.execute(
# SELECY count(*) as YesterdayEncounter, FacilityName
# FROM ED_MasterData (nolock)
# where DischargeDisposition != 'Registered in Error' AND
# DischargeDisposition != '99' AND
# DischargeDisposition = ''AND
# Facility in ('D224', 'D218', 'D201','D203') AND
# Cast(ArrivalDateTime as date) between cast(getdate() - 7 as date) and cast(getdate()-1 as date)
# AND Mrn NOT like 'TEMP%'
# group by FacilityName, Facility; )

sql = text('SELECT count(*) as YesterdayEncounter, FacilityName FROM ED_MasterData (nolock) WHERE DischargeDisposition != 'Registered in Error' AND DischargeDisposition != '99' AND DischargeDisposition = ''AND
# Facility in ('D224', 'D218', 'D201','D203') AND
# Cast(ArrivalDateTime as date) between cast(getdate() - 7 as date) and cast(getdate()-1 as date)
# AND Mrn NOT like 'TEMP%'
# group by FacilityName, Facility;')

result = db.engine.execute(sql)
names = [row[0] for row in result]
print names
