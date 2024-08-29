// script.js
const calendarBody = document.getElementById('calendar-container');
const addDateBtn = document.getElementById('add-date-btn');

// generate calendar days
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const daysInMonth = getDaysInMonth(month, year);

for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay();
    const dayElement = document.createElement('td');
    dayElement.textContent = i;
    calendarBody.appendChild(dayElement);
}

// función para obtener el número de días en un mes
function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// add event listener to add date button
addDateBtn.addEventListener('click', () => {
    const dateInput = prompt('Ingrese la fecha importante (DD/MM/YYYY)');
    const dateParts = dateInput.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const importantDate = new Date(year, month, day);

        // agregar la fecha importante al calendario
        const importantDateElement = document.createElement('td');
        importantDateElement.textContent = day;
        importantDateElement.className = 'important-date';
        calendarBody.appendChild(importantDateElement);
    
        // guardar la fecha importante en la base de datos
        const userData = {
            importantDates: [
                {
                    date: importantDate,
                    notificationSent: false
                }
            ]
        };
    
        // función para guardar los datos en la base de datos
        function saveUserData(userData) {
            const MongoClient = require('mongodb').MongoClient;
            const url = 'mongodb://localhost:27017';
            const dbName = 'mydatabase';
    
            MongoClient.connect(url, function(err, client) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Connected to MongoDB');
                    const db = client.db(dbName);
                    const collection = db.collection('users');
    
                    collection.insertOne(userData, function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('User data saved successfully');
                        }
                    });
                }
            });
        }
    
        saveUserData(userData);
    });
    
    // función para enviar notificaciones un día antes
    function sendNotifications() {
        const MongoClient = require('mongodb').MongoClient;
        const url = 'mongodb://localhost:27017';
        const dbName = 'mydatabase';
    
        MongoClient.connect(url, function(err, client) {
            if (err) {
                console.log(err);
            } else {
                console.log('Connected to MongoDB');
                const db = client.db(dbName);
                const collection = db.collection('users');
    
                collection.find().toArray(function(err, users) {
                    if (err) {
                        console.log(err);
                    } else {
                        users.forEach(function(user) {
                            const importantDates = user.importantDates;
                            importantDates.forEach(function(importantDate) {
                                const today = new Date();
                                const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                                if (importantDate.date.getTime() === tomorrow.getTime()) {
                                    // enviar notificación por correo electrónico
                                    const nodemailer = require('nodemailer');
                                    const transporter = nodemailer.createTransport({
                                        host: 'smtp.example.com',
                                        port: 587,
                                        secure: false, // or 'STARTTLS'
                                        auth: {
                                            user: 'username',
                                            pass: 'password'
                                        }
                                    });
    
                                    const mailOptions = {
                                        from: 'username@example.com',
                                        to: user.email,
                                        subject: 'Recordatorio de fecha importante',
                                        text: `Recordatorio: ${importantDate.date.toLocaleDateString()}`
                                    };
    
                                    transporter.sendMail(mailOptions, function(err, info) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log('Email sent successfully');
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    }
    
    // ejecutar la función para enviar notificaciones cada día a las 12:00 AM
    setInterval(sendNotifications, 24 * 60 * 60 * 1000);

