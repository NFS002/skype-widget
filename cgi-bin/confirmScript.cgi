#!/usr/bin/env python

import cgi
import smtplib
import ConfigParser
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

form = cgi.FieldStorage()

val1 = form.getvalue('name').replace('+',' ')
val2 = form.getvalue('skype').replace('+',' ')
val3 = form.getvalue('date')
val4 = form.getvalue('time')
val5 = form.getvalue('email').replace('+',' ')

bookingLine = val1 + "," + val2 + "," + val3 + "," + val4 + "," + val5
unavailibilityLine = val3 + ',' + val4

bookings = open('availability/bookings.csv','a')
bookings.write(bookingLine   + '\n')
availibilityFile = open('availability/availability.csv','r+')
availibilityLines = availibilityFile.readlines()
availibilityFile.close()
availibilityFile = open('availability/availability.csv','w')

for line in availibilityLines:
    if unavailibilityLine not in line:
        availibilityFile.write(line)

availibilityFile.close()

adminConfig = ConfigParser.RawConfigParser()
tutorConfig = ConfigParser.RawConfigParser()

adminConfig.read('config/admin.properties')
tutorConfig.read('config/tutor.properties')

adminEmail = adminConfig.get('contact','email')
adminPassword = adminConfig.get('contact','password')
adminMailServer = adminConfig.get('contact','server')

tutorEmail = tutorConfig.get('contact','email')

server = smtplib.SMTP(adminMailServer,587)

server.starttls()

server.login(adminEmail,adminPassword)

msg = MIMEMultipart()

msg['From'] = adminEmail

msg['To'] = tutorEmail

msg['Subject'] = "New Booking"

body = "You have a new booking: " + val1 + " at " + val4 + " on the " + val3 +  "\nTheir email address is: " + val5 + "\nThis booking is now available for you to view online also"

msg.attach(MIMEText(body,'plain'))

text = msg.as_string()

server.sendmail(adminEmail,tutorEmail,text)

server.quit()









