#!/usr/bin/env python

import cgi
import smtplib
import ConfigParser
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText


form = cgi.FieldStorage()

val1 = form.getvalue('name')
val2 = form.getvalue('skype')
val3 = form.getvalue('date')
val4 = form.getvalue('time')
val5 = form.getvalue('email')
comments = form.getvalue('comments')


cancelledBookingLine = val1 + "," + val2 + "," + val3 + "," + val4 + ',' + val5 + '\n'

bookingFile = open('availability/bookings.csv','r+')
bookingLines = bookingFile.readlines()
bookingFile.close()
bookingFile = open('availability/bookings.csv','w')

for line in bookingLines:
    if line != cancelledBookingLine:
        bookingFile.write(line)

bookingFile.close()

adminConfig = ConfigParser.RawConfigParser()
tutorConfig = ConfigParser.RawConfigParser()

adminConfig.read('config/admin.properties')
tutorConfig.read('config/tutor.properties')


adminEmail = adminConfig.get('contact','email')
adminPassword = adminConfig.get('contact','password')
adminMailServer = adminConfig.get('contact','server')

studentEmail = val5

tutorName = tutorConfig.get('contact','name')



server = smtplib.SMTP(adminMailServer,587)

server.starttls()

server.login(adminEmail,adminPassword)

msg = MIMEMultipart()

msg['From'] = adminEmail

msg['To'] = studentEmail

msg['Subject'] = "Booking Cancellation"

body = "Your office hour booking with " + tutorName + " at " + val4 + " on the " + val3 +  " has been cancelled. \n" +  comments + "\n"

msg.attach(MIMEText(body,'plain'))

text = msg.as_string()

server.sendmail(adminEmail,studentEmail,text)

server.quit()

