#!/usr/bin/env python

import cgi

form = cgi.FieldStorage()

csv = form.getvalue('csv')


availibilityFile = open('availability/availability.csv','w')
header="Date,Time\n"
availibilityFile.write(header)
for line in csv:
    availibilityFile.write(line)

availibilityFile.close()