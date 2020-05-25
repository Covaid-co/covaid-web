import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import csv

def sendEmail(receiver_address, city, org_name):
    mail_content = '''
    Hi ''' + org_name + ''',<br><br>
    My name is Jeffrey, and I'm a senior at Carnegie Mellon University. I've recently been working 
    on a software platform called <a href="https://www.covaid.co/organizationPortal">Covaid</a> that intends 
    to organize and simplify the volunteer/requester matching workflow for mutual aid groups.<br><br>
    Our team came across the fantastic work your group is doing in ''' + city + ''' – we're trying 
    to learn more about mutual aid across the country and would love to hear more about what
    is or isn't working for you all so far. We would also appreciate any feedback you would 
    be able to provide on what we could be doing better in the mutual aid world. If you're 
    open to a 20-minute Zoom call sometime this week, please let us know!<br><br>
    In solidarity,<br>
    Jeffrey Li'''

    sender_address = 'covaidco@gmail.com'
    sender_pass = 'covaid_platform_2020!'
    
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address
    message['Subject'] = 'Feedback/Questions about ' + org_name

    message.attach(MIMEText(mail_content, 'html'))
    session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
    session.starttls() #enable security
    session.login(sender_address, sender_pass) #login with mail_id and password
    text = message.as_string()
    session.sendmail(sender_address, receiver_address, text)
    session.quit()
    print('Mail Sent to ' + org_name)


def findCity(city):
    splitted = city.split(',')
    res = splitted[0].strip()
    return res

def run():
    with open('Mutual Aid Group Tracker - Sheet1.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        count = 0
        for row in reader:
            count += 1
            if (count < 35 or count > 65):
                continue
            address = row[3]
            city = findCity(row[1])
            org_name = row[0]
            print(count, city)
            sendEmail(address, city, org_name)

    # sendEmail('lijeffrey39@gmail.com', 'Pittsburgh', 'Pittsburgh Mutual Aid')


run()